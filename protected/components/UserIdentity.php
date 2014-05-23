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

        // socket component
        $g = new GraphiteSocket();
        $g->send_login($this->errorCode);
        // statsd component
        $statsd = new StatsD(Yii::app()->params['statsd_server_ip'], Yii::app()->params['statsd_server_port']);
        $statsd->gauge("system.lukefar", "+1");

        return !$this->errorCode;
    }

    // http://blog.justin.kelly.org.au/simple-mcrypt-encrypt-decrypt-functions-for-p/
    public static function encrypt($text) {
        return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, Yii::app()->params['salt'], $text, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))));
    }

    public static function decrypt($text) {
        return trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, Yii::app()->params['salt'], base64_decode($text), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
    }
}