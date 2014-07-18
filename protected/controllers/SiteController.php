<?php

class SiteController extends Controller
{
    public $extraJS;
    public $modals;

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
        $this->redirect('projects');
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

    public function actionLogin()
    {
        if (!Yii::app()->user->isGuest) {
            $this->redirect('projects');
        }

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
        // Yii::app()->ldap->close();
        // @ldap_close($this->ldapConnection);

        //destroy session
        // if (isset(Yii::app()->session['username']) {
        //     unset(Yii::app()->session['username']);
        //     unset(Yii::app()->session['password']);
        // }
        Yii::app()->session->clear();
        Yii::app()->session->destroy();

        Yii::app()->user->logout();
        $this->redirect(Yii::app()->homeUrl);
    }
}