-- MySQL dump 10.13  Distrib 5.1.67, for redhat-linux-gnu (x86_64)
--
-- Host: 10.11.7.10    Database: projects
-- ------------------------------------------------------
-- Server version	5.1.61

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application_point_persons`
--

DROP TABLE IF EXISTS `application_point_persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_point_persons` (
  `application_id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `user_group` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `created_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `updated_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`application_id`,`username`),
  UNIQUE KEY `id_username` (`application_id`,`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_point_persons`
--

LOCK TABLES `application_point_persons` WRITE;
/*!40000 ALTER TABLE `application_point_persons` DISABLE KEYS */;
INSERT INTO `application_point_persons` VALUES (1,'brsahagun','DEVELOPERS','adsftest','2014-05-23 20:12:36','2014-06-02 10:49:12','ermercado','ermercado'),(1,'apcadvento','DEVELOPERS','adsfasdffghasdfasdf\nasdf\nasdf\nas\ndf\nasdf','2014-05-23 20:08:05','2014-06-04 11:15:04','ermercado','ermercado'),(11,'apcadvento','DEVELOPERS','asdfo\\\njhd','2014-05-26 18:12:35','2014-05-26 18:21:18','ermercado','ermercado'),(12,'jocamat','DEVELOPERS','<b>test</b>','2014-06-16 14:20:39','0000-00-00 00:00:00','ermercado',NULL);
/*!40000 ALTER TABLE `application_point_persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_servers`
--

DROP TABLE IF EXISTS `application_servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_servers` (
  `application_id` int(11) NOT NULL AUTO_INCREMENT,
  `server_id` int(11) NOT NULL,
  `application_path` tinytext COLLATE utf8_bin,
  `application_log` tinytext COLLATE utf8_bin,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `created_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `updated_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`application_id`,`server_id`),
  KEY `appserversFKservers` (`server_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_servers`
--

LOCK TABLES `application_servers` WRITE;
/*!40000 ALTER TABLE `application_servers` DISABLE KEYS */;
INSERT INTO `application_servers` VALUES (1,29,'a','','2014-05-30 18:13:18','2014-06-02 11:02:02','ermercado','ermercado'),(1,32,'','','2014-06-02 11:36:32','0000-00-00 00:00:00','ermercado',NULL),(1,31,'','','2014-06-02 11:37:00','0000-00-00 00:00:00','ermercado',NULL),(1,30,'','','2014-06-02 13:24:00','0000-00-00 00:00:00','ermercado',NULL),(12,29,'&ltb>test&lt/b>','&ltb>test&lt/b>','2014-06-05 10:25:40','2014-06-16 14:17:40','ermercado','ermercado'),(12,30,'','','2014-06-05 10:41:45','0000-00-00 00:00:00','ermercado',NULL),(1,36,'','','2014-06-11 14:42:06','0000-00-00 00:00:00','ermercado',NULL),(1,37,'','','2014-06-11 14:43:58','0000-00-00 00:00:00','ermercado',NULL);
/*!40000 ALTER TABLE `application_servers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_types`
--

DROP TABLE IF EXISTS `application_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_types` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`type_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_types`
--

LOCK TABLES `application_types` WRITE;
/*!40000 ALTER TABLE `application_types` DISABLE KEYS */;
INSERT INTO `application_types` VALUES (1,'STAT',NULL),(2,'WEB',NULL),(3,'STAT2',NULL),(4,'SAMPL',NULL),(14,'STATS','ermercado'),(15,'S','ermercado'),(16,'ASDASDASD_AD','ermercado');
/*!40000 ALTER TABLE `application_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `applications` (
  `application_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `description` tinytext COLLATE utf8_bin,
  `accessibility` enum('PUBLIC','PRIVATE') COLLATE utf8_bin NOT NULL,
  `repository_url` text COLLATE utf8_bin,
  `uses_mobile_patterns` tinyint(1) DEFAULT '0',
  `instructions` text COLLATE utf8_bin,
  `rd_point_person` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `production_date` date DEFAULT NULL,
  `termination_date` date DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `created_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `updated_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `applicationsFKprojects` (`project_id`),
  KEY `applicationsFKtype` (`type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,102,4,'asdfasdf','asdfasdfxasdfasdfa\nsdf\nas\ndfasdfas\ndf\nasd\nf\nasdf\na\nsdf\na\nsdf\nas\ndf\nadsf','PUBLIC','sdfa',0,'adfasdfasdfasdf\nasdf\nas\ndf\nas\ndfasdf','ccmbello','2324-03-24','4534-04-24','2014-05-13 14:56:50','2014-06-30 19:14:26',NULL,'ermercado'),(3,102,1,'test mobile','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-05-14 10:29:17','2014-06-02 10:42:33',NULL,'ermercado'),(4,102,3,'test with createdby','','PUBLIC','asd',NULL,'','jesia','0000-00-00','0000-00-00','2014-05-14 10:53:01','2014-05-14 11:00:44','ermercado','ermercado'),(5,107,14,'Test App for project 7','','PUBLIC','',NULL,'','pbljoaquin','0000-00-00','0000-00-00','2014-05-14 11:02:35','0000-00-00 00:00:00','ermercado',NULL),(6,107,3,'asdf','','PUBLIC','asd',NULL,'','jesia','0000-00-00','0000-00-00','2014-05-14 11:04:45','0000-00-00 00:00:00','ermercado',NULL),(7,102,4,'test mobile','','PUBLIC','asdf',0,'','','0000-00-00','0000-00-00','2014-05-22 21:17:16','2014-05-30 17:42:02','ermercado','ermercado'),(11,184,15,'etagfadfg','asdfa\nsdf\nas\ndf\nasd\nf','PUBLIC','',1,'asdf\nas\ndfa\nsdf\nas\ndf','','0000-00-00','0000-00-00','2014-05-26 17:28:15','2014-05-30 17:38:43','ermercado','ermercado'),(9,102,15,'asdfs','','PUBLIC','',1,'','','0000-00-00','0000-00-00','2014-05-22 21:52:50','2014-05-22 21:53:18','ermercado','ermercado'),(10,184,15,'asdf','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-05-26 17:27:07','2014-05-30 17:38:33','ermercado','ermercado'),(12,184,16,'s','','PUBLIC','',0,'','','2014-01-21','0000-00-00','2014-06-04 16:48:23','2014-06-19 15:43:24','ermercado','ermercado'),(13,184,15,'atest','','PUBLIC','',0,'','','2014-06-21','2014-06-07','2014-06-10 16:44:40','2014-06-17 19:44:12','ermercado','ermercado'),(14,181,16,'test<b>hey</b>','<b>hey</b>','PRIVATE','<b>hey</b>',0,'<b>hey</b>','jesia','2014-06-17','2014-06-05','2014-06-16 13:57:46','0000-00-00 00:00:00','ermercado',NULL),(15,101,15,'hey','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-06-17 19:16:24','0000-00-00 00:00:00','ermercado',NULL),(16,185,16,'a','adsf','PUBLIC','',1,'','jesia','2014-01-14','0000-00-00','2014-06-17 19:31:28','2014-06-19 15:43:39','ermercado','ermercado'),(17,101,16,'test','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-06-27 10:50:45','0000-00-00 00:00:00','ermercado',NULL),(18,181,16,'test','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-06-27 10:51:01','0000-00-00 00:00:00','ermercado',NULL),(19,181,16,'test','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-06-27 10:51:36','0000-00-00 00:00:00','ermercado',NULL),(20,185,15,'test','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-06-27 10:51:47','0000-00-00 00:00:00','ermercado',NULL),(21,101,1,'test','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-06-27 10:52:02','0000-00-00 00:00:00','ermercado',NULL),(22,102,4,'test','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-06-27 10:52:14','0000-00-00 00:00:00','ermercado',NULL),(23,102,3,'test','','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-06-27 10:52:26','0000-00-00 00:00:00','ermercado',NULL);
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ldap_groups`
--

DROP TABLE IF EXISTS `ldap_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ldap_groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ldap_groups`
--

LOCK TABLES `ldap_groups` WRITE;
/*!40000 ALTER TABLE `ldap_groups` DISABLE KEYS */;
INSERT INTO `ldap_groups` VALUES (21,'DEVELOPERS'),(22,'PDEV'),(23,'PDEV-Tech'),(24,'PDEVTech'),(25,'PDev-SPBO'),(26,'RND1'),(27,'RND2'),(28,'RND3'),(29,'UI'),(30,'UX');
/*!40000 ALTER TABLE `ldap_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ldap_user_groups`
--

DROP TABLE IF EXISTS `ldap_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ldap_user_groups` (
  `username` varchar(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`username`,`group_id`),
  KEY `ldapusergroupsFKgroup` (`group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ldap_user_groups`
--

LOCK TABLES `ldap_user_groups` WRITE;
/*!40000 ALTER TABLE `ldap_user_groups` DISABLE KEYS */;
INSERT INTO `ldap_user_groups` VALUES ('afrdiazzuniga',25),('apagoncillo',25),('apcadvento',21),('apcadvento',26),('bacquizon',21),('bacquizon',28),('brsahagun',21),('brsahagun',29),('bzcinco',21),('bzcinco',28),('cabestioco',21),('cabestioco',26),('caparolma',25),('ccmbello',21),('ccmbello',26),('cnsim',25),('cslimvalencia',21),('cslimvalencia',27),('dcgjuat',21),('dcgjuat',28),('ddmcerrer',25),('dmclee',21),('dmclee',27),('ecmquiros',21),('ecmquiros',26),('egcalso',21),('egcalso',27),('ejdrobles',21),('ejdrobles',26),('fetballes',21),('fetballes',28),('fmparagas',25),('igpjumaoas',21),('igpjumaoas',26),('itmacalincag',21),('itmacalincag',28),('jambasarte',21),('jambasarte',28),('jcpurisima',24),('jesia',21),('jesia',26),('jfcgeronimo',21),('jfcgeronimo',28),('jjrguzman',21),('jjrguzman',27),('jlpua',25),('jmacebuche',21),('jmacebuche',28),('jmcdevera',25),('jocamat',21),('jocamat',28),('ljrogel',24),('marfigueroa',25),('masignacio',21),('masignacio',27),('masreal',21),('masreal',28),('mbchavez',21),('mbchavez',28),('mcttuason',21),('mcttuason',28),('mfmuyco',25),('mibraga',24),('mkmvillanoy',21),('mkmvillanoy',27),('mmdcervantes',21),('mmdcervantes',27),('mpbajen',24),('mrlmarquez',21),('mrlmarquez',26),('nbbrinas',21),('nbbrinas',28),('patchua',21),('patchua',27),('pbljoaquin',21),('pbljoaquin',26),('pegadraneda',21),('pegadraneda',28),('rabelepano',21),('rabelepano',28),('rbrivera',21),('rbrivera',26),('rdsalutan',21),('rdsalutan',28),('rlbaluyut',21),('rlbaluyut',28),('rlcardeno',21),('rlcardeno',28),('rnduldulao',21),('rnduldulao',26),('rsaleyco',21),('rsaleyco',28),('rsflores',25),('sacabigting',21),('sacabigting',28),('sgyao',21),('sgyao',28),('sjgmojica',21),('sjgmojica',28),('vmbtorres',21),('vmbtorres',26),('yadsantos',21),('yadsantos',28),('zjscabatuan',21),('zjscabatuan',28);
/*!40000 ALTER TABLE `ldap_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ldap_users`
--

DROP TABLE IF EXISTS `ldap_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ldap_users` (
  `username` varchar(20) NOT NULL DEFAULT '',
  `name` varchar(50) DEFAULT '',
  PRIMARY KEY (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ldap_users`
--

LOCK TABLES `ldap_users` WRITE;
/*!40000 ALTER TABLE `ldap_users` DISABLE KEYS */;
INSERT INTO `ldap_users` VALUES ('Administrator','Administrator'),('Guest','Guest'),('apmilitante','Andrianito P. Militante Jr'),('arvin.test.account','arvin driz'),('caasilo','Crystal A. Asilo'),('cgperalta','Christian G. Peralta'),('docuwikitest','Docuwiki Testing'),('eeedee','Errol Edric E. Dee'),('fds','fds sync'),('fjjibabao','Florence Joseph J. Ibabao'),('jcguevara','John Christopher Guevara'),('jgscastel','Jaymee Giezelle S. Castel'),('jpdperez','John Paolo D. Perez'),('kinabalu','Kinabalu Admin'),('krbtgt','krbtgt'),('mbmalano','Michael B. Malano'),('mogroup','Melvin Onin Group'),('mrgroup','Melvin Rica Group'),('mzgroup','Melvin Zer Group'),('ngjimenez','Nerissa G. Jimenez'),('rmrvillarica','Rodolfo Manuel R. Villarica'),('sjfpipit','Sarah Jane F. Pipit'),('tdygan','Treaudian D. Ygan'),('tuser56','Test User56'),('vpnauth','vpn auth'),('vtgroup','Victor Twinkle Group'),('wbadmin','websense administrator'),('ajlasuncion','Aaron John L. Asuncion'),('athapal','Abegail T. Hapal'),('abfernando','Ador B. Fernando'),('ajdmagbanua','Adrian Joseph D. Magbanua'),('aruy','Aimee R. Uy'),('agronquillo','Airene G. Ronquillo'),('afrdiazzuniga','Albertine Felicia R. Diaz-Zuñiga'),('apfaylona','Allan P. Faylona'),('avpcruz','Allan Vincent P. Cruz'),('apclark','Andrea P. Clark'),('apagoncillo','Angelica P. Agoncillo'),('amlterencio','Anna Marie L. Terencio'),('arfigueroa','Anna R. Figueroa'),('apmaniquiz','Anthony P. Maniquiz'),('artangunan','Apple R. Tangunan'),('asacleta','Arianne S. Acleta'),('arubatest','Aruba Test'),('acrdriz','Arvin Caesar R. Driz'),('apcadvento','Axel Philip C. Advento'),('baresos','Belen A. Resos'),('bacquizon','Bernard Alpine C. Quizon'),('bzcinco','Bernardo Z. Cinco'),('brsahagun','Brian R. Sahagun'),('cnsim','Cesalyn N. Sim'),('cslimvalencia','Charlie S. Lim Valencia'),('cjabustamante','Chito John A. Bustamante'),('ccmbello','Chris Chesser M. Bello'),('caparolma','Christelle A. Parolma'),('cabestioco','Christian Andrei B. Estioco'),('clbije','Christian L. Bije'),('csaguilar','Christine S. Aguilar'),('cjsbelviz','Christopher Jon S. Belviz'),('ddantonio','Danesa D. Antonio'),('dmjtorrecampo','Danielle Mayca J. Torrecampo'),('dsnunez','Darwin S. Nuñez'),('dmaodsigue','Dave Michael A. Odsigue'),('dcgjuat','Delfin Christian G. Juat'),('dbmendiola','Dennis B. Mendiola'),('drvivas','Dexter R. Vivas'),('dmclee','Diane Marie C. Lee'),('ddmcerrer','Donna Danadel M. Cerrer'),('dasaldua','Dorothy A. Saldua'),('edgauten','Eddel D. Gauten'),('etagcaoili','Edmundo T. Agacaoili'),('ejdrobles','Edward John D. Robles'),('ecmquiros','Eilynn Charm M. Quiros'),('egcalso','Emanuel G. Calso'),('eraduna','Emerson R. Aduna'),('ermercado','Emir R. Mercado'),('fcfaurillo','Fatima D.C. Faurillo'),('fetballes','Fatima Elliz T. Balles'),('fbcalica','Fernando B. Calica'),('finnreadonly','Finn ReadOnly'),('fmparagas','Freddie M. Paragas'),('gppascua','Garry P. Pascua'),('gmlenon','Guilberto M. Lenon'),('hbsunico','Herbert B. Sunico'),('icotisang','Ian Christopher O. Tisang'),('itmacalincag','Irene T. Macalincag'),('igpjumaoas','Iris Gail P. Jumao-as'),('jjrguzman','Jacquiline James R. Guzman'),('jmdavalos','Jadurani M. Davalos'),('jldespanol','James Lawrence D. Español'),('jvbsantos','Jan Vincent B. Santos'),('jveliwanag','Jan Vincent E. Liwanag'),('jesia','Jason E. Sia'),('jocamat','Jaymar O. Camat'),('jbballares','Jayson B. Ballares'),('jacruz','Jeffrey A. Cruz'),('jcpurisima','Jefte C. Purisima'),('jlpua','Jenny L. Pua'),('jfcruz','Jesusa F. Cruz'),('jmacebuche','Jhamie M. Acebuche'),('jdtacadena','Jhesed D. Tacadena'),('jjsbase','Jhonn Jelvin S. Base'),('jrsanchez','Jimbo R. Sanchez'),('jmcdevera','Joann Marie C. de Vera'),('jenbangayan','Job Eliezek N. Bangayan'),('jfcgeronimo','Joel Ferdie C. Geronimo'),('jjcpunzalan','Joerard Jeff C. Punzalan'),('jcdcampomanes','John Christian D. Campomanes'),('jetespinal','John Ernest T. Espinal'),('jlsborillo','John Lester S. Borillo'),('jpmabaca','Jonathan Paul M. Abaca'),('jrbarevalo','Joseph Richard B. Arevalo'),('jambasarte','Joshua Andre M. Basarte'),('jplsanpablo','Juan Paolo L. San Pablo'),('jdpascua','Jurly D. Pascua'),('janortiz','Justine Amanda N. Ortiz'),('kmsese','Karen M. Sese'),('kpmsese','Karen Patricia M. Sese'),('karensese','Karen Sese'),('katchan','Karin Alody T. Chan'),('kmmagtibay','Katherine M. Magtibay'),('kvmenancio','Katrina V. Menancio'),('kamtenorio','Kenneth Alvin M. Tenorio'),('kvacujedo','Kerby V. Acujedo'),('ldapadmin','LDAP ADMIN'),('ljrogel','Laurice J. Rogel'),('loprudente','Luke O. Prudente'),('mccsobrepena','Ma. Caryssa C. Sobrepeña'),('mcttuason','Ma. Corazon T. Tuason'),('mmdcervantes','Ma. Margarita D. Cervantes'),('mpgabuya','Maico P. Gabuya'),('mibraga','Manilyn I. Braga'),('masignacio','Manuel Antonio S. Ignacio'),('marfigueroa','Maria Anna R. Figueroa'),('mrtaustin','Maria Ria T. Austin'),('mamdelacruz','Marie Angela M. dela Cruz'),('masdee','Mariel Alexis S. Dee'),('mfmuyco','Mario F. Muyco'),('mzsabino','Mark Z. Sabino'),('mllduran','Martin Lloyd L. Duran'),('mpbajen','Marvin P. Bajen'),('masreal','Mary Antoniette S. Real'),('mrgiaquino','Mary Ranz Gellie I. Aquino'),('mrlmarquez','Melissa Rhona L. Marquez'),('mfbaclig','Melvin F. Baclig'),('macfavila','Mia Angelica C. Favila'),('mmbvillanueva','Michelle Melitta B. Villanueva'),('mbchavez','Micoboy B. Chavez'),('magdeocampo','Miguel Antonio G. de Ocampo'),('mlgcabuloy','Mitchel Laurent G. Cabuloy'),('mkmvillanoy','Monica Kathrina M. Villanoy'),('ncemsantos','Nicanor Carlo Emmanuel M. Santos'),('nbbrinas','Niño B. Briñas'),('netmercene','Noah Evan T. Mercene'),('pcvtan','Patricia Carmela V. Tan'),('pbljoaquin','Patrick Bernard L. Joaquin'),('pggcagalawan','Patrick Gil G. Cagalawan'),('pegadraneda','Paul Eliczar G. Adraneda'),('ppcprantilla','Paul Patrick C. Prantilla'),('patchua','Pearlie Anne T. Chua'),('rtadmin','RT ADMIN'),('rtnoc','RT NOC'),('rtuser','RT USER'),('rlcardeno','Rafael L. Cardeño'),('rdtorres','Ray D. Torres'),('rcnunez','Raymond C. Nuñez'),('rabelepano','Rey Angelo B. Elepaño'),('rmbergola','Rhommel M. Bergola'),('rsaleyco','Rica Suzette A. Leyco'),('ricliclican','Richmond Ivann C. Liclican'),('rdsalutan','Ringo D. Salutan'),('rsflores','Rochelle S. Flores'),('rnduldulao','Rodolfo N. Duldulao'),('rrtolentino','Roel R. Tolentino'),('rarbenzon','Rolan Alen R. Benzon'),('rcunisa','Rosalie C. Unisa'),('rlbaluyut','Roshel L. Baluyut'),('rnaustria','Rosita N. Austria'),('rbrivera','Rufino B. Rivera'),('rpdgozum','Ryan Paul D. Gozum'),('sbbismonte','Sami B. Bismonte'),('smperalta','Sammuel M. Peralta'),('sjgmojica','Sarah Jane G. Mojica'),('sjpbarnes','Sarah Jane P. Barnes'),('sacabigting','Shenlene A. Cabigting'),('sfpidlaoan','Sherila F. Pidlaoan'),('sgyao','Shervin G. Yao'),('adquerier','Stash Querier'),('satpadiernos','Stephanie Anne T. Padiernos'),('srcprado','Suzane Rose C. Prado'),('techsupport','Technical Support'),('tmcddulla','Theresa Maria Camelle D. Dulla'),('tmresguerra','Tricia Mae R. Esguerra'),('tadelacruz','Trixia A. dela Cruz'),('vvbconoza','Vanessa Viel B. Conoza'),('vmbtorres','Victor Manuel B. Torres'),('vrhubert','Vince R. Hubert'),('vbagudelo','Vincent B. Agudelo'),('wbdmanalo','Wendel Brian D. Manalo'),('wyguila','Wilfredo Y. Guila'),('yadsantos','Yuri Angelo D. Santos'),('zjscabatuan','Zer Jason S. Cabatuan'),('zrdevera','Zurab R. de Vera'),('aruba_wifi','aruba wireless'),('arvin.driz.test','arvin driz test'),('pogiako','pogiako'),('test','test test'),('testlangito','testlangito');
/*!40000 ALTER TABLE `ldap_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_contact_persons`
--

DROP TABLE IF EXISTS `project_contact_persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_contact_persons` (
  `project_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `company` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `position` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `contact_numbers` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `address` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `created_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `updated_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`project_id`,`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_contact_persons`
--

LOCK TABLES `project_contact_persons` WRITE;
/*!40000 ALTER TABLE `project_contact_persons` DISABLE KEYS */;
INSERT INTO `project_contact_persons` VALUES (102,'Sample Contact person','','adf','','email@text.com','','','2014-05-06 09:20:40','2014-05-06 14:12:05',NULL,NULL),(120,'test','','','te','test@akls.com','','','2014-04-29 12:54:01','0000-00-00 00:00:00',NULL,NULL),(101,'adsasdf','','','','ret@ret.ret','','','2014-05-06 14:41:02','0000-00-00 00:00:00',NULL,NULL),(101,'Test','SDF','SDF','34543asdfasdf','sumthin@test.com','fSDf','SDf','2014-04-29 11:16:25','2014-04-29 18:07:26',NULL,NULL),(101,'emir','','','s','emir_mercado2000@yahoo.com','','asdfadf\nsdf\nasdf\ndf','2014-05-02 18:41:48','2014-05-06 15:34:45',NULL,NULL),(106,'rqw','','','','erqwer@asdf.com','','','2014-05-05 18:43:20','0000-00-00 00:00:00',NULL,NULL),(102,'teaset','asdfasdf','asdfasd','asdfa','fasdfadf@email.com','sdfadsfa','sdf','2014-05-26 14:36:24','0000-00-00 00:00:00',NULL,NULL),(101,'A Very Long name','A very long company name','a very long position nameasdfasdf','09890','averylongemail@email.com.ph','90890asdf\nas\ndf\nadsf\nasdf','90890','2014-05-05 15:59:56','2014-05-30 17:20:44',NULL,'ermercado'),(101,'aaaa','','','','aaa@aa.aa','','','2014-05-06 14:41:11','0000-00-00 00:00:00',NULL,NULL),(101,'hey','asdf','test','','test@test.tst','','','2014-04-29 11:14:30','2014-04-29 13:52:56',NULL,NULL),(102,'asdadsf','adf','asdfaz','fasdfasdf','sdfad@asdf.com','asdf','adsf','2014-05-26 14:44:18','2014-05-26 15:22:20',NULL,'ermercado'),(102,'qwer','qwer','qwer','','qwer@upd.edu.ph','qwer\nqwer\nqwer','QWER\nQWER','2014-05-26 14:51:15','0000-00-00 00:00:00',NULL,NULL),(102,'zzzzzzzt','','','','zzz@zzz.com','','','2014-05-26 14:51:29','0000-00-00 00:00:00',NULL,NULL),(184,'a','b','c','e','d@email.com','f','g','2014-05-30 17:39:10','0000-00-00 00:00:00','ermercado',NULL),(181,'test','test','','','test@email.com','','','2014-06-05 10:26:16','2014-06-05 10:26:30','ermercado','ermercado'),(181,'test','','','','hey@hey.com','','','2014-06-11 14:14:43','0000-00-00 00:00:00','ermercado',NULL),(181,'a<div> test</div>','','','','a@b.com','Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut &ltb>asdf&lt/b>','Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut &ltb>asdf&lt/b>','2014-06-11 14:15:12','2014-06-11 14:22:32','ermercado','ermercado'),(181,'long','','','','long@long.lon','Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut <b>asdf</b> ali','Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut <b>asdf</b> ali','2014-06-11 14:18:02','0000-00-00 00:00:00','ermercado',NULL);
/*!40000 ALTER TABLE `project_contact_persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_notes`
--

DROP TABLE IF EXISTS `project_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_notes` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `application_id` int(11) DEFAULT NULL,
  `notes` text COLLATE utf8_bin,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `created_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `updated_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`note_id`),
  KEY `notesFKproject` (`project_id`),
  KEY `notesFKapplication` (`application_id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_notes`
--

LOCK TABLES `project_notes` WRITE;
/*!40000 ALTER TABLE `project_notes` DISABLE KEYS */;
INSERT INTO `project_notes` VALUES (1,102,NULL,'testasdfasdfaasd\nsdf\nsdf','2014-05-23 17:46:24','2014-05-23 17:57:05','ermercado','ermercado'),(3,102,NULL,'test','2014-05-23 18:27:45','0000-00-00 00:00:00','ermercado',NULL),(4,102,1,'test4','2014-05-23 18:39:10','2014-06-09 13:41:50','ermercado','ermercado'),(5,102,NULL,'tst','2014-05-23 18:39:32','0000-00-00 00:00:00','ermercado',NULL),(19,184,NULL,'test3','2014-06-06 18:12:04','2014-06-09 13:33:13','ermercado','ermercado'),(18,181,NULL,'asdf','2014-06-06 17:05:03','0000-00-00 00:00:00','ermercado',NULL),(8,184,11,'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.','2014-05-26 18:34:15','2014-06-05 17:01:29','ermercado','ermercado'),(9,184,NULL,'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.','2014-05-29 17:00:07','2014-06-05 17:00:22','loprudente','loprudente'),(10,181,NULL,'Short note.','2014-06-02 14:52:16','2014-06-05 16:52:39','ermercado','ermercado'),(11,181,NULL,'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.','2014-06-05 16:30:46','2014-06-05 16:52:20','ermercado','ermercado'),(23,102,4,'564h','2014-06-09 11:24:36','2014-06-17 15:17:46','ermercado','ermercado'),(21,184,NULL,'test2','2014-06-06 18:12:11','2014-06-09 13:33:09','ermercado','ermercado'),(22,184,NULL,'test','2014-06-06 18:12:14','2014-06-09 13:33:05','ermercado','ermercado'),(24,184,10,'test4','2014-06-09 12:33:22','2014-06-09 13:33:40','ermercado','ermercado'),(25,184,10,'test3','2014-06-09 12:33:25','2014-06-09 13:33:35','ermercado','ermercado'),(26,184,10,'test2','2014-06-09 12:33:28','2014-06-09 13:33:31','ermercado','ermercado'),(27,184,10,'test1','2014-06-09 13:22:05','2014-06-09 13:33:27','ermercado','ermercado'),(30,181,NULL,'<b>hello</b>ssa','2014-06-11 11:38:59','2014-06-11 13:52:52','ermercado','ermercado'),(31,181,NULL,'<script> console.log(\'hello\'); </script>s','2014-06-11 13:53:15','2014-06-11 13:53:21','ermercado','ermercado'),(32,181,12,'<b>test</b>','2014-06-16 14:21:01','2014-06-16 14:21:53','ermercado','ermercado'),(33,181,14,'test','2014-06-23 15:43:37','0000-00-00 00:00:00','ermercado',NULL),(34,102,1,'test test','2014-06-27 20:15:24','2014-06-27 20:15:37','pegadraneda','pegadraneda'),(35,184,11,'astase','2014-06-27 20:20:12','0000-00-00 00:00:00','ermercado',NULL);
/*!40000 ALTER TABLE `project_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_point_persons`
--

DROP TABLE IF EXISTS `project_point_persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_point_persons` (
  `project_id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `user_group` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `updated_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `created_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`project_id`,`username`),
  UNIQUE KEY `id_username` (`project_id`,`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_point_persons`
--

LOCK TABLES `project_point_persons` WRITE;
/*!40000 ALTER TABLE `project_point_persons` DISABLE KEYS */;
INSERT INTO `project_point_persons` VALUES (106,'ecmquiros','RND1','sdf','2014-05-05 18:38:35','0000-00-00 00:00:00',NULL,NULL),(102,'igpjumaoas','RND1','ds','2014-04-30 13:34:11','2014-05-22 13:55:32',NULL,NULL),(101,'ecmquiros','DEVELOPERS','','2014-05-02 18:29:19','0000-00-00 00:00:00',NULL,NULL),(101,'bacquizon','DEVELOPERS','asdf','2014-05-06 15:17:47','2014-05-06 15:17:53',NULL,NULL),(101,'apcadvento','DEVELOPERS','gf','2014-05-06 15:05:53','0000-00-00 00:00:00',NULL,NULL),(101,'igpjumaoas','DEVELOPERS','','2014-04-30 13:37:13','0000-00-00 00:00:00',NULL,NULL),(101,'jesia','RND1','','2014-05-06 15:21:55','0000-00-00 00:00:00',NULL,NULL),(102,'apcadvento','DEVELOPERS','asdfadsfsdfgsdf\ng\nsdfgsdf\ng\ndsfg','2014-05-26 15:56:54','2014-06-04 11:18:55','ermercado',NULL),(102,'bacquizon','DEVELOPERS','adsfasd\nfa\ndsf\na\ndsf','2014-05-26 16:20:45','2014-05-26 16:20:51','ermercado','ermercado'),(184,'apcadvento','DEVELOPERS','','2014-05-30 17:27:00','0000-00-00 00:00:00',NULL,'ermercado'),(181,'jjrguzman','DEVELOPERS','test','2014-06-05 10:26:37','2014-06-05 10:26:43','ermercado','ermercado'),(184,'afrdiazzuniga','PDev-SPBO','<b>test</b>s','2014-06-11 16:56:53','2014-06-11 16:57:33','ermercado','ermercado'),(184,'ccmbello','RND1','<i>hi</i>','2014-06-11 16:57:58','0000-00-00 00:00:00',NULL,'ermercado');
/*!40000 ALTER TABLE `project_point_persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `code` varchar(10) COLLATE utf8_bin NOT NULL,
  `description` tinytext COLLATE utf8_bin,
  `status` enum('ACTIVE','TERMINATED') COLLATE utf8_bin NOT NULL,
  `production_date` date DEFAULT NULL,
  `termination_date` date DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `created_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `updated_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=MyISAM AUTO_INCREMENT=190 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (102,'Sample Project 02','PRO02','Description for project02test','ACTIVE','2014-06-12','0000-00-00','0000-00-00 00:00:00','2014-06-10 14:02:04',NULL,'ermercado'),(103,'Sample Project 03','PRO03','Description for project03asdf\nasdf\nasdf\nasdfasdf\nkjhkhjk\nkjklk;','ACTIVE','0000-00-00','0000-00-00','0000-00-00 00:00:00','2014-06-10 15:20:26',NULL,'ermercado'),(104,'Sample Project 04','PRO04','Description for project04','ACTIVE','2014-11-01','0000-00-00','0000-00-00 00:00:00','2014-04-25 14:15:11',NULL,NULL),(105,'Sample Project 05','PRO05','Description for project05','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','2014-05-06 15:52:40',NULL,'loprudente'),(106,'Sample Project 06','PRO06','Description for project06','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(107,'Sample Project 07','PRO07','Description for project07','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(108,'Sample Project 08','PRO08','Description for project08','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','2014-05-06 15:28:34',NULL,'ermercado'),(109,'Sample Project 09','PRO09','Description for project09','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(110,'Sample Project 10','PRO10','Description for project10','ACTIVE','2014-11-01','0000-00-00','0000-00-00 00:00:00','2014-04-25 14:13:35',NULL,NULL),(111,'Sample Project 11','PRO11','Description for project11','ACTIVE','2014-11-01','0000-00-00','0000-00-00 00:00:00','2014-04-25 15:14:34',NULL,NULL),(112,'Sample Project 12','PRO12','Description for project12','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(113,'Sample Project 13','PRO13','Description for project13','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','2014-05-29 13:36:44',NULL,'loprudente'),(114,'Sample Project 14','PRO14','Description for project14','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(115,'Sample Project 15','PRO15','Description for project15','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(116,'Sample Project 16','PRO16','Description for project16','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(117,'Sample Project 17','PRO17','Description for project17','ACTIVE','2014-11-01','0000-00-00','0000-00-00 00:00:00','2014-04-25 14:30:08',NULL,NULL),(118,'Sample Project 18','PRO18','Description for project18','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','2014-04-24 11:50:42',NULL,NULL),(119,'Sample Project 19','PRO19','Description for project19','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(120,'Sample Project 20','PRO20','Description for project20','ACTIVE','2014-11-01','0000-00-00','0000-00-00 00:00:00','2014-05-06 15:54:51',NULL,'ermercado'),(121,'Sample Project 21','PRO21','Description for project21','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(122,'Sample Project 22','PRO22','Description for project22','ACTIVE','2014-11-01','0000-00-00','0000-00-00 00:00:00','2014-04-25 14:11:10',NULL,NULL),(123,'Sample Project 23','PRO23','Description for project23','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(124,'Sample Project 24','PRO24','Description for project24','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(125,'Sample Project 25','PRO25','Description for project25','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(126,'Sample Project 26','PRO26','Description for project26','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(127,'Sample Project 27','PRO27','Description for project27','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','2014-04-23 15:06:42',NULL,NULL),(128,'Sample Project 28','PRO28','Description for project28','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(129,'Sample Project 29','PRO29','Description for project29','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(130,'Sample Project 30','PRO30','Description for project30','ACTIVE','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(131,'Sample Project 71','PRO71','Description for project71','TERMINATED','2014-11-01','2014-06-11','0000-00-00 00:00:00','2014-06-11 14:48:55',NULL,'ermercado'),(132,'Sample Project 72','PRO72','Description for project72','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(133,'Sample Project 73','PRO73','Description for project73','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(134,'Sample Project 74','PRO74','Description for project74','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(135,'Sample Project 75','PRO75','Description for project75','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(136,'Sample Project 76','PRO76','Description for project76','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(137,'Sample Project 77','PRO77','Description for project77','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(138,'Sample Project 78','PRO78','Description for project78','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(139,'Sample Project 79','PRO79','Description for project79','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(140,'Sample Project 80','PRO80','Description for project80','TERMINATED','2014-11-01','2014-11-02','0000-00-00 00:00:00','2014-04-24 16:00:00',NULL,NULL),(181,'adfassv','DSSSS','Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut <b>asdf</b> ali','ACTIVE','2014-06-07','0000-00-00','2014-05-05 18:59:38','2014-06-16 13:37:49','ermercado','ermercado'),(177,'Sample test with createdby','TESTC','alskdfad','ACTIVE','2333-03-24','0000-00-00','2014-05-05 16:49:22','0000-00-00 00:00:00','ermercado',NULL),(183,'Test with createdby','CREAT','meheheasdfsdfasdf','ACTIVE','0000-00-00','0000-00-00','2014-05-06 12:22:44','2014-05-06 13:52:47','ermercado','ermercado'),(184,'as','AKLDF','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaakjlasdfasasdasdfklasdfd faf \nasdf \na df\nasdf as dfasd f\nas df\nasd f\nas\n dfas dfa sdfasdfasdkjhas haksa sdfas \nfa\nsd f\na\ns dfas dfasdfasdfasdfasd fasd fasdfasd\nfa\nsdf \nasd\n fa\n sdfas df\nasdfas\ndfa\ns','ACTIVE','2013-06-20','0000-00-00','2014-05-06 13:53:24','2014-06-11 13:19:33','ermercado','ermercado'),(185,'Luke\'s Project','LUKEP','alkdf','ACTIVE','2014-06-12','0000-00-00','2014-05-06 15:50:24','2014-06-10 14:02:33','loprudente','ermercado'),(101,'Sample Project 01','PRO01','Description for project01','ACTIVE','2014-11-13','0000-00-00','0000-00-00 00:00:00','2014-06-10 15:14:58','ermercado','ermercado'),(189,'s','SSSSS','','ACTIVE','0000-00-00','0000-00-00','2014-06-02 10:01:21','0000-00-00 00:00:00','ermercado',NULL);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servers`
--

DROP TABLE IF EXISTS `servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servers` (
  `server_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `server_type` enum('PRODUCTION','DEVELOPMENT','STAGING') COLLATE utf8_bin NOT NULL,
  `hostname` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `public_ip` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `private_ip` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `network` varchar(50) COLLATE utf8_bin NOT NULL,
  `location` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `description` tinytext COLLATE utf8_bin,
  `production_date` date DEFAULT NULL,
  `termination_date` date DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `created_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `updated_by` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`server_id`),
  UNIQUE KEY `public_ip` (`public_ip`),
  UNIQUE KEY `public_ip_2` (`public_ip`),
  UNIQUE KEY `private_ip` (`private_ip`,`network`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servers`
--

LOCK TABLES `servers` WRITE;
/*!40000 ALTER TABLE `servers` DISABLE KEYS */;
INSERT INTO `servers` VALUES (29,'test new','PRODUCTION',NULL,'255.255.255.255','255.255.255.255','network 1',NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(30,'test new','PRODUCTION',NULL,'255.255.255.254','255.255.255.255','network 2',NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(31,'test new','PRODUCTION',NULL,NULL,'255.255.255.255','network 3',NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(32,'test new','PRODUCTION',NULL,NULL,'255.255.255.255','network 4',NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(33,'test new','PRODUCTION',NULL,NULL,'255.255.255.254','network 5',NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(34,'test new','PRODUCTION',NULL,NULL,NULL,'network 1',NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(35,'test new','PRODUCTION',NULL,NULL,NULL,'network 1',NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,NULL),(36,'res','DEVELOPMENT','','','255.255.255.253','network 1','','','0000-00-00','0000-00-00','2014-06-11 14:41:56','0000-00-00 00:00:00','ermercado',NULL),(37,'server','PRODUCTION','','255.255.255.253','255.255.255.252','network 2','','','0000-00-00','0000-00-00','2014-06-11 14:43:33','0000-00-00 00:00:00','ermercado',NULL);
/*!40000 ALTER TABLE `servers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-07-01 13:21:35
