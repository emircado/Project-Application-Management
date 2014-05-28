
INSERT INTO `projects` (`project_id`, `name`, `code`, `description`, `status`, `production_date`, `termination_date`, `date_created`, `date_updated`, `created_by`, `updated_by`) VALUES
('101', 'Sample Project 01', 'PRO01', 'Description for project01', 'ACTIVE', '2014-11-01', '0000-00-00', '0000-00-00 00:00:00', '2014-05-06 16:48:17', 'ermercado', 'ermercado');

INSERT INTO `project_contact_persons` (`project_id`, `name`, `company`, `position`, `contact_numbers`, `email`, `address`, `notes`, `date_created`, `date_updated`) VALUES
('101', 'aaaa', '', '', '', 'aaa@aa.aa', '', '', '2014-05-06 14:41:11', '0000-00-00 00:00:00'), 
('101', 'A Very Long name', 'A very long company name', 'a very long position nameasdfasdf', '09890', 'averylongemail@email.com.ph', '90890', '90890', '2014-05-05 15:59:56', '2014-05-05 16:09:42'), 
('101', 'emir', '', '', 's', 'emir_mercado2000@yahoo.com', '', 'asdfadf
sdf
asdf
df', '2014-05-02 18:41:48', '2014-05-06 15:34:45'), 
('101', 'adsasdf', '', '', '', 'ret@ret.ret', '', '', '2014-05-06 14:41:02', '0000-00-00 00:00:00'), 
('101', 'Test', 'SDF', 'SDF', '34543asdfasdf', 'sumthin@test.com', 'fSDf', 'SDf', '2014-04-29 11:16:25', '2014-04-29 18:07:26'), 
('101', 'hey', 'asdf', 'test', '', 'test@test.tst', '', '', '2014-04-29 11:14:30', '2014-04-29 13:52:56');

INSERT INTO `project_point_persons` (`project_id`, `username`, `user_group`, `description`, `date_created`, `date_updated`) VALUES
('101', 'apcadvento', 'DEVELOPERS', 'gf', '2014-05-06 15:05:53', '0000-00-00 00:00:00'), 
('101', 'bacquizon', 'DEVELOPERS', 'asdf', '2014-05-06 15:17:47', '2014-05-06 15:17:53'), 
('101', 'ecmquiros', 'DEVELOPERS', '', '2014-05-02 18:29:19', '0000-00-00 00:00:00'), 
('101', 'igpjumaoas', 'DEVELOPERS', '', '2014-04-30 13:37:13', '0000-00-00 00:00:00'), 
('101', 'jesia', 'RND1', '', '2014-05-06 15:21:55', '0000-00-00 00:00:00');

INSERT INTO `projects` (`project_id`, `name`, `code`, `description`, `status`, `production_date`, `termination_date`, `date_created`, `date_updated`, `created_by`, `updated_by`) VALUES
('186', '', '33333', '', 'ACTIVE', '0000-00-00', '0000-00-00', '2014-05-07 11:29:40', '0000-00-00 00:00:00', 'ermercado', NULL);

INSERT INTO `projects` (`project_id`, `name`, `code`, `description`, `status`, `production_date`, `termination_date`, `date_created`, `date_updated`, `created_by`, `updated_by`) VALUES
('182', '', 'ASDFF', '', 'ACTIVE', '0000-00-00', '0000-00-00', '2014-05-05 19:00:00', '0000-00-00 00:00:00', 'ermercado', NULL);

INSERT INTO `project_contact_persons` (`project_id`, `name`, `company`, `position`, `contact_numbers`, `email`, `address`, `notes`, `date_created`, `date_updated`) VALUES
('182', 'a', '', '', '', 'yo@yo.yo', '', '', '2014-05-05 19:05:03', '0000-00-00 00:00:00');
