<?php

class ServersController extends Controller
{
    public $extraJS;
    public $modals;

    public function actionIndex()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');



        $this->modals = array(
            'confirmation-modal',
        );

        $this->extraJS = '<script src="' . Yii::app()->request->baseUrl . '/js/data.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/servers.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/modal.js"></script>';
        $this->render('servers');
    }

    public function actionList()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');

        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');

        $limit = Yii::app()->params['servers_per_page'];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page-1)*$limit;
        $filter = array();

        if (isset($_GET['name']) && (!empty($_GET['name']) || $_GET['name'] == '0'))
            $filter['name'] = (string) $_GET['name'];

        if (isset($_GET['server_type']) && !empty($_GET['server_type']))
            $filter['server_type'] = (string) $_GET['server_type'];

        if (isset($_GET['hostname']) && (!empty($_GET['hostname']) || $_GET['hostname'] == '0'))
            $filter['hostname'] = (string) $_GET['hostname'];

        if (isset($_GET['private_ip']) && (!empty($_GET['private_ip']) || $_GET['private_ip'] == '0'))
            $filter['private_ip'] = (string) $_GET['private_ip'];

        if (isset($_GET['network']) && (!empty($_GET['network']) || $_GET['network'] == '0'))
            $filter['network'] = (string) $_GET['network'];

        $servers = $this->get_data($filter, $limit, $offset);

        $return_data = array(
            'page'=>$page,
            'totalPage'=> ($servers['total_count'] == 0) ? 1 : ceil($servers['total_count']/$limit),
            'totalData'=>$servers['total_count'],
            'limit'=>$limit,
            'resultData'=>$servers['data'],
        );

        echo CJSON::encode($return_data);
    }
    
    // used for selecting application servers
    public function actionData()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');

        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');

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
                    'description'   =>  $row->description,
                )); 
            }
        }
        echo CJSON::encode($data);
    }

    private function get_data($filter='', $limit=20, $offset=0)
    {
        $criteria = new CDbCriteria;

        if(is_array($filter))
        {
            if(isset($filter['name']))
                $criteria->compare('LOWER(name)', strtolower($filter['name']), true, 'AND', true);

            if(isset($filter['hostname']))
                $criteria->compare('hostname', $filter['hostname'], true, 'AND', true);

            if(isset($filter['private_ip']))
                $criteria->compare('private_ip', $filter['private_ip'], true, 'AND', true);

            if(isset($filter['network']))
                $criteria->compare('network', $filter['network'], true, 'AND', true);

            if(isset($filter['server_type']))
                $criteria->compare('server_type', $filter['server_type']);
        }
        $count = Servers::model()->count($criteria);
        
        $criteria->limit = $limit;
        $criteria->offset = $offset;
        $criteria->order = 'server_type, LOWER(name)';
        
        $model = Servers::model()->findAll($criteria);
        $data  = array();

        foreach($model as $row)
        {
            $data[] = array(
                'server_id'         => $row->server_id,
                'name'              => $row->name,
                'server_type'       => $row->server_type,
                'hostname'          => $row->hostname,
                'public_ip'         => $row->public_ip,
                'private_ip'        => $row->private_ip,
                'network'           => $row->network,
                'location'          => $row->location,
                'description'       => $row->description,
                'production_date'   => $row->production_date,
                'termination_date'  => $row->termination_date,
                'date_created'      => $row->date_created,
                'date_updated'      => $row->date_updated,
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

    public function actionCreate()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');

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
            $duplicate = NULL;

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

            //public IP must be unique
            if (strlen($data['public_ip']) != 0) {
                $duplicate = Servers::model()->find('public_ip=:public_ip', array(':public_ip'=>$data['public_ip']));
                if ($duplicate != NULL) {
                    array_push($errors, 'PUBLIC_ERROR: Public IP is already assigned');
                }
            }

            //private IP + network must be unique
            if (strlen($data['private_ip']) != 0 && strlen($data['network']) != 0) {
                $duplicate = Servers::model()->find('private_ip=:private_ip AND network=:network',
                    array(':private_ip'=>$data['private_ip'], ':network'=>$data['network']));
                if ($duplicate != NULL) {
                    array_push($errors, 'PRIVATE_ERROR: Private IP is already assigned');
                }
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
                            'description'   =>  $server->description,
                        ),
                    ),
                ));
            } else {
                echo CJSON::encode(array(
                    'type' => 'error',
                    'data' => implode(',', $errors),
                    'duplicate' => $duplicate,
                ));
            }
        } else {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => 'CSRF_ERROR: CSRF Token did not match',
            ));
        }
    }

    public function actionUpdate()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');

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

    public function actionDelete()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');

        $data = $_POST;

        if (!empty($data)) {
            Servers::model()->deleteByPk($data['server_id']);

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