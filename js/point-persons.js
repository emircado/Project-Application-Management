var PointPersonsList = function(project_id)
{
    var self = this;
    self.getDataURL = baseURL + '/pointpersons/list';
    self._request = null;

    //buttons
    self.viewID = 'a[id^=point-persons-view_]';
    self.createButtonID = 'point-button-add';

    //container
    self.pointPersonsListID = 'point-persons-list';

    //table
    self.nextID = 'point-next';
    self.prevID = 'point-prev';
    self.currentPage = 1;
    self.resultData = [];
    self.totalDataID = 'point-persons-total';
    self.totalPartID = 'point-persons-part';
    self.pointPersonsTableID = 'point-persons-table';
    self.tableRowClass = 'point-person-row';

    self.init = function()
    {
        $$('.'+self.tableRowClass).dispose();
        $(self.pointPersonsListID).setStyle('display', 'block');
        self.getAjaxData();
    }

    self.getAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'page'          : self.currentPage,
                'project_id'    : project_id
            };

            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
                'onSuccess' : function(data)
                {
                    // console.log('yaya');
                    self.currentPage  = data.page;
                    self.totalPage    = data.totalPage;
                    self.resultData = data.resultData;
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
                contentHTML = '<td>'+val['username']+'</td>'
                            + '<td>'+val['user_group']+'</td>'
                            + '<td class="actions-col two-column">'
                            + '<a id="point-persons-view_' + idx + '" href="#" title="View Contact Person"><span class="">View</span></a>&nbsp'
                            + '</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html' : contentHTML
                });
                
                contentElem.inject($(self.pointPersonsTableID), 'bottom');
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

            contentElem.inject($(self.pointPersonsTableID), 'bottom');
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
            $(self.pointPersonsListID).setStyle('display', 'none');
            PointPersonsSite.initCreate(project_id);
        });
        
        //VIEW CONTACT PERSON
        $$(self.viewID).removeEvents();
        $$(self.viewID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.pointPersonsListID).setStyle('display', 'none');
            PointPersonsSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
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

    //buttons
    self.createSaveButtonID = 'create-button-create-point-persons';
    self.createCancelButtonID = 'point-persons-create-button-cancel';

    //container
    self.createViewID = 'create-point-persons-view';

    //fields
    self.createUsernameID =     'point-persons-create-username';
    self.createUsergroupID =    'point-persons-create-usergroup';
    self.createDescriptionID =  'point-persons-create-description';
    self.usernameRowClass = 	'username-row';
    self.usergroupRowClass =	'usergroup-row';

    //for csrf
    self.createCSRFID = 'point-persons-create-csrf';

    //errors
    self.createUsernameErrorID = 'point-persons-create-username-error';
    self.createUsergroupErrorID = 'point-persons-create-usergroup-error';

    self.init = function()
    {
        console.log('creating point person for '+project_id);
        $(self.createViewID).setStyle('display', 'block');
        self.initDropdown();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.createCSRFID).value,
                'project_id'        : project_id,
                'username'          : $(self.createUsernameID).value.trim(),
                'user_group'         : $(self.createUsergroupID).value.trim(),
                'description'       : $(self.createDescriptionID).value.trim()
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
                        $(self.createUsernameErrorID).setStyle('display', 'none');
                        $(self.createUsergroupErrorID).setStyle('display', 'none');
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'USERNAME_ERROR') {
                                $(self.createUsernameErrorID).set('html', msg[1]);
                                $(self.createUsernameErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'USERGROUP_ERROR') {
                                console.log('here');
                                $(self.createUsergroupErrorID).set('html', msg[1]);
                                $(self.createUsergroupErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        $(self.createCancelButtonID).click();
                        console.log('success');
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
    	contentElem.inject($(self.createUsernameID), 'bottom');
    	contentElem = new Element('<option />',
    	{
    		'class' : self.usergroupRowClass,
            'value' : '',
    		'html'  : '--Select User Group--'
    	});
    	contentElem.inject($(self.createUsergroupID), 'bottom');

    	hash = new Hash(ProjectsSite.ldapObj.ldapData);
    	hash.each(function(val, idx)
        {
            contentElem = new Element('<option />',
	    	{
	    		'class' : self.usergroupRowClass,
                'value' : idx,
	    		'html'  : idx
	    	});
	    	contentElem.inject($(self.createUsergroupID), 'bottom');
        });
    }

    self.addEvents = function()
    {
        //CREATE CONTACT PERSON
        $(self.createSaveButtonID).removeEvents();
        $(self.createSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.createCancelButtonID).removeEvents();
        $(self.createCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //clean form
            $(self.createUsernameID).value = '';
            $(self.createUsergroupID).set('html', '');
            $(self.createDescriptionID).value = '';

            $(self.createUsernameErrorID).setStyle('display', 'none');
            
            $(self.createViewID).setStyle('display', 'none');
            PointPersonsSite.initObj(project_id);
        });

        //USER GROUP DROPDOWN
        $(self.createUsergroupID).removeEvents();
        $(self.createUsergroupID).addEvent('change', function(e)
        {
        	var usergroup = this.getElement(':selected').value;

        	$$('.'+self.usernameRowClass).dispose();

        	contentElem = new Element('<option />',
			{
				'class' : self.usernameRowClass,
				'value' : '',
				'html'  : '--Select Username--'
			});
			contentElem.inject($(self.createUsernameID), 'bottom');

            if (usergroup != '') {
         		Array.each(ProjectsSite.ldapObj.ldapData[usergroup], function(val, idx)
    	        {
    	            contentElem = new Element('<option />',
    		    	{
    		    		'class' : self.usernameRowClass,
                        'value' : val['username'],
    		    		'html'  : val['displayname']
    		    	});
    		    	contentElem.inject($(self.createUsernameID), 'bottom');
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

    //display
    self.viewViewID = 'view-point-persons-view';

    //buttons
    self.editID = 'point-persons-edit';
    self.deleteID = 'point-persons-delete';

    //back to list
    self.viewToListID = 'point-person-view-to-list';

    //fields
    self.viewUsernameID = 'point-persons-view-username';
    self.viewUsergroupID = 'point-persons-view-usergroup';
    self.viewDescriptionID = 'point-persons-view-description';
    self.viewCreatedID = 'point-persons-view-created';
    self.viewUpdatedID = 'point-persons-view-updated';

    //for csrf
    self.viewCSRFID = 'point-persons-view-csrf';

    self.init = function()
    {
        $(self.viewViewID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.viewCSRFID).value,
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
        $(self.viewUsernameID).set('html', data['username']);
        $(self.viewUsergroupID).set('html', data['user_group']);
        $(self.viewDescriptionID).set('html', data['description']);
        $(self.viewCreatedID).set('html', data['date_created_formatted']);
        $(self.viewUpdatedID).set('html', data['date_updated_formatted']);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editID).removeEvents();
        $(self.editID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewViewID).setStyle('display', 'none');
            PointPersonsSite.initEdit(data);
        });

        //DELETE CONTACT PERSON
        $(self.deleteID).removeEvents();
        $(self.deleteID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this point person from the list?'))
            {
                self.postAjaxData();
            }
        });

        //GO BACK TO THE LIST
        $(self.viewToListID).removeEvents();
        $(self.viewToListID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewViewID).setStyle('display', 'none');
            PointPersonsSite.initObj(data['project_id']);
        });
    }
}

var PointPersonsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/pointpersons/update';
    self._request = null;

    //display
    self.editViewID = 'edit-point-persons-view';

    //fields
    self.editUsernameID = 'point-persons-edit-username';
    self.editUsergroupID = 'point-persons-edit-usergroup';
    self.editDescriptionID = 'point-persons-edit-description';

    //for csrf
    self.editCSRFID = 'point-persons-edit-csrf';

    //buttons
    self.editSaveButtonID = 'edit-button-update-point-persons';
    self.editCancelButtonID = 'point-persons-edit-button-cancel';

    self.init = function()
    {
        $(self.editViewID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.editCSRFID).value,
                'project_id'        : data['project_id'],
                'username'          : data['username'],
                'user_group'        : data['user_group'],
                'description'       : $(self.editDescriptionID).value.trim(),
                'date_created'      : data['date_created'],
                'date_updated'      : data['date_updated']
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
                        data = response['data'];
                        $(self.editCancelButtonID).click();
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
        $(self.editUsernameID).set('html', data['username']);
        $(self.editUsergroupID).set('html', data['user_group']);
        $(self.editDescriptionID).value = data['description'];
    }

    self.addEvents = function()
    {
        //UPDATE CONTACT PERSON
        $(self.editSaveButtonID).removeEvents();
        $(self.editSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.editCancelButtonID).removeEvents();
        $(self.editCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //clean form
            $(self.editUsernameID).set('html', '');
            $(self.editUsergroupID).set('html', '');
            $(self.editDescriptionID).value = '';

            $(self.editViewID).setStyle('display', 'none');
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