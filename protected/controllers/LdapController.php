<?php

class LdapController extends Controller
{
    public function filters()
    {
        return array(
            'accessControl',
            'ajaxOnly + getgroups, getusers',
        );
    }

    public function accessRules()
    {
        return array(
            array(
                'allow',
                'actions'=>array('getgroups','getusers'),
                'users'=>array('@'),
            ),
            array(
                'deny',
                'users'=>array('*'),
            ),
        );
    }

    public function actionGetGroups()
    {
        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');

        try {
            $model = new LDAPModel;
            $model->get_selection();
            echo CJSON::encode($model->entries);

        } catch (LDAPModelException $e) {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => 'LDAP_ERROR: Failed to retrieve data from LDAP',
            ));
        }
    }

    public function actionGetUsers()
    {
        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');
        
        try {
            $model = new LDAPModel;
            $model->get_users_list();
            echo CJSON::encode($model->entries);
        } catch (LDAPModelException $e) {
            echo CJSON::encode(array(
                'type' => 'error',
                'data' => 'LDAP_ERROR: Failed to retrieve data from LDAP',
            ));
        }
    }
}