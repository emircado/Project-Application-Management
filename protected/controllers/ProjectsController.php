<?php

class ProjectsController extends Controller
{
    public $extraJS;
    public $modals;
    
    public function actionIndex()
    {
        $this->modals = 'projects-modal';
        $this->extraJS = '<script src="' . Yii::app()->request->baseUrl . '/js/projects1.js"></script>';
        $this->render('projects');
    }

    public function actionList()
    {
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

        for ($i = 0; $i < $projects['data_count']; $i++) {
            $projects['data'][$i]['production_date_formatted'] = ($projects['data'][$i]['production_date'] == '0000-00-00') ? 'N/A' : date(Yii::app()->params['date_display'], strtotime($projects['data'][$i]['production_date']));
            $projects['data'][$i]['termination_date_formatted'] = ($projects['data'][$i]['termination_date'] == '0000-00-00') ? 'N/A' : date(Yii::app()->params['date_display'], strtotime($projects['data'][$i]['termination_date']));
            $projects['data'][$i]['date_created_formatted'] = ($projects['data'][$i]['date_created'] == '0000-00-00 00:00:00') ? 'N/A' :date(Yii::app()->params['datetime_display'], strtotime($projects['data'][$i]['date_created']));
            $projects['data'][$i]['date_updated_formatted'] = ($projects['data'][$i]['date_updated'] == '0000-00-00 00:00:00') ? 'N/A' : date(Yii::app()->params['datetime_display'], strtotime($projects['data'][$i]['date_updated']));
        }

        $return_data = array(
            'page'=>$page,
            'totalPage'=>ceil($projects['total_count']/$limit),
            'totalData'=>$projects['total_count'],
            'limit'=>$limit,
            'resultData'=>$projects['data'],
        );

        echo CJSON::encode($return_data);
    }
    
    private function get_data($filter='', $limit=20, $offset=0)
    {
        $criteria = new CDbCriteria;
        $criteria->limit = $limit;
        $criteria->offset = $offset;

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

        foreach($model as $row)
        {
            $data[] = array(
                'project_id'        => $row->project_id,
                'name'              => $row->name,
                'code'              => $row->code,
                'description'       => $row->description,
                'status'            => $row->status,
                'production_date'   => $row->production_date,
                'termination_date'  => $row->termination_date,
                'date_created'      => $row->date_created,
                'date_updated'      => $row->date_updated
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
        $data = $_GET;
        //for creating a project
        if (empty($data['project_id'])) {
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

            if (count($errors) == 0) {
                $project = new Projects;
                $project->name = $data['name'];
                $project->code = strtoupper($data['code']);
                $project->description = $data['description'];
                $project->status = 'ACTIVE';
                $project->production_date = $data['production_date'];
                $project->termination_date = $data['termination_date'];
                $project->date_created = date("Y-m-d H:i:s");
                $project->date_updated = '0000-00-00 00:00:00';
                $project->save();
            } else {
                echo implode(',', $errors);
            }

        //for updating a project
        } else {
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

            if (count($errors) == 0) {
                $data['date_updated'] = date("Y-m-d H:i:s");
                Projects::model()->updateByPk((int) $_GET['project_id'], $data);

                $data['production_date_formatted'] = ($data['production_date'] == '0000-00-00') ? 'N/A' : date(Yii::app()->params['date_display'], strtotime($data['production_date']));
                $data['termination_date_formatted'] = ($data['termination_date'] == '0000-00-00') ? 'N/A' : date(Yii::app()->params['date_display'], strtotime($data['termination_date']));
                $data['date_created_formatted'] = ($data['date_created'] == '0000-00-00 00:00:00') ? 'N/A' : date(Yii::app()->params['datetime_display'], strtotime($data['date_created']));
                $data['date_updated_formatted'] = ($data['date_updated'] == '0000-00-00 00:00:00') ? 'N/A' : date(Yii::app()->params['datetime_display'], strtotime($data['date_updated']));

                echo CJSON::encode($data);   
            } else {
                echo implode(',', $errors);
            }
        }
    }
}