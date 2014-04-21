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
                '/js/projects_index.js',
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

        // search here
        $count = Projects::model()->count($criteria);

        $page = $_GET['page'];
        $criteria->limit = 20;
        $criteria->offset = ($page-1)*$criteria->limit;
        // if (isset($_GET['fields'])) {
        //     $criteria->select = $_GET['fields'];
        // }

        $projects = Projects::model()->findAll($criteria);
        foreach ($projects as $p) {
            // foreach ($p as $key => $value) {
            //     if (is_array($criteria->select) && !in_array($key, $criteria->select)) {
            //         unset($p[$key]);
            //     } else {
            //     }
            // }
            if ($p['production_date'] != NULL) {
                $p['production_date'] = date("M j, Y", strtotime($p['production_date']));
            }
        }

        $return_data = array(
            'page' => $page,
            'totalPage' => ceil($count/$criteria->limit),
            'totalData' => $count,
            'resultData' => $projects,
            'limit' => $criteria->limit,
        );

        echo CJSON::encode($return_data);
    }
}