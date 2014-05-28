<?php

class ProjectsController extends Controller
{
    public $extraJS;
    public $modals;
    
    public function actionIndex()
    {
        $this->modals = array(
            'application-types-modal', 
            'application-servers-search-modal',
            'application-servers-list-modal',
            'application-servers-create-modal',
            'confirmation-modal',
        );
        
        $this->extraJS = '<script src="' . Yii::app()->request->baseUrl . '/js/data.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/projects.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/project-notes.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/contact-persons.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/point-persons.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/applications.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-notes.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-servers.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-point-persons.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/modal.js"></script>';
        $this->render('projects');
    }

    public function actionList()
    {
        $begin_time = microtime(true);

        $limit = Yii::app()->params['projects_per_page'];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page-1)*$limit;
        $filter = array();

        if (isset($_GET['name']) && (!empty($_GET['name']) || $_GET['name'] == '0'))
            $filter['name'] = (string) $_GET['name'];

        if (isset($_GET['code']) && (!empty($_GET['code']) || $_GET['code'] == '0'))
            $filter['code'] = (string) $_GET['code'];

        if (isset($_GET['status']) && !empty($_GET['status']))
            $filter['status'] = (string) $_GET['status'];

        $projects = $this->get_data($filter, $limit, $offset);

        $return_data = array(
            'page'=>$page,
            'totalPage'=> ($projects['total_count'] == 0) ? 1 : ceil($projects['total_count']/$limit),
            'totalData'=>$projects['total_count'],
            'limit'=>$limit,
            'resultData'=>$projects['data'],
        );

        $time = floor((microtime(true) - $begin_time) * 1000);
        //send time to graphite
        $sender = new GraphiteSender('statsd');
        $sender->send_projectlist($time);
        $sender = new GraphiteSender('direct');
        $sender->send_projectlist($time);

        echo CJSON::encode($return_data);
    }
    
    private function get_data($filter='', $limit=20, $offset=0)
    {
        $criteria = new CDbCriteria;
        $criteria->limit = $limit;
        $criteria->offset = $offset;
        $criteria->order = 'code';

        if(is_array($filter))
        {
            if(isset($filter['project_id']))
                $criteria->compare('project_id', $filter['project_id']);

            if(isset($filter['name']))
                $criteria->compare('name', $filter['name'], true, 'AND', true);

            if(isset($filter['code']))
                $criteria->compare('code', $filter['code'], true, 'AND', true);

            if(isset($filter['status']))
                $criteria->compare('status', $filter['status']);
        }
        
        if($filter)
            $count = Projects::model()->count($criteria);
        else
            $count = Projects::model()->count();

        $model = Projects::model()->findAll($criteria);
        $data  = array();

        //XSS Purifier here
        // $p = new CHtmlPurifier();
        // $p->options = array('URI.AllowedSchemes'=>array(
        //     'http' => true,
        //     'https' => true,
        // ));

        foreach($model as $row)
        {
            $data[] = array(
                'project_id'        => $row->project_id/*$p->purify($row->project_id)*/,
                'name'              => $row->name/*$p->purify($row->name)*/,
                'code'              => $row->code/*$p->purify($row->code)*/,
                'description'       => $row->description/*$p->purify($row->description)*/,
                'status'            => $row->status/*$p->purify($row->status)*/,
                'production_date'   => $row->production_date/*$p->purify($row->production_date)*/,
                'termination_date'  => $row->termination_date/*$p->purify($row->termination_date)*/,
                'date_created'      => $row->date_created/*$p->purify($row->date_created)*/,
                'date_updated'      => $row->date_updated/*$p->purify($row->date_updated)*/,
                'created_by'        => $row->created_by,
                'updated_by'        => $row->updated_by,
            );
        }

        return array(
            'data'=>$data,
            'data_count'=>count($data),
            'total_count'=>$count,          
        );
    }

    public function actionUpdate()
    {
        $data = $_POST;

        //will be empty if CSRF authentication fails
        if (!empty($data)) {
            $data['name'] = trim($data['name']);
            $data['code'] = trim($data['code']);
            $data['description'] = trim($data['description']);
            $data['production_date'] = trim($data['production_date']);

            //FORM VALIDATION HERE
            $errors = array();
            //code is required
            if (strlen($data['code']) == 0) {
                array_push($errors, 'CODE_ERROR: Code is required');
            //code must be at least 5 characters long
            } else if (strlen($data['code']) != 5) {
                array_push($errors, 'CODE_ERROR: Project code must be 5 characters');
            //check if code is alphanumeric
            } else if (!ctype_alnum($data['code'])) {
                array_push($errors, 'CODE_ERROR: Code must be alphanumeric');
            } else {
                //check if project code already exists
                $existing = Projects::model()->find('code = :code', array(":code"=>$data['code']));
                if ($existing != NULL && $existing->project_id != $data['project_id']) {
                    array_push($errors, 'CODE_ERROR: Code already taken');
                }
            }

            //data is good
            if (count($errors) == 0) {
                $updates = array(
                    'name'              => $data['name'],
                    'code'              => $data['code'],
                    'description'       => $data['description'],
                    'production_date'   => $data['production_date'],
                    'date_updated'      => date("Y-m-d H:i:s"),
                    'updated_by'        => Yii::app()->user->name,
                );

                Projects::model()->updateByPk((int) $data['project_id'], $updates);

                echo CJSON::encode(array(
                    'type' => 'success',
                    'data' => $updates,
                ));
            } else {
                echo CJSON::encode(array(
                    'type' => 'error',
                    'data' => implode(',', $errors),
                ));
            }
        } else {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => 'CSRF_ERROR: CSRF Token did not match',
            ));
        }
    }

    public function actionCreate()
    {
        $data = $_POST;

        //will be empty if CSRF authentication fails
        if (!empty($data)) {
            $data['name'] = trim($data['name']);
            $data['code'] = trim($data['code']);
            $data['description'] = trim($data['description']);
            $data['production_date'] = trim($data['production_date']);

            //FORM VALIDATION HERE
            $errors = array();
            //code is required
            if (strlen($data['code']) == 0) {
                array_push($errors, 'CODE_ERROR: Code is required');
            //code must be at least 5 characters long
            } else if (strlen($data['code']) != 5) {
                array_push($errors, 'CODE_ERROR: Project code must be 5 characters');
            //check if code is alphanumeric
            } else if (!ctype_alnum($data['code'])) {
                array_push($errors, 'CODE_ERROR: Code must be alphanumeric');
            //check if project code already exists
            } else if (Projects::model()->exists('code = :code', array(":code"=>$data['code']))) {
                array_push($errors, 'CODE_ERROR: Code already taken');
            }

            //data is good
            if (count($errors) == 0) {
                $project = new Projects;
                $project->name = $data['name'];
                $project->code = strtoupper($data['code']);
                $project->description = $data['description'];
                $project->status = 'ACTIVE';
                $project->production_date = $data['production_date'];
                $project->termination_date = '0000-00-00';
                $project->date_created = date("Y-m-d H:i:s");
                $project->date_updated = '0000-00-00 00:00:00';
                $project->created_by = Yii::app()->user->name;
                $project->save();

                echo CJSON::encode(array(
                    'type' => 'success',
                    'data' => '',
                ));
            } else {
                echo CJSON::encode(array(
                    'type' => 'error',
                    'data' => implode(',', $errors),
                ));
            }
        } else {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => 'CSRF_ERROR: CSRF Token did not match',
            ));
        }
    }

    public function actionChangeStatus()
    {
        $data = $_POST;

        //will be empty if CSRF authentication fails
        if (!empty($data)) {    
            $updates = array(
                'status'            => ($data['status'] == 'TERMINATED') ? 'ACTIVE' : 'TERMINATED',
                'termination_date'  => ($data['status'] == 'TERMINATED') ? '0000-00-00' : date("Y-m-d"),
                'date_updated'      => date("Y-m-d H:i:s"),
                'updated_by'        => Yii::app()->user->name,
            );

            Projects::model()->updateByPk((int) $data['project_id'], $updates);

            echo CJSON::encode(array(
                'type' => 'success',
                'data' => $updates,
            ));
        } else {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => 'CSRF_ERROR: CSRF Token did not match',
            ));
        }
    }

    public function actionDelete()
    {
        $data = $_POST;
        $project = Projects::model()->findByPk($data['project_id']);

        if (Yii::app()->user->name != $project['created_by']) {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => 'USER_ERROR: Only those who created the project can delete it',
            ));
            return;
        }

        // SQL query for project data
        $query = "\n"."INSERT INTO `projects` ";
        $keys = "(";
        $values = " VALUES\n(";

        $col_num = count(Projects::model()->attributes);
        foreach($project as $key => $value) {
            $keys .= "`".$key."`";
            $values .= ($value === null)? "NULL" : "'".$value."'";

            $col_num--;
            if ($col_num > 0) {
                $keys .= ', ';
                $values .= ', ';
            }
        }

        $keys .= ")";
        $values .= ")";
        $query .= $keys.$values.";\n";
        
        //SQL query for contact person data
        $contact_persons = ProjectContactPersons::model()->findAll('project_id=:project_id', array(':project_id'=>$data['project_id']));
        if (count($contact_persons) > 0) {
            $query .=  "\n"."INSERT INTO `project_contact_persons` ";
            $con_attr = ProjectContactPersons::model()->attributes;

            // collect attributes
            $keys = "(";
            $col_num = count($con_attr);
            foreach ($con_attr as $key => $values) {
                $keys .= "`".$key."`";
                $col_num--;
                if ($col_num > 0) {
                    $keys .= ', ';
                }
            }
            $keys .= ")";

            // collect rows
            $values = " VALUES";
            $con_count = count($contact_persons);
            foreach($contact_persons as $contact) {
                $values .= "\n(";
                $col_num = count($con_attr);
                foreach($contact as $key => $value) {
                    $values .= ($value === null)? "NULL" : "'".$value."'";
                    $col_num--;
                    if ($col_num > 0) {
                        $values .= ', ';
                    }
                }
                $values .= ")";
                $con_count--;
                if ($con_count > 0) {
                    $values .= ", ";
                }
            }
            $query .= $keys.$values.";\n";
        }

        //SQL query for point person data
        $point_persons = ProjectPointPersons::model()->findAll('project_id=:project_id', array(':project_id'=>$data['project_id']));
        if (count($point_persons) > 0) {
            $query .=  "\n"."INSERT INTO `project_point_persons` ";
            $pnt_attr = ProjectPointPersons::model()->attributes;

            // collect attributes
            $keys = "(";
            $col_num = count($pnt_attr);
            foreach ($pnt_attr as $key => $values) {
                $keys .= "`".$key."`";
                $col_num--;
                if ($col_num > 0) {
                    $keys .= ', ';
                }
            }
            $keys .= ")";

            // collect rows
            $values = " VALUES";
            $pnt_count = count($point_persons);
            foreach($point_persons as $point) {
                $values .= "\n(";
                $col_num = count($pnt_attr);
                foreach($point as $key => $value) {
                    $values .= ($value === null)? "NULL" : "'".$value."'";
                    $col_num--;
                    if ($col_num > 0) {
                        $values .= ', ';
                    }
                }
                $values .= ")";
                $pnt_count--;
                if ($pnt_count > 0) {
                    $values .= ", ";
                }
            }
            $query .= $keys.$values.";\n";
        }

        if (file_put_contents('deleted_projects.sql', $query, FILE_APPEND) === false) {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => '',
            ));
        } else {
            // delete record here
            Projects::model()->deleteByPk($data['project_id']);
            ProjectContactPersons::model()->deleteAll('project_id=:project_id', array(':project_id' => $data['project_id']));
            ProjectPointPersons::model()->deleteAll('project_id=:project_id', array(':project_id' => $data['project_id']));

            echo CJSON::encode(array(
                'type' => 'success',
                'data' => '',
            ));
        }
    }
}