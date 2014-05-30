<?php

class LdapController extends Controller
{
    public function actionGetGroups()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');

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
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');
        
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