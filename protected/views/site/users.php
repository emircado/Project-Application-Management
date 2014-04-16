<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name . ' - Users';
?>

<h1>Users</h1>

<?php
	if ($model->entries == false) {
		echo 'Fail';
	} else if (!$is_individual) {
		foreach ($model->entries as $user) {
			foreach ($user as $key => $value) {
				echo '<br/>'.$key.' <b>'.$value.'</b>';
			}
			echo '<br/>'.CHtml::link($user['samaccountname'], array('site/users', 
				'username'=>$user['samaccountname']));
			echo '<br/>';
		}


	} else {
		foreach ($model->entries as $key => $userinfo) {
			echo '<br/>'.$key.' <b>'.$userinfo.'</b>';
		}
		echo "<br/><br/><b>GROUPS</b>";
		//print groups user belongs to
		foreach ($model->entries['groups'] as $grp) {
			echo '<br/>'.$grp;
		}
	}
?>