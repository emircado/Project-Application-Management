<?php 

/**
 * LDAPModel class.
 * LDAPModel is the data structure for retrieving
 * information from the LDAP directory. It is used by the 'users' and 'groups' action of 'SiteController'.
 */
class LDAPModel extends CFormModel {

	public $entries;

	public function get_users() {
		//authenticate user first
		if (Yii::app()->ldap->authenticate($_SESSION['username'], $_SESSION['password'])) {
			//may still return false
			$this->entries = Yii::app()->ldap->user()->all();

			//clean entries here
			if ($this->entries != false) {

			}

		} else {
			$this->entries = false;
		}
	}

	// public function get_userinfo($username) {
	// 	//DISPLAY USER INFORMATION
	// 	// echo Yii::app()->ldap->user()->info("ermercado");
	// 	// $x = Yii::app()->ldap->user()->info('ermercado');
	// 	// foreach ($x[0] as $s => $b) {
	// 	// // foreach ($x[0] as $s) {
	// 	// 	// echo '<br/>'.$s[0];
	// 	// 	echo '<br/>'.$s.' '.$b;
	// 	// }
	// }

	public function get_groups() {
		//authenticate user first
		if (Yii::app()->ldap->authenticate($_SESSION['username'], $_SESSION['password'])) {
			//may still return false
			$this->entries = Yii::app()->ldap->group()->all();
		
			//clean entries here
			if ($this->entries != false) {
				
			}

		} else {
			$this->entries = false;
		}
	}


	// public function get_groupinfo($groupname) {
	// 	//DISPLAY GROUPS INFORMATION
	// 	// $x = Yii::app()->ldap->group()->info('RND1');
	// 	// foreach ($x[0]["objectcategory"] as $s => $b) {
	// 	// // foreach ($x[0] as $s) {
	// 	// 	// echo '<br/>'.$s[0];
	// 	// 	echo '<br/>'.$s.' '.$b;
	// 	// }
	// }
}