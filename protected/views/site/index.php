<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>

<h1>Welcome to <i><?php echo CHtml::encode(Yii::app()->name); ?></i></h1>

<p>Congratulations! You have successfully created your Yii application.</p>

<p>You may change the content of this page by modifying the following two files:</p>
<ul>
	<li>View file: <code><?php echo __FILE__; ?></code></li>
	<li>Layout file: <code><?php echo $this->getLayoutFile('main'); ?></code></li>
</ul>

<p>For more details on how to further develop this application, please read
the <a href="http://www.yiiframework.com/doc/">documentation</a>.
Feel free to ask in the <a href="http://www.yiiframework.com/forum/">forum</a>,
should you have any questions.</p>


<?php

//DISPLAY USERS
// echo spl_object_hash(Yii::app()->session['ldap']);

// echo Yii::app()->session['bind'];

// Yii::app()->ldap->authenticate("ermercado", "chikka12345");


// echo '<br/>test'.Yii::app()->session['ldap']->getAdminUsername().'test<br/>';

// Yii::app()->ldap->setAdminUsername("ermercado");
// Yii::app()->ldap->setAdminPassword("chikka12345");

// Yii::app()->ldap->options['admin_username'] = "ermercado";
// Yii::app()->ldap->options['admin_password'] = "chikka12345";
echo '<pre>';
var_dump(Yii::app()->ldap);
exit();

echo Yii::app()->ldap->options['admin_username'];
echo Yii::app()->ldap->options['admin_password'];



if (($x = Yii::app()->ldap->user()->all(false, "*")) == false) {
	echo 'huhu';
} else {
	foreach ($x as $s){
		echo '<br/>'.$s;
		// foreach ($x[$i]["displayname"] as $key => $s) {
		// 	echo '<br/>'.$key.' '.$s;
		// }

		// foreach ($s as $y => $z) {
		// 	echo '<br/>'.$y.' '.$z;
		// }
	}
}

//DISPLAY USER INFORMATION
// echo Yii::app()->ldap->user()->info("ermercado");
// $x = Yii::app()->ldap->user()->info('ermercado');
// foreach ($x[0] as $s => $b) {
// // foreach ($x[0] as $s) {
// 	// echo '<br/>'.$s[0];
// 	echo '<br/>'.$s.' '.$b;
// }

//DISPLAY GROUPS
// echo '<br/>';

// $a = Yii::app()->ldap->group()->all();
// foreach ($a as $b) {
// 	echo '<br/>'.$b["dn"];

// 	// foreach ($b as $c => $d) {
// 	// 	echo '<br/>'.$c.' '.$d;
// 	// }
// }

//DISPLAY GROUPS INFORMATION
// $x = Yii::app()->ldap->group()->info('RND1');
// foreach ($x[0]["objectcategory"] as $s => $b) {
// // foreach ($x[0] as $s) {
// 	// echo '<br/>'.$s[0];
// 	echo '<br/>'.$s.' '.$b;
// }


//PRIMITIVE LDAP
// $ldap = Yii::app()->params['ldap'];
// $ldapconn = ldap_connect($ldap['host'])
// 	or die("Could not connect to host");

// ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
// ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);

// if ($ldapconn) {
	// $dn = "ermercado@chikka.org";
	// $ldapbind = @ldap_bind($ldapconn, $dn, "chikka12345");
	// $ldapbind = @ldap_bind($ldapconn);

// 	if ($ldapbind) {

// 		$filter = "CN=Emir*";
// 		$justthese = array("OU");

// 		$sr=ldap_search($ldapconn, $ldap['basedn'], $filter, $justthese);
// 		// $sr=ldap_search(Yii::app()->ldap->getLdapConnection(), $ldap['basedn'], $filter);
// 		// $sr=ldap_search(Yii::app()->ldap->getLdapConnection(), $dn, $filter);


// 		$info = ldap_get_entries($ldapconn, $sr);

// 		for ($i=0; $i<$info["count"]; $i++) {
// 			echo "dn is: " . $info[$i]["dn"] . "<br />";
// 		}
// 	} else {
// 		echo '<br/>fail';
// 	}
// } else {
// 	echo '<br/>unable to connect';
// }

?>