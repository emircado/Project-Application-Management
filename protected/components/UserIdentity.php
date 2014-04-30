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
				$this->errorCode = self::ERROR_NONE;
			} else {
				$this->errorCode = self::ERROR_PASSWORD_INVALID;
			}
		} catch (adLDAPException $e) {
			$this->errorCode = self::ERROR_LDAP_BINDING;
		}

		// if (($sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) == false) {
		// 	echo "socket_create() failed: reason: ".socket_strerror(socket_last_error());
		// }

		// $address = '10.11.2.29';
		// $port = 2003;

		// if (socket_connect($sock, $address, $port) === false) {
		// 	echo 'socket_connect() failed: reason: '.socket_strerror(socket_last_error($sock));
		// }

		// for ($i = 0; $i < 100; $i++) {
			// $in = "system.loadavg_1min 10.00 ".time()."\n";
			// $in .= "system.loadavg_5min 10.00 ".time()."\n";
			// $in .= "system.loadavg_15min 10.00 ".time()."\n";
			// $in .= "system.luke 10.00 ".time()."\n";
			// socket_write($sock, $in);

			// sleep(1);
		// }

		
		return !$this->errorCode;
	}
}