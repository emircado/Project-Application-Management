<?php

class GraphiteSocket extends CApplicationComponent
{
    private $socket;
    public $is_connected = false;

    public function __construct()
    {
        try {
            if (($this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) == false)
            {
                throw new GraphiteSocketException('socket_create() failed: reason: '.socket_strerror(socket_last_error()));
            }

            if (@socket_connect($this->socket, Yii::app()->params['graphite_server_ip'], Yii::app()->params['graphite_server_port']) === false)
            {
                throw new GraphiteSocketException('socket_connect() failed: reason: '.socket_strerror(socket_last_error($this->socket)));
            }
            $this->is_connected = true;
        } catch (Exception $e) {
        }

        //send saved data if any
    }

    public function send_login($msg)
    {
        if ($this->is_connected == true) {
            $timestamp = time();
            $in = "pamgmt.accounts.authentication.login.attempted 1.00 ".$timestamp."\n";
            switch($msg)
            {
                case UserIdentity::ERROR_NONE:
                    $in .= "pamgmt.accounts.authentication.login.succeeded 1.00 ".$timestamp."\n";
                    break;
                case UserIdentity::ERROR_PASSWORD_INVALID:
                    $in .= "pamgmt.accounts.authentication.login.failed 1.00 ".$timestamp."\n";
                    break;
                case UserIdentity::ERROR_LDAP_BINDING:
                    $in .= "pamgmt.accounts.authentication.login.failed 1.00 ".$timestamp."\n";
                    break;
            }
            socket_write($this->socket, $in);
        } else {
            //save data somewhere
        }
    }
}

class GraphiteSocketException extends Exception {}