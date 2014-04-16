<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name . ' - Users';
?>

<h1>Users</h1>

<?php
	if ($model->entries == false) {
		echo 'Bind failed';
	} else {
		foreach ($model->entries as $user) {
			echo '<br/>'.$user;
		}
	}
?>