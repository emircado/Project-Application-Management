<?php

class LDAPQuery extends CApplicationComponent
{
    private $bind = null;
    private $connection = null;

    // NOTES
    // with parameters - for user identity authentication
    // without parameters - when session data exists, for getting data from LDAP
    public function __construct($username = null, $password = null)
    {
        // bind and connect to the server
        if ($username == null || $password == null) {
            if (isset($_SESSION['username']) && isset($_SESSION['password'])) {
                $username = UserIdentity::encrypt_decrypt('decrypt', Yii::app()->session['username']);
                $password = UserIdentity::encrypt_decrypt('decrypt', Yii::app()->session['password']);
            } else {
                throw new LDAPQueryException('Username and/or password missing');
            }
        }

        $options = Yii::app()->params['ldap'];
         
        $this->connection = ldap_connect($options['host']);
        ldap_set_option($this->connection, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($this->connection, LDAP_OPT_REFERRALS, 0);
        ldap_start_tls($this->connection);

        if($this->connection)
        {
            // Note: in general it is bad to hide errors, however we're checking for an error below
            $this->bind = @ldap_bind($this->connection, "uid={$username},ou={$options['ou']},{$options['base_dn']}", $password); 
        }
    }

    public function get_bind()
    {
        return $this->bind;
    }

    public function get_connection()
    {
        return $this->connection;
    }

    // Revised code from adLDAP
    public function get_users($username = null)
    {
        if ($this->connection !== false) {
            $add_filter = ($username == null)? '' : "(uid={$username})";
            $filter = "(&(objectclass=person){$add_filter})";
            $fields = array("uid","cn");
            $sr = ldap_search($this->connection, "dc=chikka,dc=org", $filter, $fields);
            $entries = ldap_get_entries($this->connection, $sr);

            $usersArray = array();
            for ($i=0; $i<$entries["count"]; $i++){
                array_push($usersArray, $entries[$i]);
            }
            asort($usersArray);
            return $usersArray;
        }
        return false;
    }

    // Revised code from adLDAP
    public function get_groups($groupname = null)
    {
        $connection = $this->get_connection();
        if ($connection !== false) {
            $add_filter = ($groupname == null)? '' : "(cn={$groupname})";
            $filter = "(&(objectclass=groupofuniquenames){$add_filter})";
            $fields = array("cn","uniquemember");
            $sr = ldap_search($connection, "dc=chikka,dc=org", $filter, $fields);
            $entries = ldap_get_entries($connection, $sr);

            $groupsArray = array();
            for ($i=0; $i<$entries["count"]; $i++){
                array_push($groupsArray, $entries[$i]);
            }
            asort($groupsArray);
            return $groupsArray;
        }
        return false;
    }
}

class LDAPQueryException extends Exception {}