<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity
{
	const ERROR_LDAP_BINDING = 33;

	/**
	 * Authenticates a user.
	 * @return boolean whether authentication succeeds.
	 */
	public function authenticate()
	{
		try {
			if (Yii::app()->ldap->authenticate($this->username, $this->password)) {
				// Yii::app()->session['bind'] = Yii::app()->ldap->getLdapBind();
				$this->errorCode = self::ERROR_NONE;
			} else {
				$this->errorCode = self::ERROR_PASSWORD_INVALID;
			}
		} catch (adLDAPException $e) {
			$this->errorCode = self::ERROR_LDAP_BINDING;
		}


		// $ldap = Yii::app()->params['ldap'];
		// $dn = $this->username;
		 
		// $ldapconn = ldap_connect($ldap['host']);
		// ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
		// ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
		 
		// if ($ldapconn) {
		// 	// Note: in general it is bad to hide errors, however we're checking for an error below
		// 	$bind = @ldap_bind($ldapconn, $dn, $this->password);

		//     if ($bind) {
		//     	$this->errorCode = self::ERROR_NONE;
		//     	// Yii::app()->session['ldap_conn'] = $this;
		//     } else {
		//     	$this->errorCode = self::ERROR_PASSWORD_INVALID;
		// 	}

		// // error
		// } else {
		// 	$this->errorCode = self::ERROR_LDAP_CONNECTION;
		// }

		return !$this->errorCode;
	}
}