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

        if (isset($_GET['rd_point_person']))
            if (!empty($_GET['rd_point_person']) || $_GET['rd_point_person'] == '0')
                $filter['rd_point_person'] = (string) $_GET['rd_point_person'];

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
        $criteria->join = "LEFT JOIN ldap_users l ON l.username=t.rd_point_person";
        $criteria->condition = "t.rd_point_person!=''";

        if(is_array($filter))
        {
            if(isset($filter['application_id']))
                $criteria->compare('t.application_id', $filter['application_id']);

            if(isset($filter['name']))
                $criteria->compare('LOWER(t.name)', strtolower($filter['name']), true, 'AND', true);

            if(isset($filter['rd_point_person'])) {
                $criteria->compare('LOWER(l.name)', strtolower($filter['rd_point_person']), true, 'AND', true);
                $criteria->compare('LOWER(l.username)', strtolower($filter['rd_point_person']), true, 'OR', true);
            }
        }
        $count = Applications::model()->count($criteria);
        
        $criteria->limit = $limit;
        $criteria->offset = $offset;
        $criteria->order = 'LOWER(l.name), LOWER(t.name)';

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
}