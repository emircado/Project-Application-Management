<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name . ' - Users';
?>

<h1>Users</h1>

<?php
	if ($model->entries == false) {
		echo 'Fail';
	} else {
		foreach ($model->entries as $user) {
			foreach ($user as $key => $value) {
				echo '<br/>'.$key.' <b>'.$value.'</b>';
			}
			echo '<br/>'.CHtml::link($user['samaccountname'], array('site/users', 
				'username'=>$user['samaccountname']));
			echo '<br/>';
		}
	}


	// foreach ($x[0] as $s => $b) {
		// foreach ($x[0] as $s) {
			// echo '<br/>'.$s[0];
			// echo '<br/>'.$s.' '.$b;
		// }
?>