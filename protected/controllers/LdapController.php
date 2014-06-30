<?php

class LdapController extends Controller
{
    public function filters()
    {
        return array(
            'accessControl',
            'postOnly + sync',
            'ajaxOnly + sync, getgroups, getusers',
        );
    }

    public function accessRules()
    {
        return array(
            array(
                'allow',
                'actions'=>array('sync', 'getgroups','getusers'),
                'users'=>array('@'),
            ),
            array(
                'deny',
                'users'=>array('*'),
            ),
        );
    }

    public function actionSync()
    {
        try {
            $model = new LDAPModel;
        
            // update users table
            $model->get_users_list();
            $users = $model->entries;

            LdapUserGroups::model()->deleteAll();

            LdapUsers::model()->deleteAll();
            foreach ($users as $username => $name)
            {
                $user = new LdapUsers;
                $user->username = $username;
                $user->name = $name;
                $user->save();
            }

            // update groups table and relations
            $model->get_selection();
            $groups = $model->entries;

            LdapGroups::model()->deleteAll();
            foreach ($groups as $name => $members)
            {
                $group = new LdapGroups;
                $group->name = $name;
                $group->save();

                foreach ($members as $username => $displayname)
                {
                    $member = new LdapUserGroups;
                    $member->username = $username;
                    $member->group_id = $group->group_id;
                    $member->save();
                }
            }

            echo CJSON::encode(array(
                'type'  => 'success',
                'data'  => '',
            ));
        } catch (LDAPModelException $e) {
            echo CJSON::encode(array(
                'type'  => 'error',
                'data'  => 'LDAP_ERROR: Failed to retrieve data from LDAP',
            ));
        }
    }

    public function actionGetGroups()
    {
        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');

        $groups = LdapGroups::model()->findAll();
        $data = array();
        foreach ($groups as $group) {
            $data[$group->name] = array();
            foreach ($group->members as $member) {
                $data[$group->name][$member->username] = $member->name;
            }
        }
        echo CJSON::encode($data);
    }

    public function actionGetUsers()
    {
        if (!isset($_GET['YII_CSRF_TOKEN']))
            throw new CHttpException(400, 'Bad Request');
        else if ($_GET['YII_CSRF_TOKEN'] !=  Yii::app()->request->csrfToken)
            throw new CHttpException(400, 'Bad Request');
        
        $users = LdapUsers::model()->findAll();
        $data = array();
        foreach ($users as $user) {
            $data[$user->username] = $user->name;
        }
        echo CJSON::encode($data);
    }
}