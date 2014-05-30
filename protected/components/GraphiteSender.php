<?php

class GraphiteSender extends CApplicationComponent
{
    private $connection;
    private $method;    //either direct or statsd

    public function __construct($method)
    {
        $this->method = $method;

        if ($this->method == 'direct') {
            //BY UDP
            $this->connection = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);

            //BY TCP
            // try {
            //     if (($this->connection = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) == false)
            //     {
            //         throw new GraphiteSenderException('socket_create() failed: reason: '.socket_strerror(socket_last_error()));
            //     }
            //     if (socket_connect($this->connection, Yii::app()->params['graphite_server_ip'], Yii::app()->params['graphite_server_port']) === false)
            //     {
            //         throw new GraphiteSenderException('socket_connect() failed: reason: '.socket_strerror(socket_last_error($this->connection)));
            //     }
            // } catch (Exception $e) {
            // }
        } else if ($this->method == 'statsd') {
            $this->connection = new StatsD(Yii::app()->params['statsd_server_ip'], Yii::app()->params['statsd_server_port']);
        } else {
            throw new GraphiteSenderException('invalid means of sending');
        }
    }

    public function send_login($error_code) {
        if ($this->method == 'direct') {
            $timestamp = time();
            $message = "pamgmt.accounts.authentication.login.attempted 1.00 ".$timestamp."\n";

            switch ($error_code) {
                case UserIdentity::ERROR_NONE:
                    $message .= "pamgmt.accounts.authentication.login.succeeded 1.00 ".$timestamp."\n";
                    break;
                case UserIdentity::ERROR_PASSWORD_INVALID:
                    $message .= "pamgmt.accounts.authentication.login.failed 1.00 ".$timestamp."\n";
                    break;
                case UserIdentity::ERROR_LDAP_BINDING:
                    $message .= "pamgmt.accounts.authentication.login.failed 1.00 ".$timestamp."\n";
                    break;
            }
            $this->send($message);
        } else if ($this->method == 'statsd') {
            $this->connection->gauge("pamgmt.accounts.authentication.login.attempted", "+1");
            switch ($error_code) {
                case UserIdentity::ERROR_NONE:
                    $this->connection->gauge("pamgmt.accounts.authentication.login.succeeded", "+1");
                    break;
                case UserIdentity::ERROR_PASSWORD_INVALID:
                    $this->connection->gauge("pamgmt.accounts.authentication.login.failed", "+1");
                    break;
                case UserIdentity::ERROR_LDAP_BINDING:
                    $this->connection->gauge("pamgmt.accounts.authentication.login.failed", "+1");
                    break;
            }
        }
    }

    public function send_projectlist($time)
    {
        if ($this->method == 'direct') {
            $timestamp = time() - ((3*60)+50);
            $message = "pamgmt.projects.list.load.time ".$time.".00 ".$timestamp."\n";
            $this->send($message);
        } else if ($this->method == 'statsd') {
            $this->connection->timing("pamgmt.projects.list.load.time", $time);
        }
    }

    private function send($message) {
        //BY UDP
        socket_sendto($this->connection, $message, strlen($message), 0, Yii::app()->params['graphite_server_ip'], Yii::app()->params['graphite_server_port_udp']);
        
        //BY TCP
        // socket_write($this->connection, $message);
    }
}

class GraphiteSenderException extends Exception {}