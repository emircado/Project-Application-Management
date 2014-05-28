<?php

class ApplicationpointpersonsController extends Controller
{
    public function actionList()
    {
        $limit = Yii::app()->params['point_persons_per_page'];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page-1)*$limit;
        $filter = array();

        if (isset($_GET['application_id']) && !empty($_GET['application_id']))
            $filter['application_id'] = (string) $_GET['application_id'];

        $point_persons = $this->get_data($filter, $limit, $offset);

        $return_data = array(
            'page'=>$page,
            'totalPage'=> ($point_persons['total_count'] == 0) ? 1 : ceil($point_persons['total_count']/$limit),
            'totalData'=>$point_persons['total_count'],
            'limit'=>$limit,
            'resultData'=>$point_persons['data'],
        );

        echo CJSON::encode($return_data);
    }
    
    private function get_data($filter='', $limit=5, $offset=0)
    {
        $criteria = new CDbCriteria;

        if(is_array($filter))
        {
            if(isset($filter['application_id']))
                $criteria->compare('application_id', $filter['application_id']);
        }
        $count = ApplicationPointPersons::model()->count($criteria);
        
        $criteria->limit = $limit;
        $criteria->offset = $offset;
        $criteria->order = 'username';
        
        $model = ApplicationPointPersons::model()->findAll($criteria);
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
                'application_id'    => $row->application_id,
                'username'          => $row->username,
                'user_group'        => $row->user_group,
                'description'       => $row->description,
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

    public function actionUpdate()
    {
        $data = $_POST;
        //will be empty if CSRF authentication fails
        if (!empty($data)) {
            $updates = array(
                'description'   => trim($data['description']),
                'date_updated'  => date("Y-m-d H:i:s"),
                'updated_by'    => Yii::app()->user->name,
            );

            ApplicationPointPersons::model()->updateByPk(array(
                'application_id'    => (int) $data['application_id'],
                'username'          => (string) $data['username'],
            ), $updates);

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

    public function actionCreate()
    {
        $data = $_POST;

        //will be empty if CSRF authentication fails
        if (!empty($data)) {
            $data['description'] = trim($data['description']);
            $data['username'] = trim($data['username']);
            $data['user_group'] = trim($data['user_group']);

            //FORM VALIDATION HERE
            $errors = array();
            //username is required
            if (strlen($data['username']) == 0) {
                array_push($errors, 'USERNAME_ERROR: Username is required');
            //username should be unique
            } else if (ApplicationPointPersons::model()->exists(
                'username = :username AND application_id = :application_id',
                array(":username"=>$data['username'], ":application_id"=>$data['application_id']))) {
                array_push($errors, 'USERNAME_ERROR: Point person with this username already exists');
            }

            //usergroup is required
            if (strlen($data['user_group']) == 0) {
                array_push($errors, 'USERGROUP_ERROR: User Group is required');
            }

            //data is good
            if (count($errors) == 0) {
                $point_person = new ApplicationPointPersons;
                $point_person->application_id   = $data['application_id'];
                $point_person->username         = $data['username'];
                $point_person->user_group       = $data['user_group'];
                $point_person->description      = $data['description'];
                $point_person->date_created     = date("Y-m-d H:i:s");
                $point_person->created_by       = Yii::app()->user->name;
                $point_person->date_updated     = '0000-00-00 00:00:00';
                $point_person->save();

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
            ApplicationPointPersons::model()->deleteByPk(array(
                'application_id'    => (int) $data['application_id'],
                'username'          => (string) $data['username'],
            ));

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