<?php

class LdapController extends Controller
{
    public function actionGetGroups()
    {
        if (Yii::app()->user->isGuest) {
            echo CJSON::encode("bad1");
        } else {
            try {
                $model = new LDAPModel;
                $model->get_selection();
                echo CJSON::encode($model->entries);

            } catch (LDAPModelException $e) {
                echo CJSON::encode("bad2");
            }
        }
    }

    public function actionGetUsers()
    {
        if (Yii::app()->user->isGuest) {
            echo CJSON::encode("bad1");
        } else {
            try {
                $model = new LDAPModel;
                $model->get_users_list();
                echo CJSON::encode($model->entries);
            } catch (LDAPModelException $e) {
                echo CJSON::encode("bad2");
            }
        }
    }
}