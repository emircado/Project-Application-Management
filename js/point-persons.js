var PointPersonsList = function(project_id)
{
    var self = this;
    self.getDataURL = baseURL + '/pointpersons/list';
    self._request = null;

    self.containerID    = 'point-persons-list';
    self.csrfID         = 'point-persons-list-csrf';

    //for pagination
    self.prevID         = 'point-persons-list-prev';
    self.nextID         = 'point-persons-list-next';
    self.totalDataID    = 'point-persons-list-total';
    self.totalPartID    = 'point-persons-list-part';

    //for table
    self.tableID        = 'point-persons-list-table';
    self.totalPage      = 1;
    self.currentPage    = 1;
    self.resultData     = [];
    self.tableRowClass  = 'point-persons-list-row';

    //buttons
    self.viewButtonID   = 'tr[id^=point-persons-list-view_]';
    self.createButtonID = 'point-persons-list-create-button';

    self.init = function()
    {
        $$('.'+self.tableRowClass).dispose();
        $(self.containerID).setStyle('display', 'block');
        self.getAjaxData();
    }

    self.getAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'page'          : self.currentPage,
                'project_id'    : project_id,
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
            };

            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
                'onSuccess' : function(data)
                {
                    self.currentPage  = data.page;
                    self.totalPage    = data.totalPage;
                    self.resultData   = data.resultData;
                    self.pageLimit    = data.limit;
                    self.renderData(data.totalData);

                    //callbacks
                    self.paginationChecker();
                    self.addEvents();
                },
                'onError' : function(data)
                {
                    self._request.stop;
                    console.log('Something went wrong!');
                }
            }).send();
        }
    }

    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            Array.each(self.resultData, function(val, idx)
            {
                var displayname = ProjectsSite.ldapUsersObj.ldapUsersData.get(val['username']);
                contentHTML = '<td>'+((displayname == null)? '' : displayname)+'</td>'
                            + '<td>'+val['user_group']+'</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'point-persons-list-view_'+idx,
                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td>No point persons found</td><td></td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : contentHTML,
                'id'    : 'point-persons-list-view_none',
            });

            contentElem.inject($(self.tableID), 'bottom');
        }   
    }

    self.addEvents = function()
    {
        //EVENT FOR NEXT PAGE
        $(self.nextID).removeEvents();
        $(self.nextID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != self.totalPage) {
                self.currentPage++;
                self.init();
            }
        });
        
        //EVENT FOR PREVIOUS PAGE
        $(self.prevID).removeEvents();
        $(self.prevID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != 1) {
                self.currentPage--;
                self.init();
            }
        });

        //CREATE A POINT PERSON
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            PointPersonsSite.initCreate(project_id);
        });
        
        //VIEW CONTACT PERSON
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var idx = parseInt($(this).get('id').split('_')[1]);
            if (typeof idx==='number' && (idx%1)===0) {
                $(self.containerID).setStyle('display', 'none');
                PointPersonsSite.initView(self.resultData[idx]);
            }
        });
    }

    self.paginationChecker = function()
    {
        //display the NEXT and PREV
        $(self.prevID).setStyle('display', 'block');
        $(self.nextID).setStyle('display', 'block');
        
        if(self.currentPage == 1)
        {
            $(self.prevID).addClass('disable');
        }
        else
        {
            $(self.prevID).removeClass('disable');
        }
        if(self.currentPage < self.totalPage)
        {
            $(self.nextID).removeClass('disable');
        }
        else
        {
            $(self.nextID).addClass('disable');
        }

        //below will be the calcutaion and displaying for the total data results
        var start   = (self.pageLimit * self.currentPage) - self.pageLimit + 1;
        var end   = (start + self.resultData.length) - 1;

        if(self.resultData.length)
        {
            $(self.totalPartID).set('html', start+'-'+end);
        }
        else
        {
            $(self.totalPartID).set('html', '');
            $(self.prevID).addClass('disable');
            $(self.nextID).addClass('disable');
        }
    }
};

var PointPersonsCreate = function(project_id)
{
    var self = this;
    self.postDataURL = baseURL + '/pointpersons/create';
    self._request = null;

    self.containerID        = 'point-persons-create';

    //buttons
    self.saveButtonID       = 'point-persons-create-save-button';
    self.cancelButtonID     = 'point-persons-create-cancel-button';

    //fields
    self.fieldUsernameID    = 'point-persons-create-username';
    self.fieldUsergroupID   = 'point-persons-create-usergroup';
    self.fieldDescriptionID = 'point-persons-create-description';
    self.usernameRowClass   = 'point-persons-create-username-row';
    self.usergroupRowClass  = 'point-persons-create-usergroup-row';
    self.csrfID             = 'point-persons-create-csrf';

    //errors
    self.errorUsernameID    = 'point-persons-create-username-error';
    self.errorUsergroupID   = 'point-persons-create-usergroup-error';

    self.init = function()
    {
        $(self.containerID).setStyle('display', 'block');
        self.initDropdown();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'project_id'        : project_id,
                'username'          : $(self.fieldUsernameID).value.trim(),
                'user_group'        : $(self.fieldUsergroupID).value.trim(),
                'description'       : $(self.fieldDescriptionID).value.trim()
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'error') {
                        self._request.stop;
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'USERNAME_ERROR') {
                                $(self.errorUsernameID).set('html', msg[1]);
                                $(self.errorUsernameID).setStyle('display', 'block');
                            } else if (msg[0] == 'USERGROUP_ERROR') {
                                $(self.errorUsergroupID).set('html', msg[1]);
                                $(self.errorUsergroupID).setStyle('display', 'block');
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        $(self.cancelButtonID).click();
                    }
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                }
            }).send();
        }
    }

    self.initDropdown = function()
    {
    	contentElem = new Element('<option />',
    	{
    		'class' : self.usernameRowClass,
            'value' : '',
    		'html'  : '--Select Username--'
    	});
    	contentElem.inject($(self.fieldUsernameID), 'bottom');
    	contentElem = new Element('<option />',
    	{
    		'class' : self.usergroupRowClass,
            'value' : '',
    		'html'  : '--Select User Group--'
    	});
    	contentElem.inject($(self.fieldUsergroupID), 'bottom');

    	ProjectsSite.ldapGroupsObj.ldapGroupsData.each(function(val, idx)
        {
            contentElem = new Element('<option />',
	    	{
	    		'class' : self.usergroupRowClass,
                'value' : idx,
	    		'html'  : idx
	    	});
	    	contentElem.inject($(self.fieldUsergroupID), 'bottom');
        });
    }

    self.addEvents = function()
    {
        //CREATE CONTACT PERSON
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorUsergroupID).setStyle('display', 'none');
            $(self.errorUsernameID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //clean form
            $(self.fieldUsernameID).value = '';
            $(self.fieldUsergroupID).set('html', '');
            $(self.fieldDescriptionID).value = '';

            $(self.errorUsernameID).setStyle('display', 'none');
            $(self.errorUsergroupID).setStyle('display', 'none');

            $(self.containerID).setStyle('display', 'none');
            PointPersonsSite.initObj(project_id);
        });

        //USER GROUP DROPDOWN
        $(self.fieldUsergroupID).removeEvents();
        $(self.fieldUsergroupID).addEvent('change', function(e)
        {
        	var usergroup = this.getElement(':selected').value;

        	$$('.'+self.usernameRowClass).dispose();

        	contentElem = new Element('<option />',
			{
				'class' : self.usernameRowClass,
				'value' : '',
				'html'  : '--Select Username--'
			});
			contentElem.inject($(self.fieldUsernameID), 'bottom');

            if (usergroup != '') {
                ProjectsSite.ldapGroupsObj.ldapGroupsData.get(usergroup).each(function(val, idx) {
                    contentElem = new Element('<option />',
                    {
                        'class' : self.usernameRowClass,
                        'value' : idx,
                        'html'  : val
                    });
                    contentElem.inject($(self.fieldUsernameID), 'bottom');
                });
            }
        });
    }
}

var PointPersonsView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/pointpersons/delete';
    self._request = null;

    self.containerID        = 'point-persons-view';

    //fields
    self.fieldUsernameID    = 'point-persons-view-username';
    self.fieldUsergroupID   = 'point-persons-view-usergroup';
    self.fieldDescriptionID = 'point-persons-view-description';
    self.csrfID             = 'point-persons-view-csrf';
    
    //buttons
    self.editButtonID = 'point-persons-view-edit-button';
    self.deleteButtonID = 'point-persons-view-delete-button';
    self.backButtonID = 'point-persons-view-back-button';

    self.init = function()
    {
        $(self.containerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'project_id'        : data['project_id'],
                'username'          : data['username']
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'error') {
                        self._request.stop;
                        console.log('error type 2');
                    } else if (response['type'] == 'success') {
                        $(self.viewToListID).click();
                    }
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('error type 1');
                }
            }).send();
        }
    }

    self.renderData = function()
    {
        var displayname = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['username']);

        $(self.fieldUsernameID).set('html', (displayname == null)? data['username'] : displayname);
        $(self.fieldUsergroupID).set('html', data['user_group']);
        $(self.fieldDescriptionID).set('html', '<pre>'+data['description']);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            PointPersonsSite.initEdit(data);
        });

        //DELETE CONTACT PERSON
        $(self.deleteButtonID).removeEvents();
        $(self.deleteButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            new ConfirmModal(
                'Confirm Delete',
                'Are you sure you want to delete this point person from the list?',
                'Delete',
                self.postAjaxData)
            .show();
        });

        //GO BACK TO THE LIST
        $(self.backButtonID).removeEvents();
        $(self.backButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            PointPersonsSite.initObj(data['project_id']);
        });
    }
}

var PointPersonsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/pointpersons/update';
    self._request = null;

    self.containerID        = 'point-persons-edit';

    //fields
    self.fieldUsernameID    = 'point-persons-edit-username';
    self.fieldUsergroupID   = 'point-persons-edit-usergroup';
    self.fieldDescriptionID = 'point-persons-edit-description';
    self.csrfID             = 'point-persons-edit-csrf';

    //buttons
    self.saveButtonID       = 'point-persons-edit-save-button';
    self.cancelButtonID     = 'point-persons-edit-cancel-button';

    self.init = function()
    {
        $(self.containerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'project_id'        : data['project_id'],
                'username'          : data['username'],
                'description'       : $(self.fieldDescriptionID).value.trim(),
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'error') {
                        self._request.stop;
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        data['description'] = response['data']['description'];
                        $(self.cancelButtonID).click();
                    }
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                }
            }).send();
        }
    }

    self.renderData = function()
    {
        var displayname = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['username']);

        $(self.fieldUsernameID).set('html', (displayname == null)? data['username'] : displayname);
        $(self.fieldUsergroupID).set('html', data['user_group']);
        $(self.fieldDescriptionID).value = data['description'];
    }

    self.addEvents = function()
    {
        //UPDATE CONTACT PERSON
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //clean form
            $(self.fieldUsernameID).set('html', '');
            $(self.fieldUsergroupID).set('html', '');
            $(self.fieldDescriptionID).value = '';

            $(self.containerID).setStyle('display', 'none');
            PointPersonsSite.initView(data);
        });
    }
}

var PointPersonsSite = {
    init: function(project_id)
    {
        var self = this;
        self.initObj(project_id);
    },

    initObj: function(project_id)
    {
        new PointPersonsList(project_id).init();
    },

    initCreate: function(project_id)
    {
        new PointPersonsCreate(project_id).init();
    },

    initEdit: function(data)
    {
        new PointPersonsEdit(data).init();
    },

    initView: function(data)
    {
        new PointPersonsView(data).init();
    }
}