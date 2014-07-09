var ServersList = function()
{
    var self            = this;
    self.containerID    = 'servers-list';

    //for pagination
    self.prevID         = 'servers-list-prev';
    self.nextID         = 'servers-list-next';
    self.totalDataID    = 'servers-list-total';
    self.totalPartID    = 'servers-list-part';

    //for table
    self.tableID        = 'servers-list-table';
    self.resultData     = [];
    self.lookupData     = new Hash();
    self.tableRowClass  = 'servers-list-row';

    //fields
    self.fieldNameID    = 'servers-list-search-name';
    self.fieldTypeID    = 'servers-list-search-type';
    self.fieldPublicID  = 'servers-list-search-public';
    self.fieldPrivateID = 'servers-list-search-private';
    self.fieldNetworkID = 'servers-list-search-network';
    self.csrfID         = 'servers-list-csrf';

    //buttons
    self.createButtonID = 'servers-list-create-button';
    self.viewButtonID   = 'tr[id^=servers-list-view_]';
    self.searchButtonID = 'servers-list-search-button';
    self.clearButtonID  = 'servers-list-clear-button';

    self.init = function()
    {
        console.log('list inited');
        ServersSite.activeView = 'LIST';
        ServersData.getAjaxData({
            'page'      : ServersSite.searchParams['page'],
            'name'      : ServersSite.searchParams['name'],
            'type'      : ServersSite.searchParams['type'],
            'public_ip' : ServersSite.searchParams['public_ip'],
            'private_ip': ServersSite.searchParams['private_ip'],
            'network'   : ServersSite.searchParams['network'],
            'YII_CSRF_TOKEN': $(self.csrfID).value,
        }, self.getData, function(){});
        
        $(ServersSite.titleID).set('html', 'Servers');
        $$('.'+self.tableRowClass).dispose();
        $(self.containerID).setStyle('display', 'block');

        $(self.fieldNameID).value       = ServersSite.searchParams['name'];
        $(self.fieldTypeID).value       = ServersSite.searchParams['type'];
        $(self.fieldPublicID).value     = ServersSite.searchParams['public_ip'];
        $(self.fieldPrivateID).value    = ServersSite.searchParams['private_ip'];
        $(self.fieldNetworkID).value    = ServersSite.searchParams['network'];
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        $(self.fieldNameID).value = '';
        $(self.fieldTypeID).value = '';
        $(self.fieldPublicID).value = '';
        $(self.fieldPrivateID).value = '';
        $(self.fieldNetworkID).value = '';
        $$('.'+self.tableRowClass).dispose();
    }

    self.getData = function(data)
    {
        self.currentPage = data.page;
        self.totalPage = data.totalPage;
        self.resultData = data.resultData;
        self.pageLimit = data.limit;

        self.renderData(data.totalData);
        self.addEvents();
        self.paginationChecker();
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
    }

    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            self.lookupData = new Hash();
            Array.each(self.resultData, function(val, idx)
            {
                self.lookupData.include(val['server_id'], idx);
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['server_type']+'</td>'                        
                            + '<td>'+((val['public_ip'] == null)? '' : val['public_ip'])+'</td>'
                            + '<td>'+((val['private_ip'] == null)? '' : val['private_ip'])+'</td>'
                            + '<td>'+val['network']+'</td><td></td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'servers-list-view_'+val['server_id']
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
                'html'  : contentHTML,
            });

            contentElem.inject($(self.tableID), 'bottom');
        }
    }

    self.makeView = function(sid)
    {
        if (typeof sid==='number' && (sid%1)===0 && self.lookupData.has(sid)) {
            console.log('data is from list');
            ServersSite.initView(self.resultData[self.lookupData.get(sid)]);
            return true;
        } else {
            return false;
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
                ServersSite.historyMngr.set('search', {
                    'page'      : ServersSite.searchParams['page']+1,
                    'name'      : ServersSite.searchParams['name'],
                    'type'      : ServersSite.searchParams['type'],
                    'public_ip' : ServersSite.searchParams['public_ip'],
                    'private_ip': ServersSite.searchParams['private_ip'],
                    'network'   : ServersSite.searchParams['network'],
                });
            }
        });
        
        //EVENT FOR PREVIOUS PAGE
        $(self.prevID).removeEvents();
        $(self.prevID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != 1) {
                ServersSite.historyMngr.set('search', {
                    'page'      : ServersSite.searchParams['page']-1,
                    'name'      : ServersSite.searchParams['name'],
                    'type'      : ServersSite.searchParams['type'],
                    'public_ip' : ServersSite.searchParams['public_ip'],
                    'private_ip': ServersSite.searchParams['private_ip'],
                    'network'   : ServersSite.searchParams['network'],
                });
            }
        });

        //EVENT FOR SEARCH BUTTON
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ServersSite.historyMngr.set('search', {
                'page'      : 1,
                'name'      : $(self.fieldNameID).value.trim(),
                'type'      : $(self.fieldTypeID).value.trim(),
                'public_ip' : $(self.fieldPublicID).value.trim(),
                'private_ip': $(self.fieldPrivateID).value.trim(),
                'network'   : $(self.fieldNetworkID).value.trim(),

            });
        });

        //EVENT FOR CLEAR SEARCH FIELDS
        $(self.clearButtonID).removeEvents();
        $(self.clearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.fieldNameID).value = '';
            $(self.fieldTypeID).value = '';
            $(self.fieldPublicID).value = '';
            $(self.fieldPrivateID).value = '';
            $(self.fieldNetworkID).value = '';
        });

        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e) {
            e.preventDefault();
            var sid = parseInt($(this).get('id').split('_')[1]);
            if (typeof sid==='number' && (sid%1)===0 && self.lookupData.has(sid)) {
                ServersSite.historyMngr.set('sid', sid);
            }
        });

        //EVENT FOR CREATING A NEW PROJECT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ServersSite.initCreate();
        });
    };
}

var ServersCreate = function()
{
    var self = this;
    self._request = null;
    self.postDataURL = baseURL + '/servers/create';

    self.containerID = 'servers-create';

    // fields
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

    // errors
    self.errorNameID        = 'servers-create-name-error';
    self.errorTypeID        = 'servers-create-type-error';
    self.errorNetworkID     = 'servers-create-network-error';
    self.errorPublicID      = 'servers-create-public-error';
    self.errorPrivateID     = 'servers-create-private-error';    

    //buttons
    self.cancelButtonID     = 'servers-create-cancel-button';
    self.confirmButtonID    = 'servers-create-save-button';

    self.datePickerProd     = null;
    self.datePickerTerm     = null;

    self.init = function()
    {
        ServersSite.activeView = 'CREATE';
        self.datePickerProd = new DatePicker($(self.fieldProductionID), {
            allowEmpty: true,
            timePicker: false,
            pickerClass: 'datepicker_vista',
            positionOffset: {x: 380, y:-40},
            format: 'M j, Y',
            inputOutputFormat: 'Y-m-d',
        });

        self.datePickerTerm = new DatePicker($(self.fieldTerminationID), {
            allowEmpty: true,
            timePicker: false,
            pickerClass: 'datepicker_vista',
            positionOffset: {x: 380, y:-40},
            format: 'M j, Y',
            inputOutputFormat: 'Y-m-d',
        });

        $(ServersSite.titleID).set('html', 'Projects');
        $(self.containerID).setStyle('display', 'block');
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        //clear errors
        $(self.errorNameID).setStyle('display', 'none');
        $(self.errorTypeID).setStyle('display', 'none');
        $(self.errorNetworkID).setStyle('display', 'none');
        $(self.errorPublicID).setStyle('display', 'none');
        $(self.errorPrivateID).setStyle('display', 'none');

        //clear fields
        $(self.fieldNameID).value = '';
        $(self.fieldTypeID).value = '';
        $(self.fieldHostID).value = '';
        $(self.fieldPublicID).value = '';
        $(self.fieldPrivateID).value = '';
        $(self.fieldNetworkID).value = '';
        $(self.fieldLocationID).value = '';
        $(self.fieldDescriptionID).value = '';
        $(self.fieldProductionID).value = '';
        $(self.fieldTerminationID).value = '';
        $(self.fieldProductionID).getNext().value = '';
        $(self.fieldTerminationID).getNext().value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'name'              : $(self.fieldNameID).value,
                'server_type'       : $(self.fieldTypeID).value,
                'hostname'          : $(self.fieldHostID).value,
                'public_ip'         : $(self.fieldPublicID).value,
                'private_ip'        : $(self.fieldPrivateID).value,
                'network'           : $(self.fieldNetworkID).value,
                'location'          : $(self.fieldLocationID).value,
                'description'       : $(self.fieldDescriptionID).value,
                'production_date'   : $(self.fieldProductionID).value,
                'termination_date'  : $(self.fieldTerminationID).value
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
                            if (msg[0] == 'NAME_ERROR') {
                                $(self.errorNameID).set('html', msg[1]);
                                $(self.errorNameID).setStyle('display', 'block');
                            } else if (msg[0] == 'NETWORK_ERROR') {
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
        // CREATE BUTTON EVENT
        $(self.confirmButtonID).removeEvents()
        $(self.confirmButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorNetworkID).setStyle('display', 'none');
            $(self.errorTypeID).setStyle('display', 'none');
            $(self.errorPrivateID).setStyle('display', 'none');
            $(self.errorPublicID).setStyle('display', 'none');
            self.postAjaxData();
        });

        // CANCEL BUTTON EVENT
        $(self.cancelButtonID).removeEvents()
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ServersSite.initObj();
        });

        //EVENT FOR CHOOSE PRODUCTION DATE
        $(self.fieldProductionID).removeEvents();
        $(self.fieldProductionID).addEvent('focus', function(e) 
        {
            e.preventDefault();
            $(this).blur();
            self.datePickerProd.show();
        });

        //EVENT FOR CHOOSE TERMINATION DATE
        $(self.fieldTerminationID).removeEvents();
        $(self.fieldTerminationID).addEvent('focus', function(e) 
        {
            e.preventDefault();
            $(this).blur();
            self.datePickerTerm.show();
        });
    }
}

var ServersView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/servers/delete';
    self._request = null;

    self.containerID            = 'servers-view';

    //fields
    self.fieldIdentifierID      = 'servers-view-id';
    self.fieldNameID            = 'servers-view-name';
    self.fieldTypeID            = 'servers-view-type';
    self.fieldHostID            = 'servers-view-host';
    self.fieldPublicID          = 'servers-view-public';
    self.fieldPrivateID         = 'servers-view-private';
    self.fieldNetworkID         = 'servers-view-network';
    self.fieldLocationID        = 'servers-view-location';
    self.fieldDescriptionID     = 'servers-view-description';
    self.fieldProductionID      = 'servers-view-production';
    self.fieldTerminationID     = 'servers-view-termination';
    self.fieldCreatedID         = 'servers-view-created';
    self.fieldCreatedByID       = 'servers-view-createdby';
    self.fieldUpdatedID         = 'servers-view-updated';
    self.fieldUpdatedByID       = 'servers-view-updatedby';
    self.csrfID                 = 'servers-view-csrf';

    //buttons
    self.backButtonID           = 'servers-view-back-button';
    self.editButtonID           = 'servers-view-edit-button';
    self.deleteButtonID         = 'servers-view-delete-button';

    self.init = function()
    {
        ServersSite.activeView = 'VIEW';
        $(ServersSite.titleID).set('html', 'Servers/'+data['name']);
        $(self.containerID).setStyle('display', 'block');

        self.renderData();
        self.addEvents();
        ServerAppsSite.init(data['server_id']);
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        ServerAppsSite.closeActive();
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
    };

    self.renderData = function()
    {
        // format display data
        var createdby = LDAPUsersData.get(data['created_by']);
        var updatedby = LDAPUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);
        var termination = (data['termination_date'] == null || data['termination_date'] == '0000-00-00' || data['termination_date'] == '')? '' : DateFormatter.formatDate(data['termination_date']);
        var production = (data['production_date'] == null || data['production_date'] == '0000-00-00' || data['production_date'] == '')? '' : DateFormatter.formatDate(data['production_date']);

        $(self.fieldIdentifierID).set('html', data['server_id']);
        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldTypeID).set('html', data['server_type']);
        $(self.fieldHostID).set('html', data['hostname']);
        $(self.fieldPublicID).set('html', data['public_ip']);
        $(self.fieldPrivateID).set('html', data['private_ip']);
        $(self.fieldNetworkID).set('html', data['network']);
        $(self.fieldLocationID).set('html', data['location']);
        new ReadMore(self.fieldDescriptionID, data['description']).renderData();
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
            ServersSite.historyMngr.remove('sid');
        });

        //EVENT FOR EDITING A PROJECT
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ServersSite.initEdit(data);
        });

        //EVENT FOR DELETING A PROJECT
        $(self.deleteButtonID).removeEvents();
        $(self.deleteButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            new ConfirmModal(
                'Confirm Delete', 
                'Are you sure you want to delete this server?', 
                'Delete', 
                self.postAjaxData)
            .show();
        });
    }
}

var ServersEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/servers/update';
    self._request = null;

    self.containerID        = 'servers-edit';

    // fields
    self.fieldNameID        = 'servers-edit-name';
    self.fieldTypeID        = 'servers-edit-type';
    self.fieldHostID        = 'servers-edit-host';
    self.fieldPublicID      = 'servers-edit-public';
    self.fieldPrivateID     = 'servers-edit-private';
    self.fieldNetworkID     = 'servers-edit-network';
    self.fieldLocationID    = 'servers-edit-location';
    self.fieldDescriptionID = 'servers-edit-description';
    self.fieldProductionID  = 'servers-edit-production';
    self.fieldTerminationID = 'servers-edit-termination';
    self.csrfID             = 'servers-edit-csrf';

    // errors
    self.errorNameID        = 'servers-edit-name-error';
    self.errorTypeID        = 'servers-edit-type-error';
    self.errorNetworkID     = 'servers-edit-network-error';
    self.errorPublicID      = 'servers-edit-public-error';
    self.errorPrivateID     = 'servers-edit-private-error';    

    //buttons
    self.cancelButtonID     = 'servers-edit-cancel-button';
    self.saveButtonID    = 'servers-edit-save-button';

    self.datePickerProd     = null;
    self.datePickerTerm     = null;

    self.init = function()
    {
        ServersSite.activeView = 'EDIT';
        self.datePickerProd = new DatePicker($(self.fieldProductionID), {
            allowEmpty: true,
            timePicker: false,
            pickerClass: 'datepicker_vista',
            positionOffset: {x: 380, y:-40},
            format: 'M j, Y',
            inputOutputFormat: 'Y-m-d',
        });

        self.datePickerTerm = new DatePicker($(self.fieldTerminationID), {
            allowEmpty: true,
            timePicker: false,
            pickerClass: 'datepicker_vista',
            positionOffset: {x: 380, y:-40},
            format: 'M j, Y',
            inputOutputFormat: 'Y-m-d',
        });

        $(ServersSite.titleID).set('html', 'Servers');
        $(self.containerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        //clear errors
        $(self.errorNameID).setStyle('display', 'none');
        $(self.errorTypeID).setStyle('display', 'none');
        $(self.errorNetworkID).setStyle('display', 'none');
        $(self.errorPublicID).setStyle('display', 'none');
        $(self.errorPrivateID).setStyle('display', 'none');

        //clear fields
        $(self.fieldNameID).value = '';
        $(self.fieldTypeID).value = '';
        $(self.fieldHostID).value = '';
        $(self.fieldPublicID).value = '';
        $(self.fieldPrivateID).value = '';
        $(self.fieldNetworkID).value = '';
        $(self.fieldLocationID).value = '';
        $(self.fieldDescriptionID).value = '';
        $(self.fieldProductionID).value = '';
        $(self.fieldTerminationID).value = '';
        $(self.fieldProductionID).getNext().value = '';
        $(self.fieldTerminationID).getNext().value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'server_id'         : data['server_id'],
                'name'              : $(self.fieldNameID).value,
                'server_type'       : $(self.fieldTypeID).value,
                'hostname'          : $(self.fieldHostID).value,
                'public_ip'         : $(self.fieldPublicID).value,
                'private_ip'        : $(self.fieldPrivateID).value,
                'network'           : $(self.fieldNetworkID).value,
                'location'          : $(self.fieldLocationID).value,
                'description'       : $(self.fieldDescriptionID).value,
                'production_date'   : $(self.fieldProductionID).value,
                'termination_date'  : $(self.fieldTerminationID).value
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess' : function(response)
                {
                    if (response['type'] == 'error') {
                        self._request.stop;
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'NAME_ERROR') {
                                $(self.errorNameID).set('html', msg[1]);
                                $(self.errorNameID).setStyle('display', 'block');
                            } else if (msg[0] == 'NETWORK_ERROR') {
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

                    } else if (response['type'] == 'success') {
                        data['name']            = response['data']['name'];
                        data['server_type']     = response['data']['server_type'];
                        data['hostname']        = response['data']['hostname'];
                        data['public_ip']       = response['data']['public_ip'];
                        data['private_ip']      = response['data']['private_ip'];
                        data['network']         = response['data']['network'];
                        data['location']        = response['data']['location'];
                        data['description']     = response['data']['description'];
                        data['production_date'] = response['data']['production_date'];
                        data['termination_date']= response['data']['termination_date'];
                        data['updated_by']      = response['data']['updated_by'];
                        data['date_updated']    = response['data']['date_updated'];

                        $(self.cancelButtonID).click();
                    }
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                }
            }).send();
        }
    };

    self.renderData = function()
    {
        $(self.fieldNameID).value = data['name'].replace(/&lt/g, '<');
        $(self.fieldTypeID).value = data['code'];
        $(self.fieldHostID).value = (data['hostname'] == null)? '' : data['hostname'].replace(/&lt/g, '<');
        $(self.fieldPublicID).value = (data['public_ip'] == null)? '' : data['public_ip'].replace(/&lt/g, '<');
        $(self.fieldPrivateID).value = (data['private_ip'] == null)? '' : data['private_ip'].replace(/&lt/g, '<');
        $(self.fieldNetworkID).value = data['network'].replace(/&lt/g, '<');
        $(self.fieldLocationID).value = (data['location'] == null)? '' : data['location'].replace(/&lt/g, '<');
        $(self.fieldDescriptionID).value = (data['description'] == null)? '' : data['description'].replace(/&lt/g, '<');

        if ([null, '0000-00-00', ''].contains(data['production_date'])) {
            $(self.fieldProductionID).value = '';
            $(self.fieldProductionID).getNext().value = '';
        } else {
            $(self.fieldProductionID).value = data['production_date'];
            $(self.fieldProductionID).getNext().value = DateFormatter.formatDate(data['production_date']);
        }

        if ([null, '0000-00-00', ''].contains(data['termination_date'])) {
            $(self.fieldTerminationID).value = '';
            $(self.fieldTerminationID).getNext().value = '';
        } else {
            $(self.fieldTerminationID).value = data['termination_date'];
            $(self.fieldTerminationID).getNext().value = DateFormatter.formatDate(data['termination_date']);
        }
    }

    self.addEvents = function()
    {
        //EVENT FOR SAVING CHANGES BUTTON IN EDIT PROJECT
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorNetworkID).setStyle('display', 'none');
            $(self.errorTypeID).setStyle('display', 'none');
            $(self.errorPrivateID).setStyle('display', 'none');
            $(self.errorPublicID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT PROJECT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ServersSite.initView(data);

            //clear form
            $(self.fieldNameID).value = '';
            $(self.fieldTypeID).value = '';
            $(self.fieldHostID).value = '';
            $(self.fieldPublicID).value = '';
            $(self.fieldPrivateID).value = '';
            $(self.fieldNetworkID).value = '';
            $(self.fieldLocationID).value = '';
            $(self.fieldDescriptionID).value = '';
            $(self.fieldLocationID).value = '';
            $(self.fieldProductionID).value = '0000-00-00';
            $(self.fieldTerminationID).value = '0000-00-00';
        });

        //EVENT FOR CHOOSE PRODUCTION DATE
        $(self.fieldProductionID).removeEvents();
        $(self.fieldProductionID).addEvent('focus', function(e) 
        {
            e.preventDefault();
            $(this).blur();
            self.datePickerProd.show();
        });

        //EVENT FOR CHOOSE TERMINATION DATE
        $(self.fieldTerminationID).removeEvents();
        $(self.fieldTerminationID).addEvent('focus', function(e) 
        {
            e.preventDefault();
            $(this).blur();
            self.datePickerTerm.show();
        });
    }
}

var ServersSite = {
    titleID         : 'servers-title',
    csrfID          : 'servers-csrf',
    mainObj         : new ServersList(),
    createObj       : new ServersCreate(),
    editObj         : null,
    viewObj         : null,
    // some more variables
    activeView      : '',
    historyMngr     : new HistoryManager(),
    searchParams    : {
        'page'      : 1,
        'name'      : '',
        'type'      : '',
        'public_ip' : '',
        'private_ip': '',
        'network'   : '',
    },
    processChange   : true,     //allow or prevent prevent action on hash change in search

    init: function()
    {
        var self = this;
        LDAPUsersData.init($(self.csrfID).value);
        LDAPGroupsData.init($(self.csrfID).value);
        AppTypesData.init($(self.csrfID).value);
        AppServersData.init($(self.csrfID).value);

        self.historyMngr.start();
        self.addEvents();

        hash = self.historyMngr.deserializeHash(self.historyMngr.getHash());
        if (hash == null || Object.keys(hash).length == 0) {
            console.log('no hash');
            self.historyMngr.set('search', self.searchParams);
        }
    },

    initObj: function()
    {
        var self = this;
        self.closeActive();
        self.mainObj.init();
    },

    initCreate: function()
    {
        var self = this;
        self.closeActive();
        self.createObj.init();
    },

    initEdit: function(data)
    {
        var self = this;
        self.closeActive();
        self.editObj = new ServersEdit(data)
        self.editObj.init();
    },

    initView: function(data)
    {
        var self = this;
        self.closeActive();
        self.viewObj = new ServersView(data)
        self.viewObj.init();
    },

    addEvents: function()
    {
        var self = this;
        var processSID = function(new_value)
        {
            var sid = parseInt(new_value);
            // if project info is not yet retrieved
            if (!self.mainObj.makeView(sid)) {
                console.log('retrieve new');
                ServersData.getAjaxData({
                    'server_id': sid,
                    'YII_CSRF_TOKEN': $(self.csrfID).value,
                // on success
                }, function(data) {
                    self.initView(data)
                // on fail
                }, function() {
                    ServersSite.historyMngr.remove('sid');
                });
            }
        }
        self.historyMngr.addEvent('sid:added', processSID);
        self.historyMngr.addEvent('sid:updated', processSID);
        self.historyMngr.addEvent('sid:removed', function(removed)
        {
            self.initObj();
        });

        var processSearch = function(new_value)
        {
            if (self.processChange) {
                hash = self.historyMngr.deserializeHash(self.historyMngr.getHash());
                
                // FIX HASH IF NEEDED
                var hasInvalid = false;
                if (!('page' in hash['search'])) {
                    new_value['page'] = 1;
                    hasInvalid = true;
                } else if ((typeof hash['search']['page']) != "number") {
                    new_value['page'] = 1;
                    hasInvalid = true;
                }
                
                if (!('name' in hash['search'])) {
                    new_value['name'] = '';
                    hasInvalid = true;
                }
                
                if (!('type' in hash['search'])) {
                    new_value['status'] = '';
                    hasInvalid = true;
                } else if (!['', 'DEVELOPMENT', 'STAGING', 'PRODUCTION'].contains(hash['search']['type'])) {
                    new_value['type'] = '';
                    hasInvalid = true;
                }

                if (!('public_ip' in hash['search'])) {
                    new_value['public_ip'] = '';
                    hasInvalid = true;
                }

                if (!('private_ip' in hash['search'])) {
                    new_value['private_ip'] = '';
                    hasInvalid = true;
                }

                self.searchParams = new_value;

                if (hasInvalid) {
                    self.historyMngr.set('search', self.searchParams);
                } else {
                    if (!('sid' in hash)) {
                        self.initObj();
                    } else {
                        console.log('search doing nothing');
                    }
                }
            } else {
                self.processChange = true;
            }
        }
        self.historyMngr.addEvent('search:added', processSearch);
        self.historyMngr.addEvent('search:updated', processSearch);
        self.historyMngr.addEvent('search:removed', function(removed)
        {
            hash = self.historyMngr.deserializeHash(self.historyMngr.getHash());
            self.searchParams = {
                'page'      : 1,
                'name'      : '',
                'type'      : '',
                'public_ip' : '',
                'private_ip': '',
                'network'   : '',
            };
            self.historyMngr.set('search', self.searchParams);
        });
    },

    closeActive: function()
    {
        var self = this;
        switch (self.activeView)
        {
            case 'LIST':
                self.mainObj.hide();
                break;
            case 'CREATE':
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

window.addEvent('domready', function()
{
    ServersSite.init();
});