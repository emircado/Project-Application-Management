<?php

class SiteController extends Controller
{
    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex()
    {
        // renders the view file 'protected/views/site/index.php'
        // using the default layout 'protected/views/layouts/main.php'
        
        // no logged in user
        if (Yii::app()->user->isGuest) {
            $this->actionLogin();
        // logged in user
        } else {
            $this->render('index');
        }
    }

    /**
     * This is the action to handle external exceptions.
     */
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

    /**
     * Displays the users page
     */
    public function actionUsers($username = NULL)
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');

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

    /**
     * Displays the groups page
     */
    public function actionGroups($groupname = NULL)
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');
        
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

    /**
     * Displays the login page
     */
    private function actionLogin()
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

    /**
     * Logs out the current user and redirect to homepage.
     */
    public function actionLogout()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(404, 'The specified page cannot be found');
        
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