var AppServersList = function(application_id)
{
    var self = this;
    self.getDataURL = baseURL + '/applicationservers/list';
    self._request = null;

    self.containerID    = 'app-servers-list';
    self.csrfID         = 'app-servers-list-csrf';

    //for pagination
    self.nextID         = 'app-servers-list-next';
    self.prevID         = 'app-servers-list-prev';
    self.totalDataID    = 'app-servers-list-total';
    self.totalPartID    = 'app-servers-list-part';

    //for table
    self.tableID        = 'app-servers-list-table';
    self.totalPage      = 1;
    self.currentPage    = 1;
    self.resultData     = [];
    self.tableRowClass  = 'app-servers-list-row';

    //buttons
    self.viewButtonID   = 'tr[id^=app-servers-list-view_]';
    self.createButtonID = 'app-servers-list-create-button';

    self.init = function()
    {
        AppServersSite.activeView = 'LIST';
        $(self.containerID).setStyle('display', 'block');
        self.getAjaxData();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        $$('.'+self.tableRowClass).dispose();
    }

    self.getAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'page'              : self.currentPage,
                'application_id'    : application_id,
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

    self.renderData = function(count) {
        $$('.'+self.tableRowClass).dispose();
        if (count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            Array.each(self.resultData, function(val, idx)
            {
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['server_type']+'</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'app-servers-list-view_'+idx,
                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td>No servers found</td><td></td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : contentHTML,
                'id'    : 'app-servers-list-view_none',
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

        // CREATE APP SERVER
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            AppServersSite.initCreate(application_id);
        });

        // VIEW APP SERVER
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var idx = parseInt($(this).get('id').split('_')[1]);
            if (typeof idx==='number' && (idx%1)===0) {
                AppServersSite.initView(self.resultData[idx]);
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
}

var AppServersCreate = function(application_id)
{
    var self = this;
    self.postDataURL = baseURL + '/applicationservers/create';
    self._request = null;

    //containers
    self.containerID    = 'app-servers-create';
    self.searchModalContainerID = 'app-servers-create-modal-container';
    self.createMoreID   = 'app-servers-create-more';
    self.searchModal    = new AppServersSearchModal();
    self.listModal      = new AppServersListModal();

    //buttons
    self.createButtonID = 'app-servers-create-save-button';
    self.cancelButtonID = 'app-servers-create-cancel-button';
    self.listButtonID   = 'app-servers-create-advanced-button';
    
    //fields
    self.fieldTypeID    = 'app-servers-create-type';
    self.fieldServerID  = 'app-servers-create-server';
    self.fieldPathID    = 'app-servers-create-path';
    self.fieldLogID     = 'app-servers-create-log';
    self.csrfID         = 'app-servers-create-csrf';
    self.selectedServer = '';

    //error fields
    self.errorTypeID    = 'app-servers-create-type-error';
    self.errorServerID  = 'app-servers-create-server-error';

    self.checkDuplicate = true;

    self.init = function()
    {
        AppServersSite.activeView = 'CREATE';
        $(self.containerID).setStyle('display', 'block');
        $(self.searchModalContainerID).grab($(self.searchModal.modalID), 'top');
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        
        // clear errors
        $(self.errorTypeID).set('html', 'Please chooose a server type');
        $(self.errorTypeID).setStyle('display', 'block');

        // clear fields
        $(self.fieldTypeID).value = '';
        $(self.fieldServerID).value = '';
        $(self.fieldPathID).value = '';
        $(self.fieldLogID).value = '';
        self.selectedServer = '';
        $(self.createMoreID).setStyle('display', 'none');
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'application_id'    : application_id,
                'server_type'       : $(self.fieldTypeID).value,
                'server_id'         : self.selectedServer,
                'application_path'  : $(self.fieldPathID).value,
                'application_log'   : $(self.fieldLogID).value,
                'check_duplicate'   : self.checkDuplicate
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
                            if (msg[0] == 'DUPLICATE_ERROR') {
                                new ConfirmModal(
                                    'Confirm Add',
                                    msg[1]+'<br>Do you want to proceed?',
                                    'Add',
                                    function(){
                                        self.checkDuplicate = false;
                                        self.postAjaxData();   
                                    })
                                .show();
                            } else if (msg[0] == 'SERVER_ERROR') {
                                $(self.errorServerID).set('html', msg[1]);
                                $(self.errorServerID).setStyle('display', 'block');
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
        // SERVER FIELD
        $(self.fieldServerID).removeEvents();
        $(self.fieldServerID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();
            var servertype = $(self.fieldTypeID).value;

            if (['PRODUCTION', 'DEVELOPMENT', 'STAGING'].contains(servertype)) {
                self.searchModal = new AppServersSearchModal(servertype, self.setSelectedServer);
                self.searchModal.show(); 
            } else {
                $(self.fieldServerID).set('disabled', true);
            }
        });

        // CREATE BUTTON EVENT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorTypeID).setStyle('display', 'none');
            $(self.errorServerID).setStyle('display', 'none');

            if ($(self.fieldTypeID).value == '') {
                $(self.errorTypeID).set('html', 'Please chooose a server type');
                $(self.errorTypeID).setStyle('display', 'block');
            } else {
                self.postAjaxData();
            }
        });

        // CANCEL BUTTON EVENT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            AppServersSite.initObj(application_id);
        });

        // ADVANCED SEARCH BUTTON
        $(self.listButtonID).removeEvents();
        $(self.listButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var servertype = $(self.fieldTypeID).value;

            if (['PRODUCTION', 'DEVELOPMENT', 'STAGING'].contains(servertype)) {
                self.listModal = new AppServersListModal(servertype, self.setSelectedServer);
                self.searchModal.closeModal();
                self.listModal.show();
            } else {
                $(self.fieldServerID).set('disabled', true);
            }
        });

        // SELECT SERVER TYPE DROPDOWN
        $(self.fieldTypeID).removeEvents();
        $(self.fieldTypeID).addEvent('change', function(e)
        {
            e.preventDefault();
            var servertype = this.getElement(':selected').value;

            $(self.fieldServerID).value = '';
            self.searchModal.closeModal();
            if (['PRODUCTION', 'DEVELOPMENT', 'STAGING'].contains(servertype)) {
                $(self.createMoreID).setStyle('display', 'block');
                $(self.fieldServerID).set('disabled', false);
                $(self.errorTypeID).setStyle('display', 'none');
                $(self.errorServerID).setStyle('display', 'none');
                self.selectedServer = '';
            } else {
                $(self.createMoreID).setStyle('display', 'none');
                $(self.fieldServerID).set('disabled', true);
                self.selectedServer = '';
            }
        });

        self.setSelectedServer = function(server) {
            $(self.fieldServerID).value = server['name'];
            self.selectedServer = server['server_id'];
            $(self.errorServerID).setStyle('display', 'none');
        }
    }
}

var AppServersView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applicationservers/delete';
    self._request = null;

    self.containerID        = 'app-servers-view';
    self.detailsContainerID = 'app-servers-view-details-container';

    //fields
    self.fieldNameID        = 'app-servers-view-name';
    self.fieldTypeID        = 'app-servers-view-type';
    self.fieldPrivateID     = 'app-servers-view-private';
    self.fieldPublicID      = 'app-servers-view-public';
    self.fieldHostID        = 'app-servers-view-host';
    self.fieldNetworkID     = 'app-servers-view-network';
    self.fieldPathID        = 'app-servers-view-path';
    self.fieldLogID         = 'app-servers-view-log';
    self.fieldCreatedID     = 'app-servers-view-created';
    self.fieldCreatedByID   = 'app-servers-view-createdby';
    self.fieldUpdatedID     = 'app-servers-view-updated';
    self.fieldUpdatedByID   = 'app-servers-view-updatedby';
    self.csrfID             = 'app-servers-view-csrf';

    self._isDetailsShown    = false;

    //buttons
    self.editButtonID       = 'app-servers-edit-button';
    self.deleteButtonID     = 'app-servers-delete-button';
    self.backButtonID       = 'app-servers-view-back-button';
    self.detailsButtonID    = 'app-servers-view-details-button';

    self.init = function()
    {
        AppServersSite.activeView = 'VIEW';
        $(self.containerID).setStyle('display', 'block');
        
        $(self.detailsContainerID).setStyle('display', 'none');
        self._isDetailsShown = false;

        self.renderData();
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        $(self.detailsContainerID).setStyle('display', 'none');
        $(self.detailsButtonID).set('html', '[server details]');
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'application_id'    : data['application_id'],
                'server_id'         : data['server_id'],
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
        // format display data
        var createdby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['created_by']);
        var updatedby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);

        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldTypeID).set('html', data['server_type']);
        $(self.fieldPrivateID).set('html', ((data['private_ip'] == null)? 'NONE': data['private_ip']));
        $(self.fieldPublicID).set('html', ((data['public_ip'] == null)? 'NONE': data['public_ip']));
        $(self.fieldHostID).set('html', data['hostname']);
        $(self.fieldNetworkID).set('html', data['network']);
        $(self.fieldPathID).set('html', data['application_path']);
        $(self.fieldLogID).set('html', data['application_log']);
        $(self.fieldCreatedID).set('html', created);
        $(self.fieldUpdatedID).set('html', updated);
        $(self.fieldCreatedByID).set('html', (createdby == null)? data['created_by'] : createdby);
        $(self.fieldUpdatedByID).set('html', (updatedby == null)? data['updated_by'] : updatedby);
    }

    self.addEvents = function()
    {
        // EDIT APP SERVER
        $(self.editButtonID).removeEvents()
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            AppServersSite.initEdit(data);
        });

        // VIEW SERVER DETAILS
        $(self.detailsButtonID).removeEvents();
        $(self.detailsButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (self._isDetailsShown) {
                $(self.detailsContainerID).setStyle('display', 'none');
                self._isDetailsShown = false;
                $(self.detailsButtonID).set('html', '[server details]');
            } else {
                $(self.detailsContainerID).setStyle('display', 'block');
                self._isDetailsShown = true;
                $(self.detailsButtonID).set('html', '[hide details]');
            }
        });

        // DELETE APP SERVER
        $(self.deleteButtonID).removeEvents()
        $(self.deleteButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            new ConfirmModal(
                'Confirm Delete',
                'Are you sure you want to delete this server from the list?',
                'Delete',
                self.postAjaxData)
            .show();
        });

        // BACK TO LIST BUTTON
        $(self.backButtonID).removeEvents();
        $(self.backButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            AppServersSite.initObj(data['application_id']);
        });
    }
}

var AppServersEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applicationservers/update';
    self._request = null;

    self.containerID    = 'app-servers-edit';

    //fields
    self.fieldServerID  = 'app-servers-edit-server';
    self.fieldPathID    = 'app-servers-edit-path';
    self.fieldLogID     = 'app-servers-edit-log';
    self.csrfID    = 'app-servers-edit-csrf';

    //buttons
    self.cancelButtonID = 'app-servers-edit-cancel-button';
    self.saveButtonID   = 'app-servers-edit-save-button';

    self.init = function()
    {
        AppServersSite.activeView = 'EDIT';
        $(self.containerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        // clear form
        $(self.fieldServerID).set('html', '');
        $(self.fieldPathID).value = '';
        $(self.fieldLogID).value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':   $(self.csrfID).value,
                'application_id':   data['application_id'],
                'server_id':        data['server_id'],
                'application_path': $(self.fieldPathID).value.trim(),
                'application_log' : $(self.fieldLogID).value.trim()
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
                        console.log(response['data']);
                    } else if (response['type'] == 'success') {
                        data['application_path']    = response['data']['application_path'];
                        data['application_log']     = response['data']['application_log'];
                        data['date_updated']        = response['data']['date_updated'];
                        data['updated_by']          = response['data']['updated_by'];

                        $(self.cancelButtonID).click();
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
        $(self.fieldServerID).set('html', data['name']);
        $(self.fieldPathID).value = data['application_path'];
        $(self.fieldLogID).value = data['application_log'];
    }

    self.addEvents = function()
    {
        // SAVE BUTTON
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        // CANCEL BUTTON EVENT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            AppServersSite.initView(data);
        });
    }
}

var AppServersSite = {
    mainObj: null,
    createObj: null,
    editObj: null,
    viewObj: null,

    activeView: '',

    init: function(application_id)
    {
        var self = this;
        self.initObj(application_id);
    },

    initObj: function(application_id)
    {
        var self = this;
        self.closeActive();
        self.mainObj = new AppServersList(application_id);
        self.mainObj.init();
    },

    initCreate: function(application_id)
    {
        var self = this;
        self.closeActive();
        self.createObj = new AppServersCreate(application_id);
        self.createObj.init();
    },

    initEdit: function(data)
    {
        var self = this;
        self.closeActive();
        self.editObj = new AppServersEdit(data);
        self.editObj.init();
    },

    initView: function(data)
    {
        var self = this;
        self.closeActive();
        self.viewObj = new AppServersView(data);
        self.viewObj.init();
    },

    closeActive: function()
    {
        var self = this;
        switch (self.activeView) {
            case 'LIST':
                if (self.mainObj != null)
                    self.mainObj.hide();
                break;
            case 'CREATE':
                if (self.createObj != null)
                    self.createObj.hide();
                break;
            case 'VIEW':
                if (self.viewObj != null)
                    self.viewObj.hide();
                break;
            case 'EDIT':
                if (self.editObj != null)
                    self.editObj.hide();
                break;
        }
        self.activeView = '';
    }
}