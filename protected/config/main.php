<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
    'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    'name'=>'Project-Application Management',

    // preloading 'log' component
    'preload'=>array('log'),

    // autoloading model and component classes
    'import'=>array(
        'application.models.*',
        'application.components.*',
    ),

    'modules'=>array(
        // uncomment the following to enable the Gii tool
        
        'gii'=>array(
            'class'=>'system.gii.GiiModule',
            'password'=>'password',
            // If removed, Gii defaults to localhost only. Edit carefully to taste.
            'ipFilters'=>array('127.0.0.1','::1', '10.11.3.28'),
        ),
    ),

    // application components
    'components'=>array(
        'request'=>array(
            'enableCsrfValidation'=>true,    
        ),
        'user'=>array(
            // enable cookie-based authentication
            'allowAutoLogin'=>true,
            'loginUrl'=>'login',
        ),
        // uncomment the following to enable URLs in path-format
        
        'urlManager'=>array(
            'urlFormat'=>'path',
            'showScriptName'=>false,
            'rules'=>array(
            	'' => 'site/',
                'login' => 'site/login',
                'logout' => 'site/logout',
                'projects' => 'projects/index',
                'applications' => 'applications/index',
                'servers' => 'servers/index',
                'users' => 'users/index',
                'ldap' => 'ldap/index',
                // '<controller:\w+>/<id:\d+>'=>'<controller>/view',
                // '<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
                // '<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
            ),
        ),

        // uncomment the following to use a MySQL database
        'db'=>array(
            'connectionString' => 'mysql:host=10.11.7.10;dbname=projects',
            'emulatePrepare' => true,
            'username' => 'projects',
            'password' => 'projects',
            'charset' => 'utf8',
        ),
        'errorHandler'=>array(
            // use 'site/error' action to display errors
            'errorAction'=>'site/error',
        ),
        'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                array(
                    'class'=>'CFileLogRoute',
                    'levels'=>'error, warning',
                    // 'logPath'=>'/var/log',
                    // 'logFile'=>'pamgmt.log',
                ),
                // uncomment the following to show log messages on web pages
                /*
                array(
                    'class'=>'CWebLogRoute',
                ),
                */
            ),
        ),
        'ldap'=> array(
            'class'=>'application.extensions.adLDAP.YiiLDAP',
            'options'=> array(
                'ad_port' => 389,
                'domain_controllers' => array('10.11.6.202'),
                'account_suffix' => '@chikkaanson.org',
                'base_dn' => "DC=chikkaanson,DC=org",
                'admin_username' => NULL,
                'admin_password' => NULL,
            ),
        ),
        'securityManager'=>array(
            'cryptAlgorithm' => 'rijndael-256',
            'encryptionKey' => 'pamgmtsalt888',
        ),
    ),

    // application-level parameters that can be accessed
    // using Yii::app()->params['paramName']
    'params'=>array(
        // this is used in contact page
        'adminEmail'=>'ermercado@chikka.com',
        // 'date_display'=>'M j, Y',
        // 'date_log'=>'M j, Y',
        // 'datetime_display'=>'D, M j, Y g:i A',
        // 'datetime_log'=>'M j, Y H:i:s',

        'projects_per_page'=>20,
        'contact_persons_per_page'=>5,
        'point_persons_per_page'=>5,
        'applications_per_page'=>5,
        'app_servers_per_page'=>5,
        'app_main_per_page'=>20,
        'notes_per_page'=>5,
        'users_per_page'=>20,
        'servers_per_page'=>20,

        'graphite_server_ip'=>'10.11.2.29',
        'graphite_server_port_udp'=>2023,
        'graphite_server_port_tcp'=>2003,
        'statsd_server_ip'=>'10.11.2.29',
        'statsd_server_port'=>8125,

        // do not change while a session is active
        'secret_key'=>'pamgmt_secret_key',
        'secret_iv'=>'pamgmt_secret_iv',        //must be 16 bytes
    ),
);