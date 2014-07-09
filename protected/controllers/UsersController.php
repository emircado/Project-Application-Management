<?php

class UsersController extends Controller
{
    public $extraJS;
    public $modals;

    public function filters()
    {
        return array(
            'accessControl',
            'ajaxOnly + list',
        );
    }

    public function accessRules()
    {
        return array(
            array(
                'allow',
                'actions'=>array('index','list'),
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
            'confirmation-modal',
        );

        $this->extraJS = '<script src="' . Yii::app()->request->baseUrl . '/js/data.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/modal.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-notes.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-servers.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/application-point-persons.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/users.js"></script>';
        $this->render('users');
    }

    public function actionList()
    {
        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');

        $limit = Yii::app()->params['users_per_page'];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page-1)*$limit;
        $filter = array();

        if (isset($_GET['application_id'])) 
            if (!empty($_GET['application_id']) || $_GET['application_id'] == '0') 
                $filter['application_id'] = (string) $_GET['application_id'];

        if (isset($_GET['name'])) 
            if (!empty($_GET['name']) || $_GET['name'] == '0') 
                $filter['name'] = (string) $_GET['name'];

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
        $criteria->join = "JOIN (application_point_persons o JOIN applications a on o.application_id=a.application_id) ON o.username=t.username";

        if(is_array($filter))
        {
            if(isset($filter['application_id']))
                $criteria->compare('o.application_id', $filter['application_id']);

            if(isset($filter['name']))
                $criteria->compare('LOWER(a.name)', strtolower($filter['name']), true, 'AND', true);

            if(isset($filter['point_person']))
                $criteria->compare('LOWER(t.name)', strtolower($filter['point_person']), true, 'AND', true);
        }

        $count = LdapUsers::model()->count($criteria);
        
        $criteria->limit = $limit;
        $criteria->offset = $offset;
        $criteria->order = 'LOWER(t.name)';

        $model = LdapUsers::model()->findAll($criteria);
        
        $curr_user = '';
        $index = 0;
        $application = null;

        $data = array();
        foreach($model as $row)
        {
            // if new
            if ($row->name != $curr_user) {
                $curr_user = $row->name;
                $index = 0;
            }
            $application = $row->applications[$index];

            $data[] = array(
                'application_id'        => $application->application_id,
                'project_id'            => $application->project_id,
                'type_id'               => $application->type_id,
                'name'                  => str_replace('<', '&lt', $application->name),
                'description'           => str_replace('<', '&lt', $application->description),
                'accessibility'         => $application->accessibility,
                'repository_url'        => str_replace('<', '&lt', $application->repository_url),
                'uses_mobile_patterns'  => $application->uses_mobile_patterns,
                'instructions'          => str_replace('<', '&lt', $application->instructions),
                'rd_point_person'       => $application->rd_point_person,
                'production_date'       => $application->production_date,
                'termination_date'      => $application->termination_date,
                'date_created'          => $application->date_created,
                'date_updated'          => $application->date_updated,
                'created_by'            => $application->created_by,
                'updated_by'            => $application->updated_by,
                'project_name'          => $application->project->name,
                'point_person'          => $row->name,
            );
            $index++;
        }

        return array(
            'data'=>$data,
            'data_count'=>count($data),
            'total_count'=>$count,          
        );
    }
}