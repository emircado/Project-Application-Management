# Project-Application Management System

This project is a requirement for my internship at Chikka Philippines, Inc. under one of their R&D teams. This is also for the fulfillment of my CS 195 course of the Department of Computer Science of the University of the Philippines, Diliman.

This is a web application for monitoring the company's software projects. Yii and MooTools are the main frameworks used for the creation of this web application.

The system has been modified and disconnected from its LDAP functionality to still be able to browse its features outside its intended environment.

##### Main features
* primarily uses AJAX techniques to display and save content
* connects to and syncs with an LDAP server
* emphasizes use of modals, tables, and pagination

-----------------------

### Requirements

The following must be installed and ran to use the web app:

1. Apache server
2. PHP 5.1.0 or higher
3. MySQL

[WampServer](http://www.wampserver.com/en/) may be used to obtain these components.

### Database Set Up

1. Create a database named `pamgmt`
2. Import the MySQL code from `db_files\testdb.sql` into the database
3. Configure the database settings found in `protected\config\main.php` if necessary

To browse through the app as a user, the following user credentials may be used:
```
username: ermercado
any password is accepted except empty strings
```