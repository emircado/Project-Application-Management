<?php

class GraphiteSocket extends CApplicationComponent
{
    private $socket;

    public function __construct()
    {
        // parent::__construct();
        if (($this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) == false)
        {
            // echo "socket_create() failed: reason: ".socket_strerror(socket_last_error());
            throw new GraphiteSocketException('socket_create() failed: reason: '.socket_strerror(socket_last_error()));
        }

        if (socket_connect($this->socket, Yii::app()->params['graphite_server_ip'], Yii::app()->params['graphite_server_port']) === false)
        {
            // echo 'socket_connect() failed: reason: '.socket_strerror(socket_last_error($this->socket));
            throw new GraphiteSocketException('socket_connect() failed: reason: '.socket_strerror(socket_last_error($this->socket)));
        }
    }

    public function send_login($msg)
    {
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
    }
}

class GraphiteSocketException extends Exception {}