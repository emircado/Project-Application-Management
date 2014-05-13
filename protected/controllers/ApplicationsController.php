<?php

class ApplicationsController extends Controller
{
    public function actionList()
    {
        echo CJSON::encode(array(
            'type' => 'success',
            'data' => '',
        ));
    }

    public function actionCreate()
    {
        $data = $_POST;

        if (!empty($data)) {
            //FORM VALIDATION HERE
            $errors = array();
            //code is required
            if (strlen($data['type_name']) == 0) {
                array_push($errors, 'TYPE_ERROR: Type is required');
            //invalid code
            } else {
                $app_type = ApplicationTypes::model()->find('name=:name', array(':name'=>$data['type_name']));
                if ($app_type == null) {
                    array_push($errors, 'TYPE_ERROR: Type is not in the list');
                } else {
                    $data['type_id'] = $app_type->type_id;
                }
            }

            //accessibility is required
            if (strlen($data['accessibility']) == 0) {
                array_push($errors, 'ACCESSIBILITY_ERROR: Accessibility is required');
            //accessibility should either be PUBLIC or PRIVATE only
            } else if ($data['accessibility'] != 'PUBLIC' && $data['accessibility'] != 'PRIVATE') {
                array_push($errors, 'ACCESSIBILITY_ERROR: Accessibility option selected is invalid');
            }

            //data is good
            if (count($errors) == 0) {
                $application = new Applications;
                $application->project_id        = $data['project_id'];
                $application->type_id           = $data['type_id'];
                $application->name              = $data['name'];
                $application->description       = $data['description'];
                $application->accessibility     = $data['accessibility'];
                $application->repository_url    = $data['repository_url'];
                $application->instructions      = $data['instructions'];
                $application->rd_point_person   = $data['rd_point_person'];
                $application->production_date   = $data['production_date'];
                $application->termination_date  = $data['termination_date'];
                $application->date_created      = date("Y-m-d H:i:s");
                $application->date_updated      = '0000-00-00 00:00:00';
                $application->save();

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
}