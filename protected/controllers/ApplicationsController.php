<?php

class ApplicationsController extends Controller
{
    public $extraJS;
    public $modals;
    
    private $point_person_filter;

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
                'actions'=>array('index','list','update','create','delete', 'test'),
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

        if (isset($_GET['project_id']) && !empty($_GET['project_id']))
            $filter['project_id'] = (string) $_GET['project_id'];

        if (isset($_GET['name'])) 
            if (!empty($_GET['name']) || $_GET['name'] == '0') 
                $filter['name'] = (string) $_GET['name'];

        if (isset($_GET['project'])) 
            if (!empty($_GET['project']) || $_GET['project'] == '0') 
                $filter['project'] = (string) $_GET['project'];

        if (isset($_GET['point_person']))
            if (!empty($_GET['point_person']) || $_GET['point_person'] == '0')
                $filter['point_person'] = (string) $_GET['point_person'];

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
        $criteria->join = "JOIN projects p ON p.project_id=t.project_id";

        if(is_array($filter))
        {
            if(isset($filter['project_id']))
                $criteria->compare('t.project_id', $filter['project_id']);

            if(isset($filter['name']))
                $criteria->compare('LOWER(t.name)', strtolower($filter['name']), true, 'AND', true);

            if(isset($filter['project']))
                $criteria->compare('LOWER(p.name)', $filter['project'], true, 'AND', true);

            if(isset($filter['point_person'])) {
                $this->point_person_filter = $filter['point_person'];
                $point_persons = array_filter($this->get_point_persons(), array($this, 'is_substring'));
                if (count($point_persons) > 0) {
                    $criteria->compare('t.rd_point_person', array_keys($point_persons));
                // might be searching for username
                } else {
                    $criteria->compare('t.rd_point_person', $this->point_person_filter, true, 'AND', true);
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
            $data[] = array(
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
        }

        return array(
            'data'=>$data,
            'data_count'=>count($data),
            'total_count'=>$count,          
        );
    }

    private function get_point_persons()
    {
        try {
            $model = new LDAPModel;
            $model->get_selection();
            return $model->entries['DEVELOPERS'];
        } catch (LDAPModelException $e) {
            return array();
        }
    }

    public function is_substring($str)
    {
        if (strpos(strtolower($str), strtolower($this->point_person_filter)) !== false) {
           return true;
        }
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

                echo CJSON::encode(array(
                    'type' => 'success',
                    'data' => $updates
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