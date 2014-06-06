var ServersList = function()
{
    var self = this;
    self.getDataURL = baseURL + '/servers/list';
    self._request = null;

    self.containerID     = 'servers-list';
    self.csrfID          = 'servers-list-csrf';

    //for pagination
    self.prevID          = 'servers-list-prev';
    self.nextID          = 'servers-list-next';
    self.totalDataID     = 'servers-list-total';
    self.totalPartID     = 'servers-list-part';

    //for table
    self.tableID         = 'servers-list-table';
    self.totalPage       = 1;
    self.currentPage     = 1;
    self.resultData      = [];
    self.tableRowClass   = 'servers-list-row';

    //fields
    self.fieldNameID     = 'servers-list-search-name';
    self.fieldTypeID     = 'servers-list-search-type';
    self.fieldHostID     = 'servers-list-search-host';
    self.fieldPrivateID  = 'servers-list-search-private';
    self.fieldNetworkID  = 'servers-list-search-network';
    
    //buttons
    self.createButtonID  = 'servers-list-create-button';
    self.viewButtonID    = 'a[id^=servers-list-view_]';
    self.searchButtonID  = 'search-submit';
    self.clearButtonID   = 'servers-list-clear-button';
    self.searchParams    = {
        'name'          : '',
        'server_type'   : '',
        'hostname'      : '',
        'private_ip'    : '',
        'network'       : ''
    };

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
                'name'              : self.searchParams['name'].trim(),
                'server_type'       : self.searchParams['server_type'].trim(),
                'private_ip'        : self.searchParams['private_ip'].trim(),
                'network'           : self.searchParams['network'].trim(),
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
            };
            
            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
                'onSuccess' : function(data)
                {
                    self.currentPage = data.page;
                    self.totalPage = data.totalPage;
                    self.resultData = data.resultData;
                    self.pageLimit = data.limit;
                    self.renderData(data.totalData);
                    self.addEvents();

                    //callbacks
                    self.paginationChecker();
                },
                'onError' : function(data)
                {
                    self._request.stop;
                    console.log('Something went wrong!');
                }
            }).send();
        }
    }

    self.paginationChecker = function()
    {
        //display the NEXT and PREV
        $(self.prevID).setStyle('display', 'block');
        $(self.nextID).setStyle('display', 'block');
        
        //first check the preview button whether it will be disable or not
        if(self.currentPage == 1)
        {
            /*disable on prevID*/
            $(self.prevID).addClass('disable');
        }
        else
        {
            // remove disable on prevID
            $(self.prevID).removeClass('disable');
        }

        //second check the next button whether it will be disable or not
        if(self.currentPage < self.totalPage)
        {
            /*remove disable on nextID*/
            $(self.nextID).removeClass('disable');
        }
        else
        {
            /*disable nextID*/
            $(self.nextID).addClass('disable');
        }

        //below will be the calcutaion and displaying for the total data results
        var start = (self.pageLimit * self.currentPage) - self.pageLimit + 1;
        var end   = (start + self.resultData.length) - 1;

        if(self.resultData.length)
        {
            $(self.totalPartID).set('html', start+'-'+end);
        }
        else
        {
            $(self.totalPartID).set('html', '');
            /*disable both prev and next ID*/

            $(self.prevID).addClass('disable');
            $(self.nextID).addClass('disable');
        }
    };

    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);
            Array.each(self.resultData, function(val, idx)
            {
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['server_type']+'</td>'                        
                            + '<td>'+((val['hostname'] == null)? '' : val['hostname'])+'</td>'
                            + '<td>'+((val['private_ip'] == null)? '' : val['private_ip'])+'</td>'
                            + '<td>'+val['network']+'</td>'
                            + '<td class="actions-col three-column">'
                            + '<a id="servers-list-view_' + idx + '" href="#" title="View Server">View</a>&nbsp'
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
            
            contentHTML = '<td colspan="6">No results found</td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html' : contentHTML
            });

            contentElem.inject($(self.tableID), 'bottom');
        }
    }

    self.clearSearch = function()
    {
        self.currentPage = 1;
        self.searchParams['name'] = '';
        self.searchParams['server_type'] = '';
        self.searchParams['hostname'] = '';
        self.searchParams['private_ip'] = '';
        self.searchParams['network'] = '';

        $(self.fieldNameID).value = '';
        $(self.fieldTypeID).value = '';
        $(self.fieldHostID).value = '';    
        $(self.fieldPrivateID).value = '';
        $(self.fieldNetworkID).value = '';    
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

        //EVENT FOR SEARCH BUTTON
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();

            self.currentPage = 1;
            self.searchParams['name']       = $(self.fieldNameID).value.trim();
            self.searchParams['server_type']= $(self.fieldTypeID).value.trim();
            self.searchParams['hostname']   = $(self.fieldHostID).value.trim();
            self.searchParams['private_ip'] = $(self.fieldPrivateID).value.trim();
            self.searchParams['network']    = $(self.fieldNetworkID).value.trim();
            self.init();
        });

        //EVENT FOR CLEAR SEARCH FIELDS
        $(self.clearButtonID).removeEvents();
        $(self.clearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.clearSearch();
        });

        //EVENT FOR VIEWING A PROJECT
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click',function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ServersSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
            self.clearSearch();
        });

        //EVENT FOR CREATING A NEW PROJECT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ServersSite.initCreate();
            self.clearSearch();
        });
    }
}

var ServersCreate = function()
{
    var self = this;
    self.postDataURL = baseURL + '/servers/create';
    self._request = null;

    self.containerID        = 'servers-create';

    //buttons
    self.saveButtonID       = 'servers-create-save-button';
    self.cancelButtonID     = 'servers-create-cancel-button';

    //fields
    self.fieldNameID        = 'servers-create-name';
    self.fieldTypeID        = 'servers-create-type';
    self.fieldHostID        = 'servers-create-host';
    self.fieldPublicID      = 'servers-create-public';
    self.fieldPrivateID     = 'servers-create-private';
    self.fieldNetworkID     = 'servers-create-network';
    self.fieldLocationID    = 'servers-create-location';
    self.fieldDescriptionID = 'servers-create-description';
    self.fieldProductionID  = 'servers-create-production';
    self.fieldTerminationID = 'servers-create-termination';
    self.csrfID             = 'servers-create-csrf';

    //errors
    self.errorTypeID        = 'servers-create-type-error';
    self.errorPublicID      = 'servers-create-public-error';
    self.errorPrivateID     = 'servers-create-private-error';
    self.errorNetworkID     = 'servers-create-network-error';

    self.init = function()
    {
        $(self.containerID).setStyle('display', 'block'); 
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'name'              : $(self.fieldNameID).value.trim(),
                'server_type'       : $(self.fieldTypeID).value.trim(),
                'hostname'          : $(self.fieldHostID).value.trim(),
                'public_ip'         : $(self.fieldPublicID).value.trim(),
                'private_ip'        : $(self.fieldPrivateID).value.trim(),
                'network'           : $(self.fieldNetworkID).value.trim(),
                'location'          : $(self.fieldLocationID).value.trim(),
                'description'       : $(self.fieldDescriptionID).value.trim(),
                'production_date'   : $(self.fieldProductionID).value.trim(),
                'termination_date'  : $(self.fieldTerminationID).value.trim()
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'success') {    
                        $(self.cancelButtonID).click();
                    } else if (response['type'] == 'error') {
                        self._request.stop;
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'NETWORK_ERROR') {
                                $(self.errorNetworkID).set('html', msg[1]);
                                $(self.errorNetworkID).setStyle('display', 'block');
                            } else if (msg[0] == 'TYPE_ERROR') {
                                $(self.errorTypeID).set('html', msg[1]);
                                $(self.errorTypeID).setStyle('display', 'block');
                            } else if (msg[0] == 'PUBLIC_ERROR') {
                                $(self.errorPublicID).set('html', msg[1]);
                                $(self.errorPublicID).setStyle('display', 'block');
                            
                                new AppServersNoticeModal('Notice', msg[1], response['duplicate'], 'OK', function(){}, true).show();
                            } else if (msg[0] == 'PRIVATE_ERROR') {
                                $(self.errorPrivateID).set('html', msg[1]);
                                $(self.errorPrivateID).setStyle('display', 'block');

                                new AppServersNoticeModal('Notice', msg[1], response['duplicate'], 'OK', function(){}, true).show();
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
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

    self.addEvents = function()
    {
        //EVENT FOR SAVING CHANGES BUTTON IN EDIT/CREATE PROJECT
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorTypeID).setStyle('display', 'none');
            $(self.errorPublicID).setStyle('display', 'none');
            $(self.errorPrivateID).setStyle('display', 'none');
            $(self.errorNetworkID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT/CREATE PROJECT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');

            //clear form
            $(self.errorTypeID).setStyle('display', 'none');
            $(self.errorPublicID).setStyle('display', 'none');
            $(self.errorPrivateID).setStyle('display', 'none');
            $(self.errorNetworkID).setStyle('display', 'none');

            $(self.fieldNameID).value = '';
            $(self.fieldTypeID).value = 'PRODUCTION';
            $(self.fieldHostID).value = '';
            $(self.fieldPublicID).value = '';
            $(self.fieldPrivateID).value = '';
            $(self.fieldNetworkID).value = '';
            $(self.fieldLocationID).value = '';
            $(self.fieldDescriptionID).value = '';
            $(self.fieldProductionID).value = '';
            $(self.fieldTerminationID).value = '';

            ServersSite.mainObj.init();
        });
    }
}

var ServersView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/servers/delete';
    self._request = null;

    self.containerID         = 'servers-view';

    //fields
    self.fieldNameID         = 'servers-view-name';
    self.fieldTypeID         = 'servers-view-type';
    self.fieldHostID         = 'servers-view-host';
    self.fieldPublicID       = 'servers-view-public';
    self.fieldPrivateID      = 'servers-view-private';
    self.fieldNetworkID      = 'servers-view-network';
    self.fieldLocationID     = 'servers-view-location';
    self.fieldDescriptionID  = 'servers-view-description';
    self.fieldProductionID   = 'servers-view-production';
    self.fieldTerminationID  = 'servers-view-termination';
    self.fieldCreatedID      = 'servers-view-created';
    self.fieldUpdatedID      = 'servers-view-updated';
    self.fieldCreatedByID    = 'servers-view-createdby';
    self.fieldUpdatedByID    = 'servers-view-updatedby';
    self.csrfID              = 'servers-view-csrf';

    //buttons
    self.backButtonID        = 'servers-view-back-button';
    self.editButtonID        = 'servers-view-edit-button';
    self.deleteButtonID      = 'servers-view-delete-button';

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
                'server_id'         : data['server_id'],
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    $(self.backButtonID).click();
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
        // format display data
        var createdby = ServersSite.ldapUsersObj.ldapUsersData.get(data['created_by']);
        var updatedby = ServersSite.ldapUsersObj.ldapUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);
        var termination = (data['termination_date'] == null || data['termination_date'] == '0000-00-00')? 'mm' : DateFormatter.formatDate(data['termination_date']);
        var production = (data['production_date'] == null || data['production_date'] == '0000-00-00')? '' : DateFormatter.formatDate(data['production_date']);

        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldTypeID).set('html', data['server_type']);
        $(self.fieldHostID).set('html', data['hostname']);
        $(self.fieldPublicID).set('html', data['public_ip']);
        $(self.fieldPrivateID).set('html', data['private_ip']);
        $(self.fieldNetworkID).set('html', data['network']);
        $(self.fieldLocationID).set('html', data['location']);
        $(self.fieldDescriptionID).set('html', '<pre>'+((data['description'] == null)? '' : data['description']));
        $(self.fieldProductionID).set('html', production);
        $(self.fieldTerminationID).set('html', termination);
        $(self.fieldCreatedID).set('html', created);
        $(self.fieldUpdatedID).set('html', updated);
        $(self.fieldCreatedByID).set('html', (createdby == null)? data['created_by'] : createdby);
        $(self.fieldUpdatedByID).set('html', (updatedby == null)? data['updated_by'] : updatedby);
    }

    self.addEvents = function()
    {
        //EVENT FOR GOING BACK TO MAIN FROM VIEW
        $(self.backButtonID).removeEvents();
        $(self.backButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ServersSite.mainObj.clearSearch();

            $(self.containerID).setStyle('display', 'none');
            ServersSite.mainObj.init();
        });

        //EVENT FOR EDITING A PROJECT
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();            

            $(self.containerID).setStyle('display', 'none');
            ServersSite.initEdit(data);
        });

        //EVENT FOR DELETING A PROJECT
        $(self.deleteButtonID).removeEvents();
        $(self.deleteButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            new ConfirmModal(
                'Confirm Delete', 
                'Are you sure you want to delete the project?', 
                'Delete', 
                self.postAjaxData)
            .show();
        });
    }
}

var ServersSite = {
    csrfID:     'servers-csrf', 
    mainObj:    new ServersList(), 
    createObj:  new ServersCreate(),
    //data
    ldapUsersObj: null,

    init: function()
    {
        var self = this;
        self.initLDAPUsers();
        self.initObj();
    },

    initObj: function()
    {
        var self = this;
        self.mainObj.init();
    },

    initCreate: function()
    {
        var self = this;
        self.createObj.init();
    },

    initView: function(data)
    {
        var self = this;
        new ServersView(data).init();
    },

    initEdit: function(data)
    {
        var self = this;
        new ServersEdit(data).init();
    },

    initLDAPUsers: function()
    {
        var self = this;
        self.ldapUsersObj = new LDAPUsersData($(self.csrfID).value);
        self.ldapUsersObj.init();
    },
}


window.addEvent('domready', function()
{
    ServersSite.init();
});