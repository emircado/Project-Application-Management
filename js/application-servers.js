var AppServersList = function(application_id)
{
    var self = this;
    self.getDataURL = baseURL + '/applicationservers/list';
    self._request = null;

    //container
    self.appserversListID = 'app-servers-list';

    //buttons
    self.viewID = 'a[id^=app-servers-view_]';
    self.createButtonID = 'app-servers-add-button';

    //table
    self.tableID = 'app-servers-table';
    self.tableRowClass = 'app-servers-row';
    self.currentPage = 1;
    self.resultData = [];

    //nav
    self.nextID = 'app-servers-next';
    self.prevID = 'app-servers-prev';
    self.totalDataID = 'app-servers-total';
    self.totalPartID = 'app-servers-part';

    self.init = function()
    {
        $(self.appserversListID).setStyle('display', 'block');
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

    self.renderData = function(count) {
        $$('.'+self.tableRowClass).dispose();
        if (count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            Array.each(self.resultData, function(val, idx)
            {
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['server_type']+'</td>'
                            + '<td class="actions-col two-column">'
                            + '<a id="app-servers-view_' + idx + '" href="#" title="View Server">View</a>&nbsp'
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
            
            contentHTML = '<td>No applications found</td><td></td><td></td>';
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

        // CREATE APP SERVER
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.appserversListID).setStyle('display', 'none');
            AppServersSite.initCreate(application_id);
        });

        // VIEW APP SERVER
        $$(self.viewID).removeEvents();
        $$(self.viewID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.appserversListID).setStyle('display', 'none');
            AppServersSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
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

    // modals
    self.searchModal = new AppServersSearchModal();
    self.listModal = new AppServersListModal();

    //container
    self.createAppServerID = 'create-app-servers-view';
    self.searchModalContainerID = 'create-app-servers-modal-container';
    self.createMoreID = 'create-app-servers-more';

    //fields
    self.createCSRFID = 'create-app-servers-csrf';
    self.createTypeID = 'create-app-servers-type';
    self.createServerID = 'create-app-servers-server';
    self.createPathID = 'create-app-servers-path';
    self.createLogID = 'create-app-servers-log';
    self.selectedServer = '';

    //error fields
    self.createTypeErrorID = 'create-app-servers-type-error';
    self.createServerErrorID = 'create-app-servers-server-error';

    //buttons
    self.createButtonID = 'create-app-servers-add-button';
    self.cancelButtonID = 'create-app-servers-cancel-button';
    self.listButtonID = 'create-app-servers-advanced';

    self.init = function()
    {
        $(self.createAppServerID).setStyle('display', 'block');
        $(self.searchModalContainerID).grab($(self.searchModal.modalID), 'top');
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.createCSRFID).value,
                'application_id'    : application_id,
                'server_id'         : self.selectedServer,
                'application_path'  : $(self.createPathID).value,
                'application_log'   : $(self.createLogID).value
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'success') {
                        console.log(response);
                        $(self.cancelButtonID).click();
                    } else if (response['type'] == 'error') {
                        self._request.stop;         
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'SERVER_ERROR') {
                                $(self.createServerErrorID).set('html', msg[1]);
                                $(self.createServerErrorID).setStyle('display', 'block');
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
        $(self.createServerID).removeEvents();
        $(self.createServerID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();
            var servertype = $(self.createTypeID).value;

            if (['PRODUCTION', 'DEVELOPMENT', 'STAGING'].contains(servertype)) {
                self.searchModal = new AppServersSearchModal(servertype, self.setSelectedServer);
                self.searchModal.show(); 
            } else {
                $(self.createServerID).set('disabled', true);
            }
        });

        // CREATE BUTTON EVENT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.createTypeErrorID).setStyle('display', 'none');
            $(self.createServerErrorID).setStyle('display', 'none');

            if ($(self.createTypeID).value == '') {
                $(self.createTypeErrorID).set('html', 'Please chooose a server type');
                $(self.createTypeErrorID).setStyle('display', 'block');
            } else {
                self.postAjaxData();
            }
        });

        // CANCEL BUTTON EVENT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.createAppServerID).setStyle('display', 'none');
            
            $(self.createTypeID).value = '';
            $(self.createServerID).value = '';
            $(self.createPathID).value = '';
            $(self.createLogID).value = '';
            self.selectedServer = '';
            $(self.createMoreID).setStyle('display', 'none');

            AppServersSite.initObj(application_id);
        });

        // ADVANCED SEARCH BUTTON
        $(self.listButtonID).removeEvents();
        $(self.listButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var servertype = $(self.createTypeID).value;

            if (['PRODUCTION', 'DEVELOPMENT', 'STAGING'].contains(servertype)) {
                self.listModal = new AppServersListModal(servertype, self.setSelectedServer);
                self.searchModal.closeModal();
                self.listModal.show();
            } else {
                $(self.createServerID).set('disabled', true);
            }
        });

        // SELECT SERVER TYPE DROPDOWN
        $(self.createTypeID).removeEvents();
        $(self.createTypeID).addEvent('change', function(e)
        {
            e.preventDefault();
            var servertype = this.getElement(':selected').value;

            $(self.createServerID).value = '';
            self.searchModal.closeModal();
            if (['PRODUCTION', 'DEVELOPMENT', 'STAGING'].contains(servertype)) {
                $(self.createMoreID).setStyle('display', 'block');
                $(self.createServerID).set('disabled', false);
                $(self.createTypeErrorID).setStyle('display', 'none');
                $(self.createServerErrorID).setStyle('display', 'none');
                self.selectedServer = '';
            } else {
                $(self.createMoreID).setStyle('display', 'none');
                $(self.createServerID).set('disabled', true);
                self.selectedServer = '';
            }
        });

        self.setSelectedServer = function(server) {
            $(self.createServerID).value = server['name'];
            self.selectedServer = server['server_id'];
            $(self.createServerErrorID).setStyle('display', 'none');
        }
    }
}

var AppServersView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applicationservers/delete';
    self._request = null;

    //container
    self.viewAppServerID = 'view-app-servers-view';
    self.detailsContainerID = 'view-app-servers-details-container';

    //buttons
    self.editID = 'app-servers-edit-button';
    self.deleteID = 'app-servers-delete-button';
    self.viewToListID = 'view-app-servers-back';
    self.detailsID = 'view-app-servers-details';

    self._isDetailsShown = false;

    //fields
    self.viewNameID = 'view-app-servers-name';
    self.viewTypeID = 'view-app-servers-type';
    self.viewPrivateID = 'view-app-servers-private';
    self.viewPublicID = 'view-app-servers-public';
    self.viewHostID = 'view-app-servers-host';
    self.viewNetworkID = 'view-app-servers-network';
    self.viewPathID = 'view-app-servers-path';
    self.viewLogID = 'view-app-servers-log';
    self.viewCreatedID = 'view-app-servers-created';
    self.viewCreatedByID = 'view-app-servers-createdby';
    self.viewUpdatedID = 'view-app-servers-updated';
    self.viewUpdatedByID = 'view-app-servers-updatedby';
    self.viewCSRFID = 'view-app-servers-csrf';

    self.init = function()
    {
        $(self.viewAppServerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.viewCSRFID).value,
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
        $(self.viewNameID).set('html', data['name']);
        $(self.viewTypeID).set('html', data['server_type']);
        $(self.viewPrivateID).set('html', ((data['private_ip'] == null)? 'NONE': data['private_ip']));
        $(self.viewPublicID).set('html', ((data['public_ip'] == null)? 'NONE': data['public_ip']));
        $(self.viewHostID).set('html', data['hostname']);
        $(self.viewNetworkID).set('html', data['network']);
        $(self.viewPathID).set('html', data['application_path']);
        $(self.viewLogID).set('html', data['application_log']);
        $(self.viewCreatedID).set('html', data['date_created']);
        $(self.viewUpdatedID).set('html', data['date_updated']);
        $(self.viewCreatedByID).set('html', data['created_by']);
        $(self.viewUpdatedByID).set('html', data['updated_by']);
    }

    self.addEvents = function()
    {
        // EDIT APP SERVER
        $(self.editID).removeEvents()
        $(self.editID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewAppServerID).setStyle('display', 'none');
            AppServersSite.initEdit(data);
        });

        // VIEW SERVER DETAILS
        $(self.detailsID).removeEvents();
        $(self.detailsID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (self._isDetailsShown) {
                $(self.detailsContainerID).setStyle('display', 'none');
                self._isDetailsShown = false;
                $(self.detailsID).set('html', '[server details]');
            } else {
                $(self.detailsContainerID).setStyle('display', 'block');
                self._isDetailsShown = true;
                $(self.detailsID).set('html', '[hide details]');
            }
        });

        // DELETE APP SERVER
        $(self.deleteID).removeEvents()
        $(self.deleteID).addEvent('click', function(e)
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
        $(self.viewToListID).removeEvents();
        $(self.viewToListID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewAppServerID).setStyle('display', 'none');
            AppServersSite.initObj(data['application_id']);
        });
    }
}

var AppServersEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applicationservers/update';
    self._request = null;

    // containers
    self.editAppServerID = 'edit-app-servers-view';

    //fields
    self.editServerID = 'edit-app-servers-server';
    self.editPathID = 'edit-app-servers-path';
    self.editLogID = 'edit-app-servers-log';
    self.editCSRFID = 'edit-app-servers-csrf';

    //buttons
    self.cancelButtonID = 'edit-app-servers-cancel-button';
    self.editButtonID = 'edit-app-servers-save-button';

    self.init = function()
    {
        $(self.editAppServerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':   $(self.editCSRFID).value,
                'application_id':   data['application_id'],
                'server_id':        data['server_id'],
                'application_path': $(self.editPathID).value,
                'application_log' : $(self.editLogID).value
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
                        data['application_path']    = params['application_path'];
                        data['application_log']     = params['application_log'];
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
        $(self.editServerID).set('html', data['name']);
        $(self.editPathID).value = data['application_path'];
        $(self.editLogID).value = data['application_log'];
    }

    self.addEvents = function()
    {
        // SAVE BUTTON
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        // CANCEL BUTTON EVENT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.editAppServerID).setStyle('display', 'none');

            // clear form
            $(self.editServerID).set('html', '');
            $(self.editPathID).value = '';
            $(self.editLogID).value = '';

            AppServersSite.initView(data);
        });
    }
}

var AppServersSite = {
    init: function(application_id)
    {
        var self = this;
        self.initObj(application_id);
    },

    initObj: function(application_id)
    {
        new AppServersList(application_id).init();
    },

    initCreate: function(application_id)
    {
        new AppServersCreate(application_id).init();
    },

    initEdit: function(data)
    {
        new AppServersEdit(data).init();
    },

    initView: function(data)
    {
        new AppServersView(data).init();
    }
}