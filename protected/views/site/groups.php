<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name . ' - Groups';
?>

<h1>Groups</h1>

<?php
	foreach ($model->entries as $group) {
		echo '<br/>'.$group;//["dn"];

		// foreach ($b as $c => $d) {
		// 	echo '<br/>'.$c.' '.$d;
		// }
	}
?>