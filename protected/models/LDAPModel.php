<?php 

/**
 * LDAPModel class.
 * LDAPModel is the data structure for retrieving
 * information from the LDAP directory. It is used by the 'users' and 'groups' action of 'SiteController'.
 */
class LDAPModel extends CFormModel {

	public $entries;

	public function __construct() {
		if (!Yii::app()->ldap->authenticate($_SESSION['username'], $_SESSION['password'])) {
			throw new LDAPModelException('Invalid LDAP authentication');
		}
	}

	public function get_users() {
		//may still return false
		$list = Yii::app()->ldap->user()->all();
	
		//clean entries here
		if ($list != false) {
			$this->entries = array();

			foreach ($list as $l) {
				$name = explode(',', $l['dn']);
				array_push($this->entries,
					array(
						'samaccountname' => $l['samaccountname'][0],
						'displayname' => substr($name[0],3),
						'dn' => $l['dn'],
					)
				);
			}

		} else {
			$this->entries = false;
		}
	}

	public function get_userinfo($username) {
		//may still return false
		$this->entries = Yii::app()->ldap->user()->info($username);
		$this->entries = $this->entries[0];

		//clean entries here
		if ($this->entries != false) {

		}
	}

	public function get_groups() {
		//may still return false
		$this->entries = Yii::app()->ldap->group()->all();
	
		//clean entries here
		if ($this->entries != false) {

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

class LDAPModelException extends Exception {}