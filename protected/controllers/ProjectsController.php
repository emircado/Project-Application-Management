<?php

class ProjectsController extends Controller
{
    /**
     * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
     * using two-column layout. See 'protected/views/layouts/column2.php'.
     */

    public $scripts;


    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules()
    {
        return array(
            array('allow',  // authenticated users only
                'actions'=>array('index'),
                'users'=>array('*'),
            ),
            array('deny',  // deny all users
                'users'=>array('*'),
            ),
        );
    }


    /**
     * Lists all models.
     */
    public function actionIndex()
    {
        if (!Yii::app()->user->isGuest) {
            $this->scripts = array(
                '/myjs/projects_index.js',
            );
            $this->render('index');
        } else {
            $this->redirect('site');
        }
    }

    //Get DB data for projects/index
    public function actionIndexData() {
        // get list of projects
        $criteria = new CDbCriteria();
        // if (isset($_GET['fields'])) {
        //     $criteria->select = $_GET['fields'];
        // }

        $resultData = Projects::model()->findAll($criteria);
        foreach ($resultData as $proj) {
            // foreach ($proj as $key => $value) {
            //     if (is_array($criteria->select) && !in_array($key, $criteria->select)) {
            //         unset($proj[$key]);
            //     } else {
            //     }
            // }
                    if ($proj['production_date'] != NULL) {
                        $proj['production_date'] = date("M j, Y", strtotime($proj['production_date']));
                    }
        }

        $returnArray = array(
            'count' => count($resultData),
            'resultData' => $resultData,
        );

        echo CJSON::encode($returnArray);
    }
}