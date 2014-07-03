<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="language" content="en" />

    <!-- blueprint CSS framework -->
    <link rel="stylesheet" type="text/css" href="<?= Yii::app()->request->baseUrl ?>/css/screen.css" media="screen, projection" />
    <link rel="stylesheet" type="text/css" href="<?= Yii::app()->request->baseUrl ?>/css/print.css" media="print" />
    <link rel="stylesheet" type="text/css" href="<?= Yii::app()->request->baseUrl ?>/css/datepicker_vista.css">

    <!--[if lt IE 8]>
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
    <![endif]-->

    <link rel="stylesheet" type="text/css" href="<?= Yii::app()->request->baseUrl ?>/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<?= Yii::app()->request->baseUrl ?>/css/form.css" />
    <link rel="stylesheet" type="text/css" href="<?= Yii::app()->request->baseUrl ?>/css/test.css" />

    <title><?php echo CHtml::encode($this->pageTitle); ?></title>
    <script>
        const baseURL = '<?= Yii::app()->request->baseUrl; ?>';
        const username = '<?= Yii::app()->user->name; ?>';
    </script>
    
    <!--add mootools lib here-->
    <script src="<?= Yii::app()->request->baseUrl; ?>/js/lib/mootools-core-1.4.5.js"></script>
    <script src="<?= Yii::app()->request->baseUrl; ?>/js/lib/mootools-more-1.4.0.1.js"></script>
    <script src="<?= Yii::app()->request->baseUrl; ?>/js/lib/datepicker.js"></script>
    <!--<script src="<?= Yii::app()->request->baseUrl; ?>/js/common.js"></script>-->
    <script src="<?= Yii::app()->request->baseUrl; ?>/js/lib/HashListener.js"></script>
    <script src="<?= Yii::app()->request->baseUrl; ?>/js/lib/HistoryManager.js"></script>
    <!--add here the extra JS-->
    <?php
        if(isset($this->extraJS))
            echo $this->extraJS;
    ?>
</head>

<body>
<div class="container" id="page">

    <div id="header">
        <div id="logo"><?php echo CHtml::encode(Yii::app()->name); ?></div>
    </div><!-- header -->

    <div id="mainmenu">
        <?php $this->widget('zii.widgets.CMenu',array(
            'items'=>array(
                array('label'=>'Home', 'url'=>array('/site'), 'visible'=>Yii::app()->user->isGuest),
                array('label'=>'Projects', 'url'=>array('/projects/index'), 'visible'=>!Yii::app()->user->isGuest),
                array('label'=>'Applications', 'url'=>array('/applications/index'), 'visible'=>!Yii::app()->user->isGuest),
                array('label'=>'Users', 'url'=>array('/users/index'), 'visible'=>!Yii::app()->user->isGuest),
                array('label'=>'Servers', 'url'=>array('/servers/index'), 'visible'=>!Yii::app()->user->isGuest),
                array('label'=>'LDAP', 'url'=>array('/ldap/index'), 'visible'=>!Yii::app()->user->isGuest),
                array('label'=>'Logout ('.Yii::app()->user->name.')', 'url'=>array('/site/logout'), 'visible'=>!Yii::app()->user->isGuest),
            ),
        )); ?>
    </div><!-- mainmenu -->

    <?php echo $content; ?>

    <div class="clear"></div>

    <div id="footer">
        Copyright &copy; <?php echo date('Y'); ?> by Chikka Philippines, Inc.<br/>
    </div><!-- footer -->

    <!-- UI DIALOG BOX -->
    <div id="overlay" class="dialog-box-overlay" style="height: 100%;"></div>
    <div id="dialog-wrapper">
        <?php
            if(isset($this->modals)) {
                foreach ($this->modals as $modal) {
                    echo $this->renderPartial('//layouts/modals/'.$modal);
                }
            }
        ?>
        <div id="overlay2" class="dialog-box-overlay" style="height: 100%;"></div>
    </div>
</div><!-- page -->

</body>
</html>