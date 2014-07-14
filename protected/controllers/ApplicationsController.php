<?php

class ApplicationsController extends Controller
{
    public $extraJS;
    public $modals;
    
    public function filters()
    {
        return array(
            'accessControl',
            'postOnly + update, create, delete',
            'ajaxOnly + list, update, create, delete',
        );
    }

    public function accessRules()
    {
        return array(
            array(
                'allow',
                'actions'=>array('index','list','update','create','delete'),
                'users'=>array('@'),
            ),
            array(
                'deny',
                'users'=>array('*'),
            ),
        );
    }

    public function actionIndex()
    {
        $this->modals = array(
            'application-types-modal', 
            'application-servers-search-modal',
            'application-servers-list-modal',
            'application-servers-create-modal',
            'projects-list-modal',
            'confirmation-modal',
        );
        
        $this->extraJS = '<script src="' . Yii::app()->request->baseUrl . '/js/data.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/modal.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-notes.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-servers.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-point-persons.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/applications-main.js"></script>';
        $this->render('applications');
    }

    public function actionList()
    {
        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');

        $limit = (isset($_GET['is_main']) && $_GET['is_main'] == 'true')? Yii::app()->params['app_main_per_page'] : Yii::app()->params['applications_per_page'];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page-1)*$limit;
        $filter = array();

        if (isset($_GET['application_id'])) 
            if (!empty($_GET['application_id']) || $_GET['application_id'] == '0') 
                $filter['application_id'] = (string) $_GET['application_id'];

        if (isset($_GET['project_id'])) 
            if (!empty($_GET['project_id']) || $_GET['project_id'] == '0') 
                $filter['project_id'] = (int) $_GET['project_id'];

        if (isset($_GET['name'])) 
            if (!empty($_GET['name']) || $_GET['name'] == '0') 
                $filter['name'] = (string) $_GET['name'];

        if (isset($_GET['project'])) 
            if (!empty($_GET['project']) || $_GET['project'] == '0') 
                $filter['project'] = (string) $_GET['project'];

        if (isset($_GET['rd_point_person']))
            if (!empty($_GET['rd_point_person']) || $_GET['rd_point_person'] == '0')
                $filter['rd_point_person'] = (string) $_GET['rd_point_person'];

        if (isset($_GET['server_type']))
            if (!empty($_GET['server_type']) || $_GET['server_type'] == '0')
                $filter['server_type'] = (string) $_GET['server_type'];

        if (isset($_GET['server_id']))
            if (!empty($_GET['server_id']) || $_GET['server_id'] == '0')
                $filter['server_id'] = (int) $_GET['server_id'];

        if (isset($_GET['point_person']))
            if (!empty($_GET['point_person']) || $_GET['point_person'] == '0')
                $filter['point_person'] = (string) $_GET['point_person'];

        if (isset($_GET['usergroup']))
            if (!empty($_GET['usergroup']) || $_GET['usergroup'] == '0')
                $filter['usergroup'] = (string) $_GET['usergroup'];

        $applications = $this->get_data($filter, $limit, $offset);

        $return_data = array(
            'page'=>$page,
            'totalPage'=> ($applications['total_count'] == 0) ? 1 : ceil($applications['total_count']/$limit),
            'totalData'=>$applications['total_count'],
            'limit'=>$limit,
            'resultData'=>$applications['data'],
        );

        echo CJSON::encode($return_data);
    }
    
    private function get_data($filter='', $limit=5, $offset=0)
    {
        $criteria = new CDbCriteria;
        $criteria->distinct = true;
        $criteria->join = "JOIN projects p ON p.project_id=t.project_id";

        if(is_array($filter))
        {
            if(isset($filter['application_id']))
                $criteria->compare('t.application_id', $filter['application_id']);

            if(isset($filter['project_id']))
                $criteria->compare('t.project_id', $filter['project_id']);

            if(isset($filter['name']))
                $criteria->compare('LOWER(t.name)', strtolower($filter['name']), true, 'AND', true);

            if(isset($filter['project']))
                $criteria->compare('LOWER(p.name)', strtolower($filter['project']), true, 'AND', true);

            if(isset($filter['rd_point_person'])) {
                $criteria->join .= " LEFT JOIN ldap_users l ON l.username=t.rd_point_person";
                $criteria->compare('LOWER(l.name)', strtolower($filter['rd_point_person']), true, 'AND', true);
                $criteria->compare('LOWER(l.username)', strtolower($filter['rd_point_person']), true, 'OR', true);
            }

            if(isset($filter['server_type']) || isset($filter['server_id'])) {
                $criteria->join .= " LEFT JOIN (application_servers s";
                
                if(isset($filter['server_type'])) {
                    $criteria->join .= " JOIN servers r ON r.server_id=s.server_id";
                    $criteria->compare('r.server_type', $filter['server_type']);
                }

                $criteria->join .= ") ON s.application_id=t.application_id";

                if(isset($filter['server_id'])) {
                    $criteria->compare('s.server_id', $filter['server_id']);
                }
            }

            if(isset($filter['point_person']) || isset($filter['usergroup'])) {
                $criteria->join .= " LEFT JOIN application_point_persons o ON o.application_id=t.application_id";
                
                if(isset($filter['point_person'])) {
                    $criteria->compare('o.username', $filter['point_person']);
                }

                if(isset($filter['usergroup'])) {
                    $criteria->compare('o.user_group', $filter['usergroup']);
                }
            }

        }
        $count = Applications::model()->count($criteria);
        
        $criteria->limit = $limit;
        $criteria->offset = $offset;
        $criteria->order = 'LOWER(t.name)';

        // if request is from applications main page
        if ($limit == Yii::app()->params['app_main_per_page']) {
            $criteria->order = 'LOWER(p.name), '.$criteria->order;
        }

        $model = Applications::model()->findAll($criteria);
        $data  = array();

        foreach($model as $row)
        {
            $entry = array(
                'application_id'        => $row->application_id,
                'project_id'            => $row->project_id,
                'type_id'               => $row->type_id,
                'name'                  => str_replace('<', '&lt', $row->name),
                'description'           => str_replace('<', '&lt', $row->description),
                'accessibility'         => $row->accessibility,
                'repository_url'        => str_replace('<', '&lt', $row->repository_url),
                'uses_mobile_patterns'  => $row->uses_mobile_patterns,
                'instructions'          => str_replace('<', '&lt', $row->instructions),
                'rd_point_person'       => $row->rd_point_person,
                'production_date'       => $row->production_date,
                'termination_date'      => $row->termination_date,
                'date_created'          => $row->date_created,
                'date_updated'          => $row->date_updated,
                'created_by'            => $row->created_by,
                'updated_by'            => $row->updated_by,
                'project_name'          => $row->project->name,
            );

            // data for the server module
            if (isset($filter['server_id']) && !isset($filter['server_type']))
            {
                $appserver = ApplicationServers::model()->findByPk(array(
                    'application_id' => $row->application_id,
                    'server_id'      => $filter['server_id'],
                ));
                $entry['server_id'] = $appserver->server_id;
                $entry['application_path'] = $appserver->application_path;
                $entry['application_log'] = $appserver->application_log;
            }
            array_push($data, $entry);
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
            $data['project_id']             = trim($data['project_id']);
            $data['name']                   = trim($data['name']);
            $data['description']            = trim($data['description']);
            $data['accessibility']          = trim($data['accessibility']);
            $data['repository_url']         = trim($data['repository_url']);
            $data['instructions']           = trim($data['instructions']);
            $data['production_date']        = trim($data['production_date']);
            $data['termination_date']       = trim($data['termination_date']);
            $data['uses_mobile_patterns']   = ($data['uses_mobile_patterns'] == 'true')? 1 : 0;

            //FORM VALIDATION HERE
            $errors = array();
            //project id is required
            if (strlen($data['project_id']) == 0) {
                array_push($errors, 'PROJECT_ERROR: Project ID is required');
            } else if (!Projects::model()->exists('project_id=:project_id', array(':project_id'=>$data['project_id']))) {
                array_push($errors, 'PROJECT_ERROR: Project ID does not exist');
            }

            //name is required
            if (strlen($data['name']) == 0) {
                array_push($errors, 'NAME_ERROR: Name is required');
            }

            //type is required
            if (strlen($data['type_name']) == 0) {
                array_push($errors, 'TYPE_ERROR: Type is required');
            //invalid type
            } else {
                $app_type = ApplicationTypes::model()->find('name=:name', array(':name'=>$data['type_name']));
                if ($app_type == null) {
                    array_push($errors, 'TYPE_ERROR: Type is not in the list');
                } else {
                    $data['type_id'] = $app_type->type_id;
                }
            }

            //accessibility is required
            if (strlen($data['accessibility']) == 0) {
                array_push($errors, 'ACCESSIBILITY_ERROR: Accessibility is required');
            //accessibility should either be PUBLIC or PRIVATE only
            } else if ($data['accessibility'] != 'PUBLIC' && $data['accessibility'] != 'PRIVATE') {
                array_push($errors, 'ACCESSIBILITY_ERROR: Accessibility option selected is invalid');
            }

            if (count($errors) == 0) {
                $updates = array(
                    'project_id'            => (int) $data['project_id'],
                    'name'                  => str_replace('<', '&lt', $data['name']),
                    'type_id'               => $data['type_id'],
                    'accessibility'         => $data['accessibility'],
                    'description'           => str_replace('<', '&lt', $data['description']),
                    'accessibility'         => $data['accessibility'],
                    'repository_url'        => str_replace('<', '&lt', $data['repository_url']),
                    'uses_mobile_patterns'  => $data['uses_mobile_patterns'],
                    'instructions'          => str_replace('<', '&lt', $data['instructions']),
                    'rd_point_person'       => $data['rd_point_person'],
                    'production_date'       => $data['production_date'],
                    'termination_date'      => $data['termination_date'],
                    'date_updated'          => date("Y-m-d H:i:s"),
                    'updated_by'            => Yii::app()->user->name,
                );
                Applications::model()->updateByPk($data['application_id'], $updates);

                //update appserver details if necessary
                if (isset($data['server_id']))
                {
                    $updates2 = array(
                        'application_path' => str_replace('<', '&lt', trim($data['application_path'])),
                        'application_log'  => str_replace('<', '&lt', trim($data['application_log'])),
                        'date_updated'     => date("Y-m-d H:i:s"),
                        'updated_by'       => Yii::app()->user->name,
                    );

                    ApplicationServers::model()->updateByPk(array(
                        'application_id' => (int) $data['application_id'],
                        'server_id' => (int) $data['server_id'],
                    ), $updates2);
                    $updates['application_path'] = $updates2['application_path'];
                    $updates['application_log'] = $updates2['application_log'];
                }

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

        if (!empty($data)) {
            $data['project_id']             = trim($data['project_id']);
            $data['name']                   = trim($data['name']);
            $data['description']            = trim($data['description']);
            $data['accessibility']          = trim($data['accessibility']);
            $data['repository_url']         = trim($data['repository_url']);
            $data['description']            = trim($data['description']);
            $data['instructions']           = trim($data['instructions']);
            $data['production_date']        = trim($data['production_date']);
            $data['termination_date']       = trim($data['termination_date']);
            $data['uses_mobile_patterns']   = ($data['uses_mobile_patterns'] == 'true')? 1 : 0;

            //FORM VALIDATION HERE
            $errors = array();
            //project id is required
            if (strlen($data['project_id']) == 0) {
                array_push($errors, 'PROJECT_ERROR: Project ID is required');
            } else if (!Projects::model()->exists('project_id=:project_id', array(':project_id'=>$data['project_id']))) {
                array_push($errors, 'PROJECT_ERROR: Project ID does not exist');
            }

            //name is required
            if (strlen($data['name']) == 0) {
                array_push($errors, 'NAME_ERROR: Name is required');
            }

            //type is required
            if (strlen($data['type_name']) == 0) {
                array_push($errors, 'TYPE_ERROR: Type is required');
            //invalid type
            } else {
                $app_type = ApplicationTypes::model()->find('name=:name', array(':name'=>$data['type_name']));
                if ($app_type == null) {
                    array_push($errors, 'TYPE_ERROR: Type is not in the list');
                } else {
                    $data['type_id'] = $app_type->type_id;
                }
            }

            //accessibility is required
            if (strlen($data['accessibility']) == 0) {
                array_push($errors, 'ACCESSIBILITY_ERROR: Accessibility is required');
            //accessibility should either be PUBLIC or PRIVATE only
            } else if ($data['accessibility'] != 'PUBLIC' && $data['accessibility'] != 'PRIVATE') {
                array_push($errors, 'ACCESSIBILITY_ERROR: Accessibility option selected is invalid');
            }

            //data is good
            if (count($errors) == 0) {
                $application = new Applications;
                $application->project_id            = (int) $data['project_id'];
                $application->type_id               = $data['type_id'];
                $application->name                  = $data['name'];
                $application->description           = $data['description'];
                $application->accessibility         = $data['accessibility'];
                $application->repository_url        = $data['repository_url'];
                $application->uses_mobile_patterns  = $data['uses_mobile_patterns'];
                $application->instructions          = $data['instructions'];
                $application->rd_point_person       = $data['rd_point_person'];
                $application->production_date       = $data['production_date'];
                $application->termination_date      = $data['termination_date'];
                $application->date_created          = date("Y-m-d H:i:s");
                $application->date_updated          = '0000-00-00 00:00:00';
                $application->created_by            = Yii::app()->user->name;
                $application->save();

                // add to server if necessary
                if (isset($data['server_id']))
                {
                    $app_server = new ApplicationServers;
                    $app_server->application_id = $application->application_id;
                    $app_server->server_id = $data['server_id'];
                    $app_server->application_path = $data['application_path'];
                    $app_server->application_log = $data['application_log'];
                    $app_server->date_created = date("Y-m-d H:i:s");
                    $app_server->date_updated = '0000-00-00 00:00:00';
                    $app_server->created_by = Yii::app()->user->name;
                    $app_server->save();
                }

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

    public function actionDelete()
    {
        $data = $_POST;

        if (!empty($data)) {
            Applications::model()->deleteByPk($data['application_id']);
            ApplicationServers::model()->deleteAll('application_id=:application_id', array(':application_id' => $data['application_id']));
            ApplicationPointPersons::model()->deleteAll('application_id=:application_id', array(':application_id' => $data['application_id']));
            Notes::model()->deleteAll('application_id=:application_id', array(':application_id' => $data['application_id']));

            echo CJSON::encode(array(
                'type' => 'success',
                'data' => '',
            ));

        } else {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => 'CSRF_ERROR: CSRF Token did not match',
            ));
        }
    }
}