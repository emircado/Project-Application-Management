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
-- Table structure for table `YiiSession`
--

DROP TABLE IF EXISTS `YiiSession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `YiiSession` (
  `id` char(32) NOT NULL,
  `expire` int(11) DEFAULT NULL,
  `data` longblob,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `YiiSession`
--

LOCK TABLES `YiiSession` WRITE;
/*!40000 ALTER TABLE `YiiSession` DISABLE KEYS */;
INSERT INTO `YiiSession` VALUES ('0253spdpcgf4sdfjkb069q5ah3',1405694398,'2a97d1e3c725ae4be37f4695a4735f72__returnUrl|s:20:\"/pamgmt/applications\";2a97d1e3c725ae4be37f4695a4735f72__id|s:9:\"ermercado\";2a97d1e3c725ae4be37f4695a4735f72__name|s:9:\"ermercado\";2a97d1e3c725ae4be37f4695a4735f72__states|a:0:{}username|s:32:\"eVlwaG10d01YRUVuZzhWb2VTa3JtZz09\";password|s:32:\"dUZ0YkZDY3gwSHlKU2RGNnNLUnpRUT09\";');
/*!40000 ALTER TABLE `YiiSession` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `application_point_persons` VALUES (30,'mbchavez','DEVELOPERS','','2014-07-14 15:00:58','0000-00-00 00:00:00','ermercado',NULL),(30,'yadsantos','DEVELOPERS','','2014-07-14 15:01:06','0000-00-00 00:00:00','ermercado',NULL),(30,'pegadraneda','DEVELOPERS','','2014-07-14 15:01:15','0000-00-00 00:00:00','ermercado',NULL),(30,'ermercado','R&D','','2014-07-17 11:05:39','0000-00-00 00:00:00','ermercado',NULL),(31,'ermercado','R&D','','2014-07-17 16:34:18','0000-00-00 00:00:00','ermercado',NULL);
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
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_servers`
--

LOCK TABLES `application_servers` WRITE;
/*!40000 ALTER TABLE `application_servers` DISABLE KEYS */;
INSERT INTO `application_servers` VALUES (30,44,'/home/httpd/vhosts/pamgmt','/var/log/pamgmt.log','2014-07-14 15:00:28','0000-00-00 00:00:00','ermercado',NULL),(31,44,'/home/httpd/vhosts/pamgmt-scripts','','2014-07-14 15:45:58','0000-00-00 00:00:00','ermercado',NULL);
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
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_types`
--

LOCK TABLES `application_types` WRITE;
/*!40000 ALTER TABLE `application_types` DISABLE KEYS */;
INSERT INTO `application_types` VALUES (21,'SAMPLE','ermercado');
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
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (30,191,21,'PA Management - Web App','','PUBLIC','http://10.11.8.1:7990/projects/CSPAM/repos/web/browse',0,'','','0000-00-00','0000-00-00','2014-07-10 14:41:37','2014-07-14 15:07:43','ermercado','ermercado'),(31,191,21,'PA Managment - Scripts','Contains the scripts used for Graphite and for importing server data to the database.\n\nAlso contains db dump files.','PUBLIC','',0,'','','0000-00-00','0000-00-00','2014-07-14 15:25:14','2014-07-14 15:46:29','ermercado','ermercado');
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
) ENGINE=MyISAM AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ldap_groups`
--

LOCK TABLES `ldap_groups` WRITE;
/*!40000 ALTER TABLE `ldap_groups` DISABLE KEYS */;
INSERT INTO `ldap_groups` VALUES (41,'DEVELOPERS'),(42,'PDEV'),(43,'PDEV-Tech'),(44,'PDEVTech'),(45,'PDev-SPBO'),(46,'RND1'),(47,'RND2'),(48,'RND3'),(49,'UI'),(50,'UX'),(51,'Business Development'),(52,'Product Development'),(53,'R&D');
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
INSERT INTO `ldap_user_groups` VALUES ('afrdiazzuniga',35),('afrdiazzuniga',45),('apagoncillo',35),('apagoncillo',45),('apcadvento',31),('apcadvento',36),('apcadvento',41),('apcadvento',46),('bacquizon',31),('bacquizon',38),('bacquizon',41),('bacquizon',48),('brsahagun',31),('brsahagun',39),('brsahagun',41),('brsahagun',49),('bzcinco',31),('bzcinco',38),('bzcinco',41),('bzcinco',48),('cabestioco',31),('cabestioco',36),('cabestioco',41),('cabestioco',46),('caparolma',35),('caparolma',45),('caparolma',52),('ccmbello',31),('ccmbello',36),('ccmbello',41),('ccmbello',46),('cnsim',35),('cnsim',45),('cslimvalencia',31),('cslimvalencia',37),('cslimvalencia',41),('cslimvalencia',47),('dcgjuat',31),('dcgjuat',38),('dcgjuat',41),('dcgjuat',48),('ddmcerrer',35),('ddmcerrer',45),('dmclee',31),('dmclee',37),('dmclee',41),('dmclee',47),('dsnunez',53),('ecmquiros',31),('ecmquiros',36),('ecmquiros',41),('ecmquiros',46),('egcalso',31),('egcalso',37),('egcalso',41),('egcalso',47),('ejdrobles',31),('ejdrobles',36),('ejdrobles',41),('ejdrobles',46),('ermercado',53),('fetballes',31),('fetballes',38),('fetballes',41),('fetballes',48),('fmparagas',35),('fmparagas',45),('igpjumaoas',31),('igpjumaoas',36),('igpjumaoas',41),('igpjumaoas',46),('itmacalincag',31),('itmacalincag',38),('itmacalincag',41),('itmacalincag',48),('jambasarte',31),('jambasarte',38),('jambasarte',41),('jambasarte',48),('jcpurisima',34),('jcpurisima',44),('jesia',31),('jesia',36),('jesia',41),('jesia',46),('jfcgeronimo',31),('jfcgeronimo',38),('jfcgeronimo',41),('jfcgeronimo',48),('jjrguzman',31),('jjrguzman',37),('jjrguzman',41),('jjrguzman',47),('jlpua',35),('jlpua',45),('jmacebuche',31),('jmacebuche',38),('jmacebuche',41),('jmacebuche',48),('jmcdevera',35),('jmcdevera',45),('jocamat',31),('jocamat',38),('jocamat',41),('jocamat',48),('jocamat',53),('jomai',51),('kpsese',51),('ljrogel',34),('ljrogel',44),('loprudente',53),('marfigueroa',35),('marfigueroa',45),('masignacio',31),('masignacio',37),('masignacio',41),('masignacio',47),('masreal',31),('masreal',38),('masreal',41),('masreal',48),('mbchavez',31),('mbchavez',38),('mbchavez',41),('mbchavez',48),('mbchavez',53),('mcttuason',31),('mcttuason',38),('mcttuason',41),('mcttuason',48),('mfmuyco',35),('mfmuyco',45),('mibraga',34),('mibraga',44),('mkmvillanoy',31),('mkmvillanoy',37),('mkmvillanoy',41),('mkmvillanoy',47),('mllduran',53),('mmdcervantes',31),('mmdcervantes',37),('mmdcervantes',41),('mmdcervantes',47),('mpbajen',34),('mpbajen',44),('mrlmarquez',31),('mrlmarquez',36),('mrlmarquez',41),('mrlmarquez',46),('mzsabino',52),('nbbrinas',31),('nbbrinas',38),('nbbrinas',41),('nbbrinas',48),('patchua',31),('patchua',37),('patchua',41),('patchua',47),('pbljoaquin',31),('pbljoaquin',36),('pbljoaquin',41),('pbljoaquin',46),('pegadraneda',31),('pegadraneda',38),('pegadraneda',41),('pegadraneda',48),('pegadraneda',53),('rabelepano',31),('rabelepano',38),('rabelepano',41),('rabelepano',48),('rbrivera',31),('rbrivera',36),('rbrivera',41),('rbrivera',46),('rdsalutan',31),('rdsalutan',38),('rdsalutan',41),('rdsalutan',48),('rlbaluyut',31),('rlbaluyut',38),('rlbaluyut',41),('rlbaluyut',48),('rlcardeno',31),('rlcardeno',38),('rlcardeno',41),('rlcardeno',48),('rnduldulao',31),('rnduldulao',36),('rnduldulao',41),('rnduldulao',46),('rsaleyco',31),('rsaleyco',38),('rsaleyco',41),('rsaleyco',48),('rsflores',35),('rsflores',45),('sacabigting',31),('sacabigting',38),('sacabigting',41),('sacabigting',48),('sgyao',31),('sgyao',38),('sgyao',41),('sgyao',48),('sjgmojica',31),('sjgmojica',38),('sjgmojica',41),('sjgmojica',48),('vmbtorres',31),('vmbtorres',36),('vmbtorres',41),('vmbtorres',46),('yadsantos',31),('yadsantos',38),('yadsantos',41),('yadsantos',48),('ysantos',53),('zcabatuan',53),('zjscabatuan',31),('zjscabatuan',38),('zjscabatuan',41),('zjscabatuan',48);
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
INSERT INTO `ldap_users` VALUES ('Administrator','Administrator'),('Guest','Guest'),('apmilitante','Andrianito P. Militante Jr'),('arvin.test.account','arvin driz'),('caasilo','Crystal A. Asilo'),('cgperalta','Christian G. Peralta'),('docuwikitest','Docuwiki Testing'),('eeedee','Errol Edric E. Dee'),('fds','fds sync'),('fjjibabao','Florence Joseph J. Ibabao'),('jcguevara','John Christopher Guevara'),('jgscastel','Jaymee Giezelle S. Castel'),('jpdperez','John Paolo D. Perez'),('kinabalu','Kinabalu Admin'),('krbtgt','krbtgt'),('mbmalano','Michael B. Malano'),('mogroup','Melvin Onin Group'),('mrgroup','Melvin Rica Group'),('mzgroup','Melvin Zer Group'),('ngjimenez','Nerissa G. Jimenez'),('rmrvillarica','Rodolfo Manuel R. Villarica'),('sjfpipit','Sarah Jane F. Pipit'),('tdygan','Treaudian D. Ygan'),('tuser56','Test User56'),('vpnauth','vpn auth'),('vtgroup','Victor Twinkle Group'),('wbadmin','websense administrator'),('ajlasuncion','Aaron John L. Asuncion'),('athapal','Abegail T. Hapal'),('abfernando','Ador B. Fernando'),('ajdmagbanua','Adrian Joseph D. Magbanua'),('aruy','Aimee R. Uy'),('agronquillo','Airene G. Ronquillo'),('afrdiazzuniga','Albertine Felicia R. Diaz-Zuñiga'),('apfaylona','Allan P. Faylona'),('avpcruz','Allan Vincent P. Cruz'),('apclark','Andrea P. Clark'),('apagoncillo','Angelica P. Agoncillo'),('amlterencio','Anna Marie L. Terencio'),('arfigueroa','Anna R. Figueroa'),('apmaniquiz','Anthony P. Maniquiz'),('artangunan','Apple R. Tangunan'),('asacleta','Arianne S. Acleta'),('arubatest','Aruba Test'),('acrdriz','Arvin Caesar R. Driz'),('apcadvento','Axel Philip C. Advento'),('baresos','Belen A. Resos'),('bacquizon','Bernard Alpine C. Quizon'),('bzcinco','Bernardo Z. Cinco'),('brsahagun','Brian R. Sahagun'),('cnsim','Cesalyn N. Sim'),('cslimvalencia','Charlie S. Lim Valencia'),('cjabustamante','Chito John A. Bustamante'),('ccmbello','Chris Chesser M. Bello'),('caparolma','Christelle A. Parolma'),('cabestioco','Christian Andrei B. Estioco'),('clbije','Christian L. Bije'),('csaguilar','Christine S. Aguilar'),('cjsbelviz','Christopher Jon S. Belviz'),('ddantonio','Danesa D. Antonio'),('dmjtorrecampo','Danielle Mayca J. Torrecampo'),('dsnunez','Darwin S. Nunez'),('dmaodsigue','Dave Michael A. Odsigue'),('dcgjuat','Delfin Christian G. Juat'),('dbmendiola','Dennis B. Mendiola'),('drvivas','Dexter R. Vivas'),('dmclee','Diane Marie C. Lee'),('ddmcerrer','Donna Danadel M. Cerrer'),('dasaldua','Dorothy A. Saldua'),('edgauten','Eddel D. Gauten'),('etagcaoili','Edmundo T. Agacaoili'),('ejdrobles','Edward John D. Robles'),('ecmquiros','Eilynn Charm M. Quiros'),('egcalso','Emanuel G. Calso'),('eraduna','Emerson R. Aduna'),('ermercado','Emir R. Mercado'),('fcfaurillo','Fatima D.C. Faurillo'),('fetballes','Fatima Elliz T. Balles'),('fbcalica','Fernando B. Calica'),('finnreadonly','Finn ReadOnly'),('fmparagas','Freddie M. Paragas'),('gppascua','Garry P. Pascua'),('gmlenon','Guilberto M. Lenon'),('hbsunico','Herbert B. Sunico'),('icotisang','Ian Christopher O. Tisang'),('itmacalincag','Irene T. Macalincag'),('igpjumaoas','Iris Gail P. Jumao-as'),('jjrguzman','Jacquiline James R. Guzman'),('jmdavalos','Jadurani M. Davalos'),('jldespanol','James Lawrence D. Español'),('jvbsantos','Jan Vincent B. Santos'),('jveliwanag','Jan Vincent E. Liwanag'),('jesia','Jason E. Sia'),('jocamat','Jaymar O. Camat'),('jbballares','Jayson B. Ballares'),('jacruz','Jeffrey A. Cruz'),('jcpurisima','Jefte C. Purisima'),('jlpua','Jenny L. Pua'),('jfcruz','Jesusa F. Cruz'),('jmacebuche','Jhamie M. Acebuche'),('jdtacadena','Jhesed D. Tacadena'),('jjsbase','Jhonn Jelvin S. Base'),('jrsanchez','Jimbo R. Sanchez'),('jmcdevera','Joann Marie C. de Vera'),('jenbangayan','Job Eliezek N. Bangayan'),('jfcgeronimo','Joel Ferdie C. Geronimo'),('jjcpunzalan','Joerard Jeff C. Punzalan'),('jcdcampomanes','John Christian D. Campomanes'),('jetespinal','John Ernest T. Espinal'),('jlsborillo','John Lester S. Borillo'),('jpmabaca','Jonathan Paul M. Abaca'),('jrbarevalo','Joseph Richard B. Arevalo'),('jambasarte','Joshua Andre M. Basarte'),('jplsanpablo','Juan Paolo L. San Pablo'),('jdpascua','Jurly D. Pascua'),('janortiz','Justine Amanda N. Ortiz'),('kmsese','Karen M. Sese'),('kpmsese','Karen Patricia M. Sese'),('karensese','Karen Sese'),('katchan','Karin Alody T. Chan'),('kmmagtibay','Katherine M. Magtibay'),('kvmenancio','Katrina V. Menancio'),('kamtenorio','Kenneth Alvin M. Tenorio'),('kvacujedo','Kerby V. Acujedo'),('ldapadmin','LDAP ADMIN'),('ljrogel','Laurice J. Rogel'),('loprudente','Luke O. Prudente'),('mccsobrepena','Ma. Caryssa C. Sobrepeña'),('mcttuason','Ma. Corazon T. Tuason'),('mmdcervantes','Ma. Margarita D. Cervantes'),('mpgabuya','Maico P. Gabuya'),('mibraga','Manilyn I. Braga'),('masignacio','Manuel Antonio S. Ignacio'),('marfigueroa','Maria Anna R. Figueroa'),('mrtaustin','Maria Ria T. Austin'),('mamdelacruz','Marie Angela M. dela Cruz'),('masdee','Mariel Alexis S. Dee'),('mfmuyco','Mario F. Muyco'),('mzsabino','Mark Z. Sabino'),('mllduran','Martin Lloyd L. Duran'),('mpbajen','Marvin P. Bajen'),('masreal','Mary Antoniette S. Real'),('mrgiaquino','Mary Ranz Gellie I. Aquino'),('mrlmarquez','Melissa Rhona L. Marquez'),('mfbaclig','Melvin F. Baclig'),('macfavila','Mia Angelica C. Favila'),('mmbvillanueva','Michelle Melitta B. Villanueva'),('mbchavez','Micoboy Chavez'),('magdeocampo','Miguel Antonio G. de Ocampo'),('mlgcabuloy','Mitchel Laurent G. Cabuloy'),('mkmvillanoy','Monica Kathrina M. Villanoy'),('ncemsantos','Nicanor Carlo Emmanuel M. Santos'),('nbbrinas','Niño B. Briñas'),('netmercene','Noah Evan T. Mercene'),('pcvtan','Patricia Carmela V. Tan'),('pbljoaquin','Patrick Bernard L. Joaquin'),('pggcagalawan','Patrick Gil G. Cagalawan'),('pegadraneda','Paul Eliczar G. Adraneda'),('ppcprantilla','Paul Patrick C. Prantilla'),('patchua','Pearlie Anne T. Chua'),('rtadmin','RT ADMIN'),('rtnoc','RT NOC'),('rtuser','RT USER'),('rlcardeno','Rafael L. Cardeño'),('rdtorres','Ray D. Torres'),('rcnunez','Raymond C. Nuñez'),('rabelepano','Rey Angelo B. Elepaño'),('rmbergola','Rhommel M. Bergola'),('rsaleyco','Rica Suzette A. Leyco'),('ricliclican','Richmond Ivann C. Liclican'),('rdsalutan','Ringo D. Salutan'),('rsflores','Rochelle S. Flores'),('rnduldulao','Rodolfo N. Duldulao'),('rrtolentino','Roel R. Tolentino'),('rarbenzon','Rolan Alen R. Benzon'),('rcunisa','Rosalie C. Unisa'),('rlbaluyut','Roshel L. Baluyut'),('rnaustria','Rosita N. Austria'),('rbrivera','Rufino B. Rivera'),('rpdgozum','Ryan Paul D. Gozum'),('sbbismonte','Sami B. Bismonte'),('smperalta','Sammuel M. Peralta'),('sjgmojica','Sarah Jane G. Mojica'),('sjpbarnes','Sarah Jane P. Barnes'),('sacabigting','Shenlene A. Cabigting'),('sfpidlaoan','Sherila F. Pidlaoan'),('sgyao','Shervin G. Yao'),('adquerier','Stash Querier'),('satpadiernos','Stephanie Anne T. Padiernos'),('srcprado','Suzane Rose C. Prado'),('techsupport','Technical Support'),('tmcddulla','Theresa Maria Camelle D. Dulla'),('tmresguerra','Tricia Mae R. Esguerra'),('tadelacruz','Trixia A. dela Cruz'),('vvbconoza','Vanessa Viel B. Conoza'),('vmbtorres','Victor Manuel B. Torres'),('vrhubert','Vince R. Hubert'),('vbagudelo','Vincent B. Agudelo'),('wbdmanalo','Wendel Brian D. Manalo'),('wyguila','Wilfredo Y. Guila'),('yadsantos','Yuri Angelo D. Santos'),('zjscabatuan','Zer Jason S. Cabatuan'),('zrdevera','Zurab R. de Vera'),('aruba_wifi','aruba wireless'),('arvin.driz.test','arvin driz test'),('pogiako','pogiako'),('test','test test'),('testlangito','testlangito'),('jomai','Joann Marie C. de Vera'),('kpsese','Karen Patricia M. Sese'),('mmuyco','Mario F. Muyco'),('ysantos','Yuri Angelo Santos'),('zcabatuan','Zer Jason Cabatuan');
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
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_notes`
--

LOCK TABLES `project_notes` WRITE;
/*!40000 ALTER TABLE `project_notes` DISABLE KEYS */;
INSERT INTO `project_notes` VALUES (42,191,30,'[LDAP Server Connection]\n\nThis app is currently connected to a test LDAP server only (10.11.6.115). Will be updated in one or two weeks.\n\nContact person is ma\'am Katrina Menacio.','2014-07-18 18:07:02','2014-07-18 21:56:56','ermercado','ermercado'),(40,191,NULL,'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2014-07-18 17:19:59','2014-07-18 17:20:48','ermercado','ermercado'),(41,191,NULL,'Luke\'s comment','2014-07-18 17:21:23','0000-00-00 00:00:00','loprudente',NULL),(43,191,30,'[LDAP on TLS]\n\nEvery now and then, a warning may appear\n\n\"ldap_start_tls(): Unable to start TLS: Connect error\"\nat line 74 of LDAPModel.php\n\nProblem might be on ldap.conf\nhttp://stackoverflow.com/questions/2689629/how-do-i-solve-ldap-start-tls-unable-to-start-tls-connect-error-in-php\n\nMa\'am Katrina Menacio will tackle this issue one or two weeks from now.','2014-07-18 18:11:53','2014-07-18 20:26:55','ermercado','ermercado'),(44,191,30,'[History Manager]\n\nWhen you are in Module A (e.g. Projects) and navigated to Module B (e.g. Applications) through the navbar, and you click on the browser\'s back button, you will not be redirected back to Module A unless you click the back button twice and fast (double-click).\n\nIt is because when you click on a navbar button, you go to pamgmt/module_name. The history manager then puts the hash content as the page loads (e.g. pamgmt/module_name#hash_content) which makes the url without the hash content the previous state.\n\nSo, when you click on the back button, you will be redirected back to pamgmt/module_name and as that page loads, the hash content will be added which makes it not possible to redirect back to module A.','2014-07-18 20:24:50','0000-00-00 00:00:00','ermercado',NULL),(45,191,31,'[Import CSV of servers data using script]\n\nThe script for initializing the servers table is inside the pamgmt-scripts/importdb folder.\n\nTo use the script, execute in the terminal:\npython db_import_csv.py <filename of csv>\n\nA sample CSV file is in the folder (test.csv). Written in the first line are the column names of the servers table, separated by commas.\n\nThe data in each line should be separated by commas. Please use double quotes to enclose fields that contain spaces.\n\nThere should also be no spaces in between the fields.\nFor example,\n\nCORRECT: server1,PRODUCTION,,255.255.255.255\nINCORRECT: server1, PRODUCTION, , 255.255.255.255\n\nThe script makes use of mysqlimport which is a system command.','2014-07-18 21:03:37','2014-07-18 22:05:58','ermercado','ermercado'),(46,191,31,'[MySQL Dumps]\n\npamgmt-scripts/mysqldumps contains the mysql dumps created from time to time during the application\'s creation (named as test_.sql).\n\ndeleted_projects.sql is generated by the Projects Controller\'s actionDelete method. There was an effort to generate INSERT statements of a project when you delete it (together with its contact persons, and point persons) so you just have to import the file again when the need arises.\n\nHowever, the generation code is currently disabled and not in use since using a well-tested third-party library is better.','2014-07-18 21:33:11','0000-00-00 00:00:00','ermercado',NULL),(47,191,30,'[On deleting]\n\nWhen you delete a project, its point persons, contact persons, and notes will also be deleted from the table.\n\nWhen you delete an application, its point persons, servers (application_servers table entry), and notes will also be deleted from the table.\n\nWhen you delete a server, its applications (application_servers table entry) will be deleted too.\n\nHowever, if you delete rows straight from the database tables, no cascading will happen. (ldap_users, ldap_groups, ldap_user_groups included).','2014-07-18 21:50:33','2014-07-18 21:56:28','ermercado','ermercado'),(48,191,30,'[In the pipline]\n\n1) Deleting projects and saving them in an sql file for easy recovery.\n2) Hiding the hash while retaining history managment\n3) More uses for the notes (attach images, embed html, ...)\n4) Fixing the views for better user experience','2014-07-18 21:53:46','0000-00-00 00:00:00','ermercado',NULL),(49,191,30,'[adLDAP and LDAP]\n\nThe applications LDAP connection was recently changed to 10.11.6.115 which has a different structure with the one at 10.11.6.202. The second one is an active directory.\n\n10.11.6.202 uses the adLDAP extension. The codes used with the extension (see LDAPModel.php, config.main) are commented only in case you you want to connect to that server again.\n\n10.11.6.115\'s config parameters are the ones in Yii::app()->params[\'ldap\']','2014-07-18 22:15:58','0000-00-00 00:00:00','ermercado',NULL);
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
) ENGINE=MyISAM AUTO_INCREMENT=192 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (191,'Project - Application Management','PAMGT','test description test','ACTIVE','0000-00-00','0000-00-00','2014-07-10 11:46:19','2014-07-17 18:26:54','ermercado','ermercado');
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
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servers`
--

LOCK TABLES `servers` WRITE;
/*!40000 ALTER TABLE `servers` DISABLE KEYS */;
INSERT INTO `servers` VALUES (44,'SAI','PRODUCTION','10.11.7.11',NULL,NULL,'Dev Network','Anson\'s','','0000-00-00','0000-00-00','2014-07-14 14:59:46','2014-07-18 17:58:48','ermercado','ermercado'),(45,'Sample Production','PRODUCTION','',NULL,NULL,'network 1','','','0000-00-00','0000-00-00','2014-07-17 16:36:19','0000-00-00 00:00:00','ermercado',NULL);
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

-- Dump completed on 2014-07-18 22:24:38
