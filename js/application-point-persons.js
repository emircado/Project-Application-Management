var AppPointPersonsList = function(application_id)
{
    var self = this;
    self.getDataURL = baseURL + '/applicationpointpersons/list';
    self._request = null;

    self.containerID    = 'app-point-persons-list';
    
    //for pagination
    self.nextID         = 'app-point-persons-list-next';
    self.prevID         = 'app-point-persons-list-prev';
    self.totalDataID    = 'app-point-persons-list-total';
    self.totalPartID    = 'app-point-persons-list-part';
    
    //for table
    self.tableID        = 'app-point-persons-list-table';
    self.totalPage      = 1;
    self.currentPage    = 1;
    self.resultData     = [];
    self.tableRowClass  = 'app-point-persons-list-row';

    //buttons
    self.viewButtonID   = 'a[id^=app-point-persons-list-view_]';
    self.createButtonID = 'app-point-persons-list-create-button';

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
                'page'              : self.currentPage,
                'application_id'    : application_id
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
                            + '<td>'+val['user_group']+'</td>'
                            + '<td class="actions-col two-column">'
                            + '<a id="app-point-persons-list-view_' + idx + '" href="#" title="View Point Person"><span class="">View</span></a>&nbsp'
                            + '</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html' : contentHTML
                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td>No point persons found</td><td></td><td></td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html' : contentHTML
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
            AppPointPersonsSite.initCreate(application_id);
        });
        
        //VIEW CONTACT PERSON
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            AppPointPersonsSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
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

var AppPointPersonsCreate = function(application_id)
{
    var self = this;
    self.postDataURL = baseURL + '/applicationpointpersons/create';
    self._request = null;

    self.containerID        = 'app-point-persons-create';

    //buttons
    self.saveButtonID       = 'app-point-persons-create-save-button';
    self.cancelButtonID     = 'app-point-persons-create-cancel-button';

    //fields
    self.fieldUsernameID    = 'app-point-persons-create-username';
    self.fieldUsergroupID   = 'app-point-persons-create-usergroup';
    self.fieldDescriptionID = 'app-point-persons-create-description';
    self.csrfID             = 'app-point-persons-create-csrf';

    //dropdown classes
    self.usernameRowClass   = 'app-point-persons-create-username-row';
    self.usergroupRowClass  = 'app-point-persons-create-usergroup-row';

    //errors
    self.errorUsernameID    = 'app-point-persons-create-username-error';
    self.errorUsergroupID   = 'app-point-persons-create-usergroup-error';

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
                'application_id'    : application_id,
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
            $(self.errorUsernameID).setStyle('display', 'none');
            $(self.errorUsergroupID).setStyle('display', 'none');
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
            AppPointPersonsSite.initObj(application_id);
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

var AppPointPersonsView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applicationpointpersons/delete';
    self._request = null;

    self.containerID        = 'app-point-persons-view';

    //fields
    self.fieldUsernameID    = 'app-point-persons-view-username';
    self.fieldUsergroupID   = 'app-point-persons-view-usergroup';
    self.fieldDescriptionID = 'app-point-persons-view-description';
    self.fieldCreatedID     = 'app-point-persons-view-created';
    self.fieldUpdatedID     = 'app-point-persons-view-updated';
    self.fieldCreatedByID   = 'app-point-persons-view-createdby';
    self.fieldUpdatedByID   = 'app-point-persons-view-updatedby';
    self.csrfID             = 'app-point-persons-view-csrf';

    //buttons
    self.editButtonID       = 'app-point-persons-edit-button';
    self.deleteButtonID     = 'app-point-persons-delete-button';
    self.backButtonID       = 'app-point-persons-back-button';

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
                'application_id'    : data['application_id'],
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
                        $(self.backButtonID).click();
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
        var createdby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['created_by']);
        var updatedby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);

        $(self.fieldUsernameID).set('html', (displayname == null)? data['username'] : displayname);
        $(self.fieldUsergroupID).set('html', data['user_group']);
        $(self.fieldDescriptionID).set('html', '<pre>'+data['description']);
        $(self.fieldCreatedID).set('html', created);
        $(self.fieldUpdatedID).set('html', updated);
        $(self.fieldCreatedByID).set('html', createdby);
        $(self.fieldUpdatedByID).set('html', updatedby);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            AppPointPersonsSite.initEdit(data);
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
            AppPointPersonsSite.initObj(data['application_id']);
        });
    }
}

var AppPointPersonsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applicationpointpersons/update';
    self._request = null;

    self.containerID        = 'app-point-persons-edit';

    //fields
    self.fieldUsernameID    = 'app-point-persons-edit-username';
    self.fieldUsergroupID   = 'app-point-persons-edit-usergroup';
    self.fieldDescriptionID = 'app-point-persons-edit-description';
    self.csrfID             = 'app-point-persons-edit-csrf';

    //buttons
    self.saveButtonID       = 'app-point-persons-edit-save-button';
    self.cancelButtonID     = 'app-point-persons-edit-cancel-button';

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
                'application_id'    : data['application_id'],
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
                        data['date_updated'] = response['data']['date_updated'];
                        data['updated_by'] = response['data']['updated_by'];
                        
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
            AppPointPersonsSite.initView(data);
        });
    }
}

var AppPointPersonsSite = {
    init: function(application_id)
    {
        var self = this;
        self.initObj(application_id);
    },

    initObj: function(application_id)
    {
        new AppPointPersonsList(application_id).init();
    },

    initCreate: function(application_id)
    {
        new AppPointPersonsCreate(application_id).init();
    },

    initEdit: function(data)
    {
        new AppPointPersonsEdit(data).init();
    },

    initView: function(data)
    {
        new AppPointPersonsView(data).init();
    }
}