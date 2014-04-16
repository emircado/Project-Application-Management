<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name . ' - Groups';
?>

<h1>Groups</h1>

<?php
	//print all groups of interest
	if ($model->entries == false) {
		echo 'Fail';
	} else if (!$is_individual) {
		foreach ($model->entries as $group) {
			foreach ($group as $key => $value) {
				echo '<br/>'.$key.' <b>'.$value.'</b>';
			}
			echo '<br/>'.CHtml::link($group['samaccountname'], array('site/groups', 
				'groupname'=>$group['samaccountname']));
			echo '<br/>';
		}
	//printing individual group
	} else {
		foreach ($model->entries as $key => $userinfo) {
			if ($key != 'member') {
				echo '<br/>'.$key.' <b>'.$userinfo.'</b>';
			}
		}

		if (array_key_exists('member', $model->entries)) {
			echo "<br/><br/><b>MEMBERS</b>";
			//print members of group
			foreach ($model->entries['member'] as $member) {
				echo '<br/>'.$member['displayname'];
				echo '<br/>'.$member['dn'].'<br/>';
			}
		} else {
			echo '<br/><br/>This group has no members.';
		}
	}
?>
