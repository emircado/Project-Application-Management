<?php

class SiteController extends Controller
{
    public function filters()
    {
        return array(
            'accessControl',
        );
    }

    public function accessRules()
    {
        return array(
            array(
                'allow',
                'actions'=>array('index', 'groups', 'users', 'logout'),
                'users'=>array('@'),
            ),
            array(
                'allow',
                'actions'=>array('login'),
                'users'=>array('*'),
            ),
            array(
                'deny',
                'users'=>array('*'),
            ),
        );
    }

    public function actionIndex()
    {
        $this->render('index');
    }

    public function actionError()
    {
        if($error=Yii::app()->errorHandler->error)
        {
            if(Yii::app()->request->isAjaxRequest)
                echo $error['message'];
            else
                $this->render('error', $error);
        }
    }

    public function actionUsers($username = NULL)
    {
        try {
            $model = new LDAPModel;

            $is_individual = False;

            if ($username == NULL) {
                $model->get_users();
            } else {
                $model->get_userinfo($username);
                $is_individual = True;
            }
            $this->render('users', array('model'=>$model, 'is_individual'=>$is_individual));

        } catch (LDAPModelException $e) {
            throw new CHttpException(404, 'The specified page cannot be found');
        }
    }

    public function actionGroups($groupname = NULL)
    {
        try {
            $model = new LDAPModel;
            $is_individual = False;

            if ($groupname == NULL) {
                $model->get_groups();
            } else {
                $model->get_groupinfo($groupname);
                $is_individual = True;
            }
            $this->render('groups', array('model'=>$model, 'is_individual'=>$is_individual));
        } catch (LDAPModelException $e) {
            throw new CHttpException(404, 'The specified page cannot be found');
        }
    }

    public function actionLogin()
    {
        $model=new LoginForm;

        // if it is ajax validation request
        if(isset($_POST['ajax']) && $_POST['ajax']==='login-form')
        {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }

        // collect user input data
        if(isset($_POST['LoginForm']))
        {
            $model->attributes=$_POST['LoginForm'];
            // validate user input and redirect to the previous page if valid
            if($model->validate() && $model->login())
                $this->redirect(Yii::app()->user->returnUrl);
        }
        // display the login form
        $this->render('login',array('model'=>$model));
    }

    public function actionLogout()
    {
        //close LDAP connection here
        Yii::app()->ldap->close();

        //destroy session
        if (isset($_SESSION['username'])) {
            unset($_SESSION['username']);
            unset($_SESSION['password']);
        }

        Yii::app()->user->logout();
        $this->redirect(Yii::app()->homeUrl);
    }
}