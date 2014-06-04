<?php

class ContactpersonsController extends Controller
{
    private $emailRegExp = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/';

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
                'actions'=>array('list','update','create','delete'),
                'users'=>array('@'),
            ),
            array(
                'deny',
                'users'=>array('*'),
            ),
        );
    }

    public function actionList()
    {
        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');

        $limit = Yii::app()->params['contact_persons_per_page'];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page-1)*$limit;
        $filter = array();

        if (isset($_GET['project_id']) && !empty($_GET['project_id']))
            $filter['project_id'] = (string) $_GET['project_id'];

        $contact_persons = $this->get_data($filter, $limit, $offset);

        $return_data = array(
            'page'=>$page,
            'totalPage'=> ($contact_persons['total_count'] == 0) ? 1 : ceil($contact_persons['total_count']/$limit),
            'totalData'=>$contact_persons['total_count'],
            'limit'=>$limit,
            'resultData'=>$contact_persons['data'],
        );

        echo CJSON::encode($return_data);
    }
    
    private function get_data($filter='', $limit=5, $offset=0)
    {
        $criteria = new CDbCriteria;

        if(is_array($filter))
        {
            if(isset($filter['project_id']))
                $criteria->compare('project_id', $filter['project_id']);
        }
        $count = ProjectContactPersons::model()->count($criteria);
        
        $criteria->limit = $limit;
        $criteria->offset = $offset;
        $criteria->order = 'LOWER(name)';
        
        $model = ProjectContactPersons::model()->findAll($criteria);
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
                'project_id'      => $row->project_id,
                'name'            => $row->name,
                'company'         => $row->company,
                'position'        => $row->position,
                'contact_numbers' => $row->contact_numbers,
                'email'           => $row->email,
                'address'         => $row->address,
                'notes'           => $row->notes,
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
            $data['name']               = trim($data['name']);
            $data['company']            = trim($data['company']);
            $data['position']           = trim($data['position']);
            $data['new_email']          = trim($data['new_email']);
            $data['email']              = trim($data['email']);
            $data['contact_numbers']    = trim($data['contact_numbers']);
            $data['address']            = trim($data['address']);
            $data['notes']              = trim($data['notes']);

            //FORM VALIDATION HERE
            $errors = array();
            //name is required
            if (strlen($data['name']) == 0) {
                array_push($errors, 'NAME_ERROR: Name is required');
            }

            //if email changed
            if ($data['new_email'] != $data['email']) {
                //email is required
                if (strlen($data['new_email']) == 0) {
                    array_push($errors, 'EMAIL_ERROR: Email is required');
                //check if email already exists
                } else if (ProjectContactPersons::model()->exists(
                    'email = :email AND project_id = :project_id', 
                    array(":email"=>$data['new_email'], "project_id"=>$data['project_id']))) {
                    array_push($errors, 'EMAIL_ERROR: Email already taken');
                // must be a valid email - text regexp
                } else if (preg_match($this->emailRegExp, $data['new_email'])  != 1) {
                    array_push($errors, 'EMAIL_ERROR: Email is not valid');
                }
            }

            //data is good
            if (count($errors) == 0) {
                $updates = array(
                    'name'              => $data['name'],
                    'company'           => $data['company'],
                    'position'          => $data['position'],
                    'contact_numbers'   => $data['contact_numbers'],
                    'address'           => $data['address'],
                    'email'             => $data['new_email'],
                    'notes'             => $data['notes'],
                    'date_updated'      => date("Y-m-d H:i:s"),
                    'updated_by'        => Yii::app()->user->name,
                );

                ProjectContactPersons::model()->updateByPk(array(
                    'project_id' => (int) $data['project_id'],
                    'email' => (string) $data['email'],
                ), $updates);
                
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
            $data['name']               = trim($data['name']);
            $data['company']            = trim($data['company']);
            $data['position']           = trim($data['position']);
            $data['email']              = trim($data['email']);
            $data['contact_numbers']    = trim($data['contact_numbers']);
            $data['address']            = trim($data['address']);
            $data['notes']              = trim($data['notes']);

            //FORM VALIDATION HERE
            $errors = array();
            //name is required
            if (strlen($data['name']) == 0) {
                array_push($errors, 'NAME_ERROR: Name is required');
            }

            //email is required
            if (strlen($data['email']) == 0) {
                array_push($errors, 'EMAIL_ERROR: Email is required');
            //check if email already exists
            } else if (ProjectContactPersons::model()->exists(
                'email = :email AND project_id = :project_id', 
                array(":email"=>$data['email'], ":project_id"=>$data['project_id']))) {
                array_push($errors, 'EMAIL_ERROR: Email already taken');
            // must be a valid email - text regexp
            } else if (preg_match($this->emailRegExp, $data['email'])  != 1) {
                array_push($errors, 'EMAIL_ERROR: Email is not valid');
            }

            //data is good
            if (count($errors) == 0) {
                $contact_person                     = new ProjectContactPersons;
                $contact_person->project_id         = $data['project_id'];
                $contact_person->name               = $data['name'];
                $contact_person->company            = $data['company'];
                $contact_person->position           = $data['position'];
                $contact_person->contact_numbers    = $data['contact_numbers'];
                $contact_person->email              = $data['email'];
                $contact_person->address            = $data['address'];
                $contact_person->notes              = $data['notes'];
                $contact_person->date_created       = date("Y-m-d H:i:s");
                $contact_person->date_updated       = '0000-00-00 00:00:00';
                $contact_person->created_by         = Yii::app()->user->name;
                $contact_person->save();

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
            ProjectContactPersons::model()->deleteByPk(array(
                'project_id' => (int) $data['project_id'],
                'email' => (string) $data['email'],
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