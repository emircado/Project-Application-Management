<?php

class GraphiteSocket extends CApplicationComponent
{
    private $socket;

    public function __construct()
    {
        // $this->socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);

        try {
            if (($this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) == false)
            {
                throw new GraphiteSocketException('socket_create() failed: reason: '.socket_strerror(socket_last_error()));
            }

            if (socket_connect($this->socket, Yii::app()->params['graphite_server_ip'], Yii::app()->params['graphite_server_port']) === false)
            {
                throw new GraphiteSocketException('socket_connect() failed: reason: '.socket_strerror(socket_last_error($this->socket)));
            }
        } catch (Exception $e) {
        }
    }

    public function send_login($error_code) {
        $timestamp = time();
        $message = "system.lukedown 1.00 ".$timestamp."\n";

        // switch ($error_code) {
        //     case UserIdentity::ERROR_NONE:
        //         $message .= "pamgmt.accounts.authentication.login.succeeded 1.00 ".$timestamp."\n";
        //         break;
        //     case UserIdentity::ERROR_PASSWORD_INVALID:
        //         $message .= "pamgmt.accounts.authentication.login.failed 1.00 ".$timestamp."\n";
        //         break;
        //     case UserIdentity::ERROR_LDAP_BINDING:
        //         $message .= "pamgmt.accounts.authentication.login.failed 1.00 ".$timestamp."\n";
        //         break;
        // }
        $this->send($message);
    }

    public function send_projectlist($time)
    {
        $timestamp = time();
        $message = "system.lukeup ".$time.'.00 '.$timestamp."\n";
        $this->send($message);
    }

    public function send($message) {
        // socket_sendto($this->socket, $message, strlen($message), 0, Yii::app()->params['graphite_server_ip'], Yii::app()->params['graphite_server_port']);
        socket_write($this->socket, $message);
    }
}

class GraphiteSocketException extends Exception {}