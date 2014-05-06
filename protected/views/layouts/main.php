<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<!-- blueprint CSS framework -->
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/screen.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css" media="print" />
	<!--[if lt IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
	<![endif]-->

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/form.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/test.css" />

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
    <script>
        var baseURL = '<?= Yii::app()->request->baseUrl; ?>';
    </script>
    
    <!--add mootools lib here-->
    <script src="<?= Yii::app()->request->baseUrl; ?>/js/lib/mootools-core-1.4.5.js"></script>
	<script src="<?= Yii::app()->request->baseUrl; ?>/js/lib/mootools-more-1.4.0.1.js"></script>
	<script src="<?= Yii::app()->request->baseUrl; ?>/js/common.js"></script>
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
				array('label'=>'Home', 'url'=>array('/site')),
				array('label'=>'Projects', 'url'=>array('/projects'), 'visible'=>!Yii::app()->user->isGuest),
				array('label'=>'Users', 'url'=>array('/site/users'), 'visible'=>!Yii::app()->user->isGuest),
				array('label'=>'Groups', 'url'=>array('/site/groups'), 'visible'=>!Yii::app()->user->isGuest),
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
            $data = array();
            
            if(isset($this->modals))
                    echo $this->renderPartial('//layouts/modals/' . $this->modals, $data);
        ?>
    </div>

</div><!-- page -->

</body>
</html>
