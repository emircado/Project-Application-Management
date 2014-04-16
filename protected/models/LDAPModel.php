<?php 

/**
 * LDAPModel class.
 * LDAPModel is the data structure for retrieving
 * information from the LDAP directory. It is used by the 'users' and 'groups' action of 'SiteController'.
 */
class LDAPModel extends CFormModel {

	public $entries;

	private $group_filter = array(
		'DEVELOPERS', 'RND1', 'RND2', 'RND3',
		'PDEV', 'PDEV-Tech', 'PDEVTech', 'PDev-SPBO'
	);

	public function __construct() {
		if (!Yii::app()->ldap->authenticate($_SESSION['username'], $_SESSION['password'])) {
			throw new LDAPModelException('Invalid LDAP authentication');
		}
	}

	public function get_users() {
		$list = Yii::app()->ldap->user()->all();
	
		//clean entries here
		if ($list != false) {
			$this->entries = array();

			foreach ($list as $l) {
				$name = explode(',', $l['dn']);
				array_push($this->entries, array(
					'samaccountname' => $l['samaccountname'][0],
					'displayname' => substr($name[0],3),
					'dn' => $l['dn'],
				));
			}

		//fail bind
		} else {
			$this->entries = false;
		}
	}

	public function get_userinfo($username) {
		$info = Yii::app()->ldap->user()->info($username);

		//clean info here
		if ($info != false) {
			$info = $info[0];

			//CLEANING OPTION #1: EXHAUST ALL POSSIBLE ATTRIBUTE, CATCH UNKNOWN ATTRIBUTE
			$this->entries = array();
			foreach ($info as $key => $value) {
				switch ($key) {
					case 'primarygroupid':	$this->entries['primarygroupid'] = $info['primarygroupid'][0]; break;
					case 'objectsid':		$this->entries['objectsid'] = $info['objectsid'][0]; break;
					case 'samaccountname':	$this->entries['samaccountname'] = $info['samaccountname'][0]; break;
					case 'dn':
						$this->entries['dn'] = $info['dn'];
						$name = explode(',', $info['dn']);
						$this->entries['displayname'] = substr($name[0],3);
						break;
					case 'displayname':		$this->entries['displayname'] = $info['displayname'][0]; break;
					case 'mail':			$this->entries['mail'] = $info['mail'][0]; break;
					case 'memberof':
						$name = explode(',', $info['memberof'][0]);
						$this->entries['memberof'] = substr($name[0], 3); break;
					//unknown attribute
					default:
						if ($key != 'count' && !is_int($key)) {
							$this->entries[$key] = $info[$key];
						}
				}
			}
			$this->entries['groups'] = Yii::app()->ldap->user()->groups($username);

			//CLEANING OPTION #2: GET ONLY KNOWN/INTERESTING ATTRIBUTES
			// if (array_key_exists('primarygroupid', $info)) {$this->entries['primarygroupid'] = $info['primarygroupid'][0];}
			// if (array_key_exists('objectsid', $info)) {$this->entries['objectsid'] = $info['objectsid'][0];}
			// if (array_key_exists('samaccountname', $info)) {$this->entries['samaccountname'] = $info['samaccountname'][0];}
			// if (array_key_exists('dn', $info)) {$this->entries['dn'] = $info['dn'];}
			// if (array_key_exists('memberof', $info)) {$this->entries['memberof'] = $info['memberof'][0];}

			// // get displayname
			// if (array_key_exists('displayname', $info)) {
			// 	$this->entries['displayname'] = $info['displayname'][0];
			// // derive displayname from dn if displayname does not exist in directory
			// } else {
			// 	$name = explode(',', $info['dn']);
			// 	$this->entries['displayname'] = substr($name[0],3);
			// }

		//fail bind
		} else {
			$this->entries = false;
		}
	}

	public function get_groups() {
		$list = Yii::app()->ldap->group()->all();

		//clean entries
		if ($list != false) {
			$this->entries = array();

			foreach ($list as $l) {
				if (in_array($l['samaccountname'][0], $this->group_filter)) {
					$name = explode(',', $l['dn']);
					array_push($this->entries, array(
						'samaccountname' => $l['samaccountname'][0],
						'displayname' => substr($name[0],3),
						'dn' => $l['dn'],
					));
				}
			}

		//fail bind
		} else {
			$this->entries = false;
		}
	}


	public function get_groupinfo($groupname) {
		$info = Yii::app()->ldap->group()->info($groupname);

		//clean info here
		if ($info != false && in_array($groupname, $this->group_filter)) {
			$info = $info[0];

			$this->entries = array();
			foreach ($info as $key => $value) {
				switch ($key) {
					case 'cn':					$this->entries['cn'] = $info['cn'][0]; break;
					case 'distinguishedname':	$this->entries['distinguishedname'] = $info['distinguishedname'][0]; break;
					case 'samaccountname':		$this->entries['samaccountname'] = $info['samaccountname'][0]; break;
					case 'objectcategory':		$this->entries['objectcategory'] = $info['objectcategory'][0]; break;
					case 'dn':					$this->entries['dn'] = $info['dn']; break;
					case 'memberof':
						$name = explode(',', $info['memberof'][0]);
						$this->entries['memberof'] = substr($name[0], 3); break;
					case 'member':
						$members = array();
						foreach ($info['member'] as $key => $mem) {
							if ($key != 'count') {
								$name = explode(',', $mem);
								array_push($members, array(
									'dn' => $mem, 
									'displayname' => substr($name[0], 3),
								));
							}
						}
						$this->entries['member'] = $members;
						break;
					//unknown attribute
					default:
						if ($key != 'count' && !is_int($key)) {
							$this->entries[$key] = $info[$key];
						}
				}
			}
		//fail bind
		} else {
			$this->entries = false;
		}
	}
}

class LDAPModelException extends Exception {}