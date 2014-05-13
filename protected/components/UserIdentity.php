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

        try {
            $g = new GraphiteSocket();
            $g->send_login($this->errorCode);
        } catch (GraphiteSocketException $e) {
            // save somewhere
        }
        
        return !$this->errorCode;
    }
}