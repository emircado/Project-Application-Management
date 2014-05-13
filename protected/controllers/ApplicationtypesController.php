<?php

class ApplicationtypesController extends Controller
{
    public function actionList()
    {
        $data = ApplicationTypes::model()->findAll();
        $appTypes = array();
        foreach ($data as $d) {
            $appTypes[$d->type_id] = $d->name;
        }        

        echo CJSON::encode($appTypes);
    }

    public function actionCreate()
    {
        $data = $_POST;

        if (!empty($data['name'])) {
            $data['name'] = substr(strtoupper(preg_replace("/[^a-zA-Z0-9\-\_]/", '', $data['name'])), 0, 5);

            if ($data['name'] != '') {
                $type = ApplicationTypes::model()->find('name=:name', array(':name'=>$data['name']));
                if ($type == null) {
                    $type = new ApplicationTypes;
                    $type->name = $data['name'];
                    $type->created_by = Yii::app()->user->name;
                    $type->save();
                }
                echo CJSON::encode(array(
                    'type' => 'success',
                    'data' => array(
                        'type_id' => $type->type_id,
                        'name' => $type->name,
                    ),
                ));
            } else {
                echo CJSON::encode(array(
                    'type' => 'error',
                    'data' => 'TYPE_ERROR: Invalid application type',
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