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
        'PDEV', 'PDEV-Tech', 'PDEVTech', 'PDev-SPBO', 'UI', 'UX'
    );

    // CODE FOR ADLDAP
    // public function __construct()
    // {
    //     $username = UserIdentity::encrypt_decrypt('decrypt', Yii::app()->session['username']);
    //     $password = UserIdentity::encrypt_decrypt('decrypt', Yii::app()->session['password']);

    //     if (!Yii::app()->ldap->authenticate($username, $password)) {
    //         throw new LDAPModelException('Invalid LDAP authentication');
    //     }
    // } 

    // CODE FOR ADLDAP
    // NOT USED - For checking LDAP content only
    // public function get_users() {
    //     //will end up false if bind is fail
    //     $this->entries = false;
    //     $list = Yii::app()->ldap->user()->all();
    
    //     //clean entries here
    //     if ($list != false) {
    //         $this->entries = array();

    //         foreach ($list as $l) {
    //             //check if user is a member of any group of interest
    //             if (count(array_intersect(Yii::app()->ldap->user()->groups($l['samaccountname'][0]), $this->group_filter)) != 0) {
    //                 $name = explode(',', $l['dn']);
    //                 array_push($this->entries, array(
    //                     'samaccountname' => $l['samaccountname'][0],
    //                     'displayname' => substr($name[0],3),
    //                     'dn' => $l['dn'],
    //                 ));
    //             }
    //         }
    //     }
    // }

    // USED - returns list of username->name
    public function get_users_list() {
        $this->entries = false;

        $query = new LDAPQuery;
        $list = $query->get_users();


        if ($list !== false) {
            $this->entries = array();

            foreach ($list as $l) {
                // CODE FOR ADLDAP
                // $name = explode(',', $l['dn']);
                // $this->entries[$l['samaccountname'][0]] = substr($name[0],3);

                // CODE FOR LDAP
                $this->entries[$l["uid"][0]] = $l["cn"][0];
            }
        }
    }

    // USED - returns list of groups->members(name, username)
    public function get_selection() {
        // CODE FOR ADLDAP
        // $this->entries = array();

        // foreach ($this->group_filter as $grp) {
        //     $data = Yii::app()->ldap->group()->members($grp, true);
        //     $members = array();

        //     if (is_array($data)) {

        //         foreach ($data as $mem) {
        //             $d = Yii::app()->ldap->user()->info($mem, array("samaccountname", "dn"));
        //             $name = explode(',', $d[0]['dn']);

        //             // username -> display name
        //             $members[$d[0]['samaccountname'][0]] = substr($name[0], 3);
        //         }
        //         asort($members);
        //     }
        //     $this->entries[$grp] = $members;
        // }
        // ksort($this->entries);
    
        // CODE FOR LDAP
        $this->entries = false;

        $query = new LDAPQuery;
        $list = $query->get_groups();

        if ($list !== false) {
            $this->entries = array();

            foreach ($list as $l) {
                $this->entries[$l["cn"][0]] = $this->add_members($query, $l["uniquemember"]);
            }
        }
    }

    // recursive
    private function add_members($query, $groupArray)
    {
        $members = array();
        for($i = 0; $i < $groupArray["count"]; $i++) {
            $name = explode(',', $groupArray[$i]);
            // if member is a group
            if (strpos($groupArray[$i], "cn") === 0) {
                $list = $query->get_groups(substr($name[0],3));

                if (count($list) > 0) {
                    $group2 = $this->add_members($query, $list[0]["uniquemember"]);
                    foreach ($group2 as $username => $cn) {
                        $members[$username] = $cn;
                    }
                }

            // if member is a user
            } else if (strpos($groupArray[$i], "uid") === 0) {
                $user = $query->get_users(substr($name[0],4));
                $members[substr($name[0],4)] = $user[0]["cn"][0];
            }
        }
        return $members;
    }

    // CODE FOR ADLDAP
    // NOT USED - For checking LDAP content only
    // public function get_userinfo($username) {
    //     //will end up false if bind is fail or user is not in any group if interest
    //     $this->entries = false;
    //     $info = Yii::app()->ldap->user()->info($username);

    //     //clean info here
    //     if ($info != false) {
    //         // $groups = array_intersect(Yii::app()->ldap->user()->groups($username), $this->group_filter);
    //         $groups = Yii::app()->ldap->user()->groups($username);

    //         // if (count($groups) != 0) {
    //             $info = $info[0];

    //             //CLEANING OPTION #1: EXHAUST ALL POSSIBLE ATTRIBUTE, CATCH UNKNOWN ATTRIBUTE
    //             $this->entries = array();
    //             foreach ($info as $key => $value) {
    //                 switch ($key) {
    //                     case 'primarygroupid':  $this->entries['primarygroupid'] = $info['primarygroupid'][0]; break;
    //                     case 'objectsid':       $this->entries['objectsid'] = $info['objectsid'][0]; break;
    //                     case 'samaccountname':  $this->entries['samaccountname'] = $info['samaccountname'][0]; break;
    //                     case 'dn':
    //                         $this->entries['dn'] = $info['dn'];
    //                         $name = explode(',', $info['dn']);
    //                         $this->entries['displayname'] = substr($name[0],3);
    //                         break;
    //                     case 'displayname':     $this->entries['displayname'] = $info['displayname'][0]; break;
    //                     case 'mail':            $this->entries['mail'] = $info['mail'][0]; break;
    //                     case 'memberof':
    //                         $name = explode(',', $info['memberof'][0]);
    //                         $this->entries['memberof'] = substr($name[0], 3); break;
    //                     //unknown attribute
    //                     default:
    //                         if ($key != 'count' && !is_int($key)) {
    //                             $this->entries[$key] = $info[$key];
    //                         }
    //                 }
    //             }
    //             $this->entries['groups'] = $groups;

    //             //CLEANING OPTION #2: GET ONLY KNOWN/INTERESTING ATTRIBUTES
    //             // if (array_key_exists('primarygroupid', $info)) {$this->entries['primarygroupid'] = $info['primarygroupid'][0];}
    //             // if (array_key_exists('objectsid', $info)) {$this->entries['objectsid'] = $info['objectsid'][0];}
    //             // if (array_key_exists('samaccountname', $info)) {$this->entries['samaccountname'] = $info['samaccountname'][0];}
    //             // if (array_key_exists('dn', $info)) {$this->entries['dn'] = $info['dn'];}
    //             // if (array_key_exists('memberof', $info)) {$this->entries['memberof'] = $info['memberof'][0];}

    //             // // get displayname
    //             // if (array_key_exists('displayname', $info)) {
    //             //     $this->entries['displayname'] = $info['displayname'][0];
    //             // // derive displayname from dn if displayname does not exist in directory
    //             // } else {
    //             //     $name = explode(',', $info['dn']);
    //             //     $this->entries['displayname'] = substr($name[0],3);
    //             // }
    //         // }
    //     }
    // }

    // CODE FOR ADLDAP
    // NOT USED - For checking LDAP content only
    // public function get_groups() {
    //     //will end up false if bind is fail
    //     $this->entries = false;
    //     $list = Yii::app()->ldap->group()->all();

    //     //clean entries, cannot access groups not in filter
    //     if ($list != false) {
    //         $this->entries = array();

    //         foreach ($list as $l) {
    //             // if (in_array($l['samaccountname'][0], $this->group_filter)) {
    //                 $name = explode(',', $l['dn']);
    //                 array_push($this->entries, array(
    //                     'samaccountname' => $l['samaccountname'][0],
    //                     'displayname' => substr($name[0],3),
    //                     'dn' => $l['dn'],
    //                 ));
    //             // }
    //         }
    //     }
    // }

    // CODE FOR ADLDAP
    // NOT USED - For checking LDAP content only
    // public function get_groupinfo($groupname) {
    //     //will end up false if bind is fail or group is not of interest
    //     $this->entries = false;
    //     $info = Yii::app()->ldap->group()->info($groupname);

    //     //clean info here, cannot access groups not in filter
    //     // if ($info != false && in_array($groupname, $this->group_filter)) {
    //         $info = $info[0];

    //         $this->entries = array();
    //         foreach ($info as $key => $value) {
    //             switch ($key) {
    //                 case 'cn':                 $this->entries['cn'] = $info['cn'][0]; break;
    //                 case 'distinguishedname':  $this->entries['distinguishedname'] = $info['distinguishedname'][0]; break;
    //                 case 'samaccountname':     $this->entries['samaccountname'] = $info['samaccountname'][0]; break;
    //                 case 'objectcategory':     $this->entries['objectcategory'] = $info['objectcategory'][0]; break;
    //                 case 'dn':                 $this->entries['dn'] = $info['dn']; break;
    //                 case 'memberof':
    //                     $name = explode(',', $info['memberof'][0]);
    //                     $this->entries['memberof'] = substr($name[0], 3); break;
    //                 // case 'member':
    //                     // $members = array();
    //                     // for ($i = 0; $i < $info['member']['count']; $i++) {

    //                     // }
    //                     // foreach($info['member'] as $key => $mem) {
    //                     //     echo '<br/>'.$key.' '.$mem;
    //                     // }
    //                     // exit();
    //                     // foreach ($info['member'] as $key => $mem) {
    //                     //     if ($key != 'count') {
    //                     //         $name = explode(',', $mem);
    //                     //         array_push($members, array(
    //                     //             'dn' => $mem, 
    //                     //             'displayname' => substr($name[0], 3),
    //                     //         ));
    //                     //     }
    //                     // }
    //                     // $this->entries['member'] = $members;
    //                     break;
    //                 //unknown attribute
    //                 default:
    //                     if ($key != 'count' && !is_int($key) && $key != 'member') {
    //                         $this->entries[$key] = $info[$key];
    //                     }
    //             }
    //             $this->entries['member'] = Yii::app()->ldap->group()->members($groupname, true);
    //         }
    //     // }
    // }
}

class LDAPModelException extends Exception {}