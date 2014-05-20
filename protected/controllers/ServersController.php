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
        $data = $_POST;

        $data['name']               = trim($data['name']);
        $data['server_type']        = trim($data['server_type']);
        $data['hostname']           = trim($data['hostname']);
        $data['public_ip']          = trim($data['public_ip']);
        $data['private_ip']         = trim($data['private_ip']);
        $data['network']            = trim($data['network']);
        $data['location']           = trim($data['location']);
        $data['description']        = trim($data['description']);
        $data['production_date']    = trim($data['production_date']);
        $data['termination_date']   = trim($data['termination_date']);

        if (!empty($data)) {
            //FORM VALIDATION HERE
            $errors = array();

            //network is required
            if (strlen($data['network']) == 0) {
                array_push($errors, 'NETWORK_ERROR: Network is required');
            }

            $server_types = ZHtml::enumItem(Servers::model(), 'server_type');
            //server type is required
            if (strlen($data['server_type']) == 0) {
                array_push($errors, 'TYPE_ERROR: Type is required');
            //server type should be valid
            } else if (!in_array($data['server_type'], $server_types)) {
                array_push($errors, 'TYPE_ERROR: Type is invalid');
            }

            //data is good
            if (count($errors) == 0) {
                $server = new Servers;
                $server->name = $data['name'];
                $server->server_type = $data['server_type'];
                $server->hostname = $data['hostname'];
                $server->public_ip = $data['public_ip'];
                $server->private_ip = $data['private_ip'];
                $server->network = $data['network'];
                $server->location = $data['location'];
                $server->description = $data['description'];
                $server->production_date = $data['production_date'];
                $server->termination_date = $data['termination_date'];
                $server->date_created = date("Y-m-d H:i:s");
                $server->date_updated = '0000-00-00 00:00:00';
                $server->created_by = Yii::app()->user->name;
                $server->save();

                echo CJSON::encode(array(
                    'type' => 'success',
                    'data' => array(
                        'server_type'   =>  $server->server_type,
                        'server'        =>  array(
                            'server_id'     =>  $server->server_id,
                            'name'          =>  $server->name,
                            'hostname'      =>  $server->hostname,
                            'public_ip'     =>  $server->public_ip,
                            'private_ip'    =>  $server->private_ip,
                            'network'       =>  $server->network,
                        ),
                    ),
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
}