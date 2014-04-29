<?php

class ContactpersonsController extends Controller
{
    private $emailRegExp = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/';

    public function actionList()
    {
        $limit = Yii::app()->params['contact_persons_per_page'];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page-1)*$limit;
        $filter = array();

        if (isset($_GET['project_id']) && !empty($_GET['project_id']))
            $filter['project_id'] = (string) $_GET['project_id'];

        $contact_persons = $this->get_data($filter, $limit, $offset);

        for ($i = 0; $i < $contact_persons['data_count']; $i++) {
            //date conversion
            $contact_persons['data'][$i]['date_created_formatted'] = ($contact_persons['data'][$i]['date_created'] == '0000-00-00 00:00:00') ? 'N/A' :date(Yii::app()->params['datetime_display'], strtotime($contact_persons['data'][$i]['date_created']));
            $contact_persons['data'][$i]['date_updated_formatted'] = ($contact_persons['data'][$i]['date_updated'] == '0000-00-00 00:00:00') ? 'N/A' : date(Yii::app()->params['datetime_display'], strtotime($contact_persons['data'][$i]['date_updated']));
        }

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
                'project_id'    => $row->project_id/*$p->purify($row->project_id)*/,
                'name'          => $row->name/*$p->purify($row->name)*/,
                'company'       => $row->company/*$p->purify($row->company)*/,
                'position'      => $row->position/*$p->purify($row->position)*/,
                'contacts'      => $row->contact_numbers/*$p->purify($row->contact_numbers)*/,
                'email'         => $row->email/*$p->purify($row->email)*/,
                'address'       => $row->address/*$p->purify($row->address)*/,
                'notes'         => $row->notes/*$p->purify($row->notes)*/,
                'date_created'  => $row->date_created/*$p->purify($row->date_created)*/,
                'date_updated'  => $row->date_updated/*$p->purify($row->date_updated)*/,
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
                $data['date_updated'] = date("Y-m-d H:i:s");
                $old_email = $data['email'];
                $data['email'] = $data['new_email'];
                ProjectContactPersons::model()->updateByPk(array(
                    'project_id' => (int) $data['project_id'],
                    'email' => (string) $old_email,
                ), $data);

                $data['date_created_formatted'] = ($data['date_created'] == '0000-00-00 00:00:00') ? 'N/A' : date(Yii::app()->params['datetime_display'], strtotime($data['date_created']));
                $data['date_updated_formatted'] = ($data['date_updated'] == '0000-00-00 00:00:00') ? 'N/A' : date(Yii::app()->params['datetime_display'], strtotime($data['date_updated']));

                echo CJSON::encode(array(
                    'type' => 'success',
                    'data' => $data,
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
                array(":email"=>$data['email'], "project_id"=>$data['project_id']))) {
                array_push($errors, 'EMAIL_ERROR: Email already taken');
            // must be a valid email - text regexp
            } else if (preg_match($this->emailRegExp, $data['email'])  != 1) {
                array_push($errors, 'EMAIL_ERROR: Email is not valid');
            }

            //data is good
            if (count($errors) == 0) {
                $contact_person = new ProjectContactPersons;
                $contact_person->project_id = $data['project_id'];
                $contact_person->name = $data['name'];
                $contact_person->company = $data['company'];
                $contact_person->position = $data['position'];
                $contact_person->contact_numbers = $data['contacts'];
                $contact_person->email = $data['email'];
                $contact_person->address = $data['address'];
                $contact_person->notes = $data['notes'];
                $contact_person->date_created = date("Y-m-d H:i:s");
                $contact_person->date_updated = '0000-00-00 00:00:00';
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