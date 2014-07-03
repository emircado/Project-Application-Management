<?php

class LdapController extends Controller
{
    public $extraJS;

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
                'actions'=>array('index', 'sync', 'getgroups','getusers'),
                'users'=>array('@'),
            ),
            array(
                'deny',
                'users'=>array('*'),
            ),
        );
    }

    public function actionIndex()
    {
        $this->extraJS = '<script src="' . Yii::app()->request->baseUrl . '/js/data.js"></script>'.
                         '<script src="' . Yii::app()->request->baseUrl . '/js/ldap.js"></script>';
        $this->render('//site/ldap');
    }

    public function actionSync()
    {
        try {
            $model = new LDAPModel;
        
            // update users table
            $model->get_users_list();
            $users = $model->entries;

            foreach ($users as $username => $name)
            {
                $user = LdapUsers::model()->findByPk($username);
                // create user when nonexistent
                if ($user == null) {
                    $user = new LdapUsers;
                    $user->username = $username;
                    $user->name = $name;
                    $user->save();
                // update user display name if exists
                } else {
                    $user->name = $name;
                    $user->save();
                }
            }

            // update groups table and relations
            $model->get_selection();
            $groups = $model->entries;

            foreach ($groups as $name => $members)
            {
                $group = LdapGroups::model()->find('name=:name', array(':name'=>$name));
                // create group when nonexistent
                if ($group == null) {
                    $group = new LdapGroups;
                    $group->name = $name;
                    $group->save();
                }

                $saved_member = LdapUserGroups::model()->findAll('group_id=:group_id', array(':group_id'=>$group->group_id));
                foreach ($members as $username => $displayname)
                {
                    $in_db = false;
                    foreach ($saved_member as $smem) {
                        if ($smem->username == $username) {
                            $in_db = true;
                            break;
                        }
                    }

                    if ($in_db == false) {
                        $member = new LdapUserGroups;
                        $member->username = $username;
                        $member->group_id = $group->group_id;
                        $member->save();
                    }
                }
            }

            $date_updated = date("Y-m-d H:i:s");
            file_put_contents('ldap_sync.txt', $date_updated);

            echo CJSON::encode(array(
                'type'  => 'success',
                'data'  => $date_updated,
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