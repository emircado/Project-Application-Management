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

        // send login details
        $sender = new GraphiteSender('statsd');
        $sender->send_login($this->errorCode);
        $sender = new GraphiteSender('direct');
        $sender->send_login($this->errorCode);

        return !$this->errorCode;
    }

    // http://naveensnayak.wordpress.com/2013/03/12/simple-php-encrypt-and-decrypt/
    // function encrypt_decrypt($action, $string) {
    //     $output = false;

    //     $encrypt_method = "AES-256-CBC";
    //     $secret_key = 'This is my secret key';
    //     $secret_iv = 'This is my secret iv';

    //     // hash
    //     $key = hash('sha256', $secret_key);
        
    //     // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
    //     $iv = substr(hash('sha256', $secret_iv), 0, 16);

    //     if( $action == 'encrypt' ) {
    //         $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
    //         $output = base64_encode($output);
    //     }
    //     else if( $action == 'decrypt' ){
    //         $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
    //     }

    //     return $output;
    // }
}