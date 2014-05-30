<?php

class NotesController extends Controller
{
    public function actionList()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');

        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');

        $limit = Yii::app()->params['notes_per_page'];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page-1)*$limit;
        $filter = array();

        if (isset($_GET['project_id']) && !empty($_GET['project_id']))
            $filter['project_id'] = (string) $_GET['project_id'];

        if (isset($_GET['application_id']) && !empty($_GET['application_id'])) {
            $filter['application_id'] = (string) $_GET['application_id'];
        } else {
            $filter['application_id'] = NULL;
        }

        $notes = $this->get_data($filter, $limit, $offset);

        $return_data = array(
            'page'=>$page,
            'totalPage'=> ($notes['total_count'] == 0) ? 1 : ceil($notes['total_count']/$limit),
            'totalData'=>$notes['total_count'],
            'limit'=>$limit,
            'resultData'=>$notes['data'],
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

            if(isset($filter['application_id']))
                $criteria->compare('application_id', $filter['application_id']);
        }

        $count = Notes::model()->count($criteria);
        
        $criteria->limit = $limit;
        $criteria->offset = $offset;
        $criteria->order = 'date_created DESC';
        
        $model = Notes::model()->findAll($criteria);
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
                'note_id'           => $row->note_id,
                'project_id'        => $row->project_id,
                'application_id'    => $row->application_id,
                'notes'             => $row->notes,
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

        //will be empty if CSRF authentication fails
        if (!empty($data)) {
            $note                 = new Notes;
            $note->project_id     = (isset($data['project_id']))? $data['project_id'] : Applications::model()->findByPk($data['application_id'])->project_id;
            $note->application_id = (isset($data['application_id']))? $data['application_id'] : NULL;
            $note->notes          = trim($data['notes']);
            $note->date_created   = date("Y-m-d H:i:s");
            $note->date_updated   = '0000-00-00 00:00:00';
            $note->created_by     = Yii::app()->user->name;
            $note->save();

            echo CJSON::encode(array(
                'type' => 'success',
                'data' => $note,
            ));
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
            $errors = array();

            //editable only by creator
            $note = Notes::model()->findByPk($data['note_id']);
            if ($note->created_by != Yii::app()->user->name) {
                array_push($errors, 'UPDATEDBY_ERROR: Only the creator can update the note');
            }

            if (count($errors) == 0) {
                $updates = array(
                    'notes'         => $data['notes'],
                    'date_updated'  => date("Y-m-d H:i:s"),
                    'updated_by'    => Yii::app()->user->name,
                );

                Notes::model()->updateByPk($data['note_id'], $updates);
                
                echo CJSON::encode(array(
                    'type' => 'success',
                    'data' => $updates,
                ));
            } else {
                echo CJSON::encode(array(
                    'type' => 'error', 
                    'data' => $errors,
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
            Notes::model()->deleteByPk($data['note_id']);

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