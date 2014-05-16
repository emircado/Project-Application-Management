<?php

class ServersController extends Controller
{
    public function actionList()
    {

        // $limit = Yii::app()->params['applications_per_page'];
        // $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        // $offset = ($page-1)*$limit;
        // $filter = array();

        // if (isset($_GET['project_id']) && !empty($_GET['project_id']))
        //     $filter['project_id'] = (string) $_GET['project_id'];

        // $applications = $this->get_data($filter, $limit, $offset);

        // $return_data = array(
        //     'page'=>$page,
        //     'totalPage'=> ($applications['total_count'] == 0) ? 1 : ceil($applications['total_count']/$limit),
        //     'totalData'=>$applications['total_count'],
        //     'limit'=>$limit,
        //     'resultData'=>$applications['data'],
        // );

        // echo CJSON::encode($return_data);
    }
    
    public function actionData()
    {
        $types = ZHtml::enumItem(Servers::model(), 'server_type');

        $data = array();

        foreach ($types as $type) {
            $criteria = new CDbCriteria;
            $criteria->compare('server_type', $type);
            $model = Servers::model()->findAll($criteria);

            $data[$type] = array();

            foreach ($model as $row){
                array_push($data[$type], array(
                    'server_id'     =>  $row->server_id,
                    'name'          =>  $row->name,
                    'hostname'      =>  $row->hostname,
                    'public_ip'     =>  $row->public_ip,
                    'private_ip'    =>  $row->private_ip,
                    'network'       =>  $row->network,
                )); 
            }
        }

        echo CJSON::encode($data);
    }

    private function get_data($filter='', $limit=5, $offset=0)
    {
        // $criteria = new CDbCriteria;

        // if(is_array($filter))
        // {
        //     if(isset($filter['project_id']))
        //         $criteria->compare('project_id', $filter['project_id']);
        // }
        // $count = Applications::model()->count($criteria);
        
        // $criteria->limit = $limit;
        // $criteria->offset = $offset;
        
        // $model = Applications::model()->findAll($criteria);
        // $data  = array();

        // foreach($model as $row)
        // {
        //     $data[] = array(
        //         'application_id'    => $row->application_id,
        //         'project_id'        => $row->project_id,
        //         'type_id'           => $row->type_id,
        //         'name'              => $row->name,
        //         'description'       => $row->description,
        //         'accessibility'     => $row->accessibility,
        //         'repository_url'    => $row->repository_url,
        //         'instructions'      => $row->instructions,
        //         'rd_point_person'   => $row->rd_point_person,
        //         'production_date'   => $row->production_date,
        //         'termination_date'  => $row->termination_date,
        //         'date_created'      => $row->date_created,
        //         'date_updated'      => $row->date_updated,
        //         'created_by'        => $row->created_by,
        //         'updated_by'        => $row->updated_by,
        //     );
        // }

        // return array(
        //     'data'=>$data,
        //     'data_count'=>count($data),
        //     'total_count'=>$count,          
        // );
    }

    public function actionCreate()
    {
        // $data = $_POST;

        // if (!empty($data)) {
        //     //FORM VALIDATION HERE
        //     $errors = array();
        //     //code is required
        //     if (strlen($data['type_name']) == 0) {
        //         array_push($errors, 'TYPE_ERROR: Type is required');
        //     //invalid code
        //     } else {
        //         $app_type = ApplicationTypes::model()->find('name=:name', array(':name'=>$data['type_name']));
        //         if ($app_type == null) {
        //             array_push($errors, 'TYPE_ERROR: Type is not in the list');
        //         } else {
        //             $data['type_id'] = $app_type->type_id;
        //         }
        //     }

        //     //accessibility is required
        //     if (strlen($data['accessibility']) == 0) {
        //         array_push($errors, 'ACCESSIBILITY_ERROR: Accessibility is required');
        //     //accessibility should either be PUBLIC or PRIVATE only
        //     } else if ($data['accessibility'] != 'PUBLIC' && $data['accessibility'] != 'PRIVATE') {
        //         array_push($errors, 'ACCESSIBILITY_ERROR: Accessibility option selected is invalid');
        //     }

        //     //data is good
        //     if (count($errors) == 0) {
        //         $application = new Applications;
        //         $application->project_id        = $data['project_id'];
        //         $application->type_id           = $data['type_id'];
        //         $application->name              = $data['name'];
        //         $application->description       = $data['description'];
        //         $application->accessibility     = $data['accessibility'];
        //         $application->repository_url    = $data['repository_url'];
        //         $application->instructions      = $data['instructions'];
        //         $application->rd_point_person   = $data['rd_point_person'];
        //         $application->production_date   = $data['production_date'];
        //         $application->termination_date  = $data['termination_date'];
        //         $application->date_created      = date("Y-m-d H:i:s");
        //         $application->date_updated      = '0000-00-00 00:00:00';
        //         $application->created_by        = Yii::app()->user->name;
        //         $application->save();

        //         echo CJSON::encode(array(
        //             'type' => 'success',
        //             'data' => '',
        //         ));
        //     } else {
        //         echo CJSON::encode(array(
        //             'type' => 'error',
        //             'data' => implode(',', $errors),
        //         ));
        //     }
        // } else {
        //     echo CJSON::encode(array(
        //         'type' => 'error',
        //         'data' => 'CSRF_ERROR: CSRF Token did not match',
        //     ));
        // }
    }
}