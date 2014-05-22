var ConfirmModal = function(title, message, confirm, onConfirm)
{
    var self = this;

    self.modalID = 'confirmation-modal';
    self.overlayID = 'overlay';
    self.dialogWrapperID = 'dialog-wrapper';

    self.titleID = 'modal-title';
    self.messageID = 'modal-message';
    self.cancelButtonID = 'button-cancel-modal';
    self.confirmButtonID = 'button-confirm-modal';
    self.closeModalID = 'close-modal';

    self.forNoticeID = 'modal-for-server';

    self.show = function()
    {
        $(self.titleID).set('html', title);
        $(self.messageID).set('html', message);
        $(self.confirmButtonID).set('html', confirm);

        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
        $(self.forNoticeID).setStyle('display', 'none');
        self.addEvents();
    }      

    self.closeModal = function()
    {
        $(self.messageID).set('html', 'Confirm Action');
        $(self.messageID).set('html', '');
        $(self.confirmButtonID).set('html', 'Confirm');
        $(self.cancelButtonID).set('html', 'Cancel');
        $(self.modalID).setStyle('display', 'none');
        $(self.overlayID).setStyle('display', 'none');
        $(self.dialogWrapperID).setStyle('display', 'none');
    }

    self.addEvents = function()
    {
        //FOR CANCEL
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
        });

        //FOR CLOSE
        $(self.closeModalID).removeEvents();
        $(self.closeModalID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
        });

        //FOR CONFIRM
        $(self.confirmButtonID).removeEvents();
        $(self.confirmButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            onConfirm();
            self.closeModal();
        });
    }
}

var ApplicationTypesModal = function(onConfirm)
{
    var self = this;
    self._request = null;
    self.postDataURL = baseURL + '/applicationtypes/create';
    
    self.modalID = 'application-type-modal';
    self.inputID = 'application-type-input';
    self.tableID = 'application-type-table';
    self.tableRowClass = 'application-type-row';
    self.csrfID = 'application-type-modal-csrf';

    self.cancelButtonID = 'application-type-modal-cancel-button';
    self.confirmButtonID = 'application-type-modal-confirm-button';

    self.tableRowID = 'tr[id^=type_]';
    self.rowSelected = '';
    self.choices = ProjectsSite.appTypesObj.appTypes;

    self.show = function()
    {
        $(self.modalID).setStyle('display', 'block');
        self.filterChoices();
    }

    self.closeModal = function()
    {
        self.rowSelected = '';
        $(self.inputID).value = '';
        $$('.'+self.tableRowClass).dispose();
        $(self.modalID).setStyle('display', 'none');
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'name'              : $(self.inputID).value
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'success') {
                        var entry = response['data'];
                        ProjectsSite.appTypesObj.appTypes.set(entry['name'], entry['type_id']);
                    } else if (response['type'] == 'error') {
                        self._request.stop;
                        console.log(response['data']);
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

    self.filterChoices = function()
    {
        $$('.'+self.tableRowClass).dispose();
        filter = $(self.inputID).value;

        if (filter != '') {
            var filtered = {};
            ProjectsSite.appTypesObj.appTypes.each(function(val, idx)
            {
                if (idx.indexOf(filter) == 0) {
                    filtered[idx] = val;
                }
            });

            $(self.confirmButtonID).set('disabled', false); 
            self.choices = new Hash(filtered);
        } else {
            $(self.confirmButtonID).set('disabled', true);
            self.choices = ProjectsSite.appTypesObj.appTypes;
        }
        self.renderData();
    }

    self.renderData = function()
    {
        var inputVal = $(self.inputID).value;
        var inputKey = self.choices.get(inputVal);
        if (inputVal != '' && inputKey == null)
        {
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass+' selected',
                'html'  : '<td>'+inputVal+' <i>(Create)</i></td>',
                'id'    : 'type_create'
            });
            contentElem.inject($(self.tableID), 'bottom');
            self.rowSelected = 'create';
        }

        self.choices.each(function(val, idx)
        {
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : '<td>'+idx+'</td>',
                'id'    : 'type_'+val
            });
            contentElem.inject($(self.tableID), 'bottom');
        });

        if (inputKey != null) {
            self.rowSelected = inputKey;
            $('type_'+inputKey).addClass('selected');
        }

        if (inputVal == '') {
            self.rowSelected = '';
        }
        self.addEvents();
    }

    self.addEvents = function()
    {
        //INPUT EVENTS
        $(self.inputID).removeEvents();
        $(self.inputID).addEvents({
            //must not update on focusout
            focusout: function(e)
            {
                e.preventDefault();
            },
            input: function(e)
            {
                e.preventDefault();
                $(this).value = $(this).value.replace(/[^a-zA-Z0-9\-\_]/gi, '').substr(0,5).toUpperCase();
                self.filterChoices();
            }
        });

        //CANCEL BUTTON EVENT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
        });

        //SELECT BUTTON EVENT
        $(self.confirmButtonID).removeEvents();
        $(self.confirmButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //create type if necessary
            if (self.rowSelected == 'create') {
                self.postAjaxData();
            }
            onConfirm($(self.inputID).value);
            self.closeModal();
        });

        //ROW CLICK EVENT
        $$(self.tableRowID).removeEvents();
        $$(self.tableRowID).addEvent('click', function(e)
        {
            e.preventDefault();
            id = $(this).get('id').split('_')[1];

            //unselect
            if (id == self.rowSelected) {
                $(this).removeClass('selected');
                self.rowSelected = '';
                $(self.inputID).value = '';
                $(self.confirmButtonID).set('disabled', true);
                self.filterChoices();

            //select
            } else {
                if (self.rowSelected != '') {
                    $('type_'+self.rowSelected).removeClass('selected');
                }
                $(this).addClass('selected');
                self.rowSelected = id;
                $(self.inputID).value = (id == 'create')? $(this).getChildren()[0].get('html').split('<i>')[0].trim() : self.choices.indexOf(self.rowSelected);
                $(self.confirmButtonID).set('disabled', false);
            }
        });
    }
}

var AppServersSearchModal = function(server_type, onConfirm)
{
    var self = this;

    self.modalID = 'app-servers-search-modal';

    self.createModal = new AppServersCreateModal();

    // table
    self.tableRowClass = 'app-servers-search-row';
    self.tableID = 'app-servers-search-table';

    self.inputID = 'app-servers-search-input';

    // buttons
    self.cancelButtonID = 'app-servers-search-modal-cancel-button';
    self.confirmButtonID = 'app-servers-search-modal-confirm-button';

    self.tableRowID = 'tr[id^=appserver_]';
    self.rowSelected = '';
    self.choices = ProjectsSite.appServersObj.appServers.get(server_type);

    self.show = function()
    {
        $(self.modalID).setStyle('display', 'block');
        self.filterChoices();
    }

    self.closeModal = function()
    {
        self.rowSelected = '';
        $(self.inputID).value = '';
        $$('.'+self.tableRowClass).dispose();
        $(self.modalID).setStyle('display', 'none');
    }

    self.filterChoices = function()
    {
        $$('.'+self.tableRowClass).dispose();
        filter = $(self.inputID).value;

        if (filter != '') {
            var filtered = [];
            ProjectsSite.appServersObj.appServers.get(server_type).each(function(val)
            {
                if (val['name'].toLowerCase().indexOf(filter.toLowerCase()) == 0) {
                    filtered.include(val);
                }
            });

            $(self.confirmButtonID).set('disabled', false); 
            self.choices = filtered;
        } else {
            $(self.confirmButtonID).set('disabled', true);
            self.choices = ProjectsSite.appServersObj.appServers.get(server_type);
        }
        // sort elements first
        self.choices = self.choices.sort(self.rowComparator);
        self.renderData();
    }

    self.rowComparator = function(a,b) {
        if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
        if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
        return 0;
    }

    self.renderData = function()
    {
        var inputVal = $(self.inputID).value;
        var inputKey = null;

        self.choices.each(function(val, idx){
            if (val['name'].toLowerCase() == inputVal.toLowerCase()) {
                $(self.inputID).value = val['name'];
                inputKey = idx;
                return;
            }
        });

        if (inputVal != '' && inputKey == null)
        {
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass+' selected',
                'html'  : '<td>'+inputVal+' <i>(Create)</i></td>',
                'id'    : 'appserver_create'
            });
            contentElem.inject($(self.tableID), 'bottom');
            self.rowSelected = 'create';
        }


        self.choices.each(function(val, idx)
        {
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : '<td>'+val['name']+'</td>',
                'id'    : 'appserver_'+idx
            });
            contentElem.inject($(self.tableID), 'bottom');
        });

        if (inputKey != null) {
            self.rowSelected = inputKey;
            $('appserver_'+inputKey).addClass('selected');
        }

        if (inputVal == '') {
            self.rowSelected = '';
        }
        self.addEvents();
    }

    self.addEvents = function()
    {
        //INPUT EVENTS
        $(self.inputID).removeEvents();
        $(self.inputID).addEvents({
            //must not update on focusout
            focusout: function(e)
            {
                e.preventDefault();
            },
            input: function(e)
            {
                e.preventDefault();
                $(this).value = $(this).value;
                self.filterChoices();
            }
        });

        // CANCEL BUTTON
        $(self.cancelButtonID).removeEvents()
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
        });

        // CONFIRM BUTTON
        $(self.confirmButtonID).removeEvents();
        $(self.confirmButtonID).addEvent('click', function(e)
        {
            e.preventDefault();

            if (self.rowSelected == 'create') {
                var data = {
                    'server_type': server_type,
                    'name': $(self.inputID).value
                }

                self.createModalID = new AppServersCreateModal(data, self.setNewServer, function(){});
                self.createModalID.show();
            } else {
                onConfirm({
                    'name': self.choices[self.rowSelected]['name'],
                    'server_id': self.choices[self.rowSelected]['server_id']
                });
                self.closeModal();
            }
        });
        
        //ROW CLICK EVENT
        $$(self.tableRowID).removeEvents();
        $$(self.tableRowID).addEvent('click', function(e)
        {
            e.preventDefault();
            idx = $(this).get('id').split('_')[1];

            //unselect
            if (idx == self.rowSelected) {
                $(this).removeClass('selected');
                self.rowSelected = '';
                $(self.inputID).value = '';
                $(self.confirmButtonID).set('disabled', true);
                self.filterChoices();

            //select
            } else {
                if (self.rowSelected != '') {
                    $('appserver_'+self.rowSelected).removeClass('selected');
                }
                $(this).addClass('selected');
                self.rowSelected = idx;
                $(self.inputID).value = (idx == 'create')? $(this).getChildren()[0].get('html').split('<i>')[0].trim() : self.choices[self.rowSelected]['name'];
                $(self.confirmButtonID).set('disabled', false);
            }
        });
    } 

    // callback function
    self.setNewServer = function(new_server)
    {
        $(self.inputID).value = '';
        console.log('filter start');
        self.filterChoices();

        console.log('filter end');
        console.log(self.choices);
        self.choices.each(function(val, idx){
            if (val['server_id'] == new_server['server_id']) {
                console.log('found');
                $('appserver_'+idx).addClass('selected');
                self.rowSelected = idx;
                $(self.inputID).value = val['name'];
                $(self.confirmButtonID).set('disabled', false);
                return;
            }
        });
    }
}

var AppServersListModal = function(server_type, onSelected)
{
    var self = this;

    // modal
    self.modalID = 'app-servers-list-modal';
    self.overlayID = 'overlay';
    self.dialogWrapperID = 'dialog-wrapper';
    self.createModal = new AppServersCreateModal();

    //title
    self.titleID = 'app-servers-list-modal-title';
    self.titles = {
        'PRODUCTION': 'Production',
        'STAGING'   : 'Staging',
        'DEVELOPMENT': 'Development'
    }

    //search fields
    self.searchNameID = 'app-servers-list-modal-name';
    self.searchNetworkID = 'app-servers-list-modal-network';
    self.searchPublicID = 'app-servers-list-modal-public';
    self.searchPrivateID = 'app-servers-list-modal-private';
    self.searchParams = {
        'server_type': server_type,
        'name': '',
        'network': '',
        'public_ip': '',
        'private_ip': ''
    };

    //table
    self.tableID = 'app-servers-list-modal-table';
    self.tableRowClass = 'app-servers-list-modal-row';

    //for pagination
    self.currentPage = 1;
    self.totalPage = 1;
    self.pageLimit = 5;

    self.prevID = 'app-servers-list-modal-prev';
    self.nextID = 'app-servers-list-modal-next';
    self.totalDataID = 'app-servers-list-modal-total';
    self.totalPartID = 'app-servers-list-modal-part';

    // buttons
    self.selectID = 'a[id^=appserverslist-select_]';
    self.closeID = 'app-servers-list-modal-close-button';
    self.searchButtonID = 'app-servers-list-modal-search';
    self.clearButtonID = 'app-servers-list-modal-clear';

    self.choices = ProjectsSite.appServersObj.appServers.get(server_type);

    self.show = function()
    {
        $(self.titleID).set('html', self.titles[server_type]+' Servers');

        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
        self.filterChoices();
    }

    self.closeModal = function()
    {
        $(self.modalID).setStyle('display', 'none');
        $(self.overlayID).setStyle('display', 'none');
        $(self.dialogWrapperID).setStyle('display', 'none');

        $(self.searchNameID).value = '';
        $(self.searchNetworkID).value = '';
        $(self.searchPublicID).value = '';
        $(self.searchPrivateID).value = '';
    }

    self.filterChoices = function()
    {
        self.searchParams['name']       = $(self.searchNameID).value.trim();
        self.searchParams['network']    = $(self.searchNetworkID).value.trim();
        self.searchParams['public_ip']  = $(self.searchPublicID).value.trim();
        self.searchParams['private_ip'] = $(self.searchPrivateID).value.trim();

        if (self.searchParams['name'] == '' && self.searchParams['network'] == '' && self.searchParams['public_ip'] == '' && self.searchParams['private_ip'] == '') {
            self.choices = ProjectsSite.appServersObj.appServers.get(server_type);
        } else {
            var filtered = [];
            ProjectsSite.appServersObj.appServers.get(server_type).each(function(val, idx)
            {
                // filter name
                if (self.searchParams['name'].length > 0 && val['name'].toLowerCase().indexOf(self.searchParams['name'].toLowerCase()) != -1) {
                    // filter network
                    if (self.searchParams['network'].length > 0 && val['network'].toLowerCase().indexOf(self.searchParams['network'].toLowerCase()) != -1) {
                        // filter public ip
                        if (self.searchParams['public_ip'].length > 0 && val['public_ip'].toLowerCase().indexOf(self.searchParams['public_ip'].toLowerCase()) != -1) {
                            // filter private ip
                            if (self.searchParams['private_ip'].length > 0 && val['private_ip'].toLowerCase().indexOf(self.searchParams['private_ip'].toLowerCase()) != -1) {
                                filtered.include(val);
                            }
                        }
                    } 
                }
            });
            self.choices = filtered;
        }

        self.totalPage = Math.ceil(self.choices.length/self.pageLimit);

        // sort elements first
        self.choices = self.choices.sort(self.rowComparator);
        self.renderData();
    }

    self.rowComparator = function(a,b) {
        if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
        if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
        return 0;
    }

    self.renderData = function()
    {
        $$('.'+self.tableRowClass).dispose();
        if (self.choices.length != 0) {
            var start = (self.currentPage-1)*self.pageLimit;
            var end = (start+(self.pageLimit) <= self.choices.length)? start+(self.pageLimit) : self.choices.length;

            $(self.totalPartID).set('html', (start+1)+'-'+end);
            $(self.totalDataID).set('html', ' of '+self.choices.length);

            if (self.currentPage == 1) {
                $(self.prevID).addClass('disable');
            } else {
                $(self.prevID).removeClass('disable');
            }

            if (self.currentPage < self.totalPage) {
                $(self.nextID).removeClass('disable');
            } else {
                $(self.nextID).addClass('disable');
            }

            var toDisplay = self.choices.slice(start, end);

            toDisplay.each(function(val, idx)
            {
                var contentHTML = '<td>'+((val['name'] == null)? '' : val['name'])+'</td>'
                                + '<td>'+((val['network'] == null)? '' : val['network'])+'</td>'
                                + '<td>'+((val['public_ip'] == null)? '' : val['public_ip'])+'</td>'
                                + '<td>'+((val['private_ip'] == null)? '' : val['private_ip'])+'</td>'
                                + '<td><a href="#" id="appserverslist-select_'+(start+idx)+'">Select</a></td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass+' selected',
                    'html'  : contentHTML,
                });
                contentElem.inject($(self.tableID), 'bottom');
            });
        } else {
            $(self.totalPartID).set('html', '');
            $(self.totalDataID).set('html', '');
            $(self.prevID).addClass('disable');
            $(self.nextID).addClass('disable');

            var contentHTML = '<td><b>'+self.searchParams['name']+'</b> <i>(Create)</i></td>'
                + '<td>'+self.searchParams['network']+'</td>'
                + '<td>'+self.searchParams['public_ip']+'</td>'
                + '<td>'+self.searchParams['private_ip']+'</td>'
                + '<td><a href="#" id="appserverslist-select_create">Create</a></td>';

            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass+' selected',
                'html'  : contentHTML,
            });
            contentElem.inject($(self.tableID), 'bottom');
        }

        self.addEvents();
    }

    self.addEvents = function()
    {
        // SELECT SERVER EVENT
        $$(self.selectID).removeEvents()
        $$(self.selectID).addEvent('click', function(e)
        {
            e.preventDefault();
            id = $(this).get('id').split('_')[1];

            if (id == 'create') {
                self.closeModal();
                self.createModal = new AppServersCreateModal(
                    self.searchParams,
                    self.setNewServer,
                    function() {
                        self.show();
                    });
                self.createModal.show();
            } else {
                self.closeModal();
                onSelected({
                    'name': self.choices[id]['name'],
                    'server_id': self.choices[id]['server_id']
                });
            }
        });

        // CLOSE SERVER EVENT
        $(self.closeID).removeEvents();
        $(self.closeID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
        });

        // SEARCH EVENT
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.filterChoices();
        });

        // CLEAR EVENT
        $(self.clearButtonID).removeEvents();
        $(self.clearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.clearTable();
            self.filterChoices();
        });

        // NEXT PAGE
        $(self.nextID).removeEvents();
        $(self.nextID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (self.currentPage != self.totalPage) {
                self.currentPage++;
                self.renderData();
            }
        });

        // PREV PAGE
        $(self.prevID).removeEvents();
        $(self.prevID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (self.currentPage != 1) {
                self.currentPage--;
                self.renderData();
            }
        });
    }

    self.setNewServer = function(new_server)
    {
        self.show();
        console.log(new_server);

        self.clearTable();
        self.filterChoices();
    }

    self.clearTable = function()
    {
        $(self.searchNameID).value = '';
        $(self.searchNetworkID).value = '';
        $(self.searchPublicID).value = '';
        $(self.searchPrivateID).value = '';

        self.searchParams = {
            'server_type': server_type,
            'name': '',
            'network': '',
            'public_ip': '',
            'private_ip': ''
        };

        self.currentPage = 1;
    }
}

var AppServersCreateModal = function(data, onCreate, onCancel)
{
    var self = this;
    self._request = null;
    self.postDataURL = baseURL + '/servers/create';

    self.modalID = 'app-servers-create-modal';
    self.overlayID = 'overlay';
    self.dialogWrapperID = 'dialog-wrapper';

    // fields
    self.createTypeID = 'app-servers-create-modal-type';
    self.createNameID = 'app-servers-create-modal-name';
    self.createHostID = 'app-servers-create-modal-host';
    self.createPublicID = 'app-servers-create-modal-public';
    self.createPrivateID = 'app-servers-create-modal-private';
    self.createNetworkID = 'app-servers-create-modal-network';
    self.createLocationID = 'app-servers-create-modal-location';
    self.createDescriptionID = 'app-servers-create-modal-description';
    self.createProductionID = 'app-servers-create-modal-production';
    self.createTerminationID = 'app-servers-create-modal-termination';
    self.createCSRFID = 'app-servers-create-modal-csrf';

    // errors
    self.createTypeErrorID = 'app-servers-create-modal-type-error';
    self.createNetworkErrorID = 'app-servers-create-modal-network-error';
    self.createPublicErrorID = 'app-servers-create-modal-public-error';
    self.createPrivateErrorID = 'app-servers-create-modal-private-error';    

    //buttons
    self.closeID = 'app-servers-create-modal-close-button';
    self.cancelButtonID = 'app-servers-create-modal-cancel-button';
    self.confirmButtonID = 'app-servers-create-modal-create-button';

    self.show = function()
    {
        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.renderData = function()
    {
        $(self.createTypeID).set('html', data['server_type']);
        $(self.createNameID).value = data['name'];
        $(self.createNetworkID).value = ((data['network'] == null)? '' : data['network']);
        $(self.createPublicID).value = ((data['public_ip'] == null)? '' : data['public_ip']);
        $(self.createPrivateID).value = ((data['private_ip'] == null)? '' : data['private_ip']);
    }

    self.closeModal = function()
    {
        $(self.modalID).setStyle('display', 'none');
        $(self.overlayID).setStyle('display', 'none');
        $(self.dialogWrapperID).setStyle('display', 'none');

        // clear form
        $(self.createTypeErrorID).setStyle('display', 'none');
        $(self.createNetworkErrorID).setStyle('display', 'none');
        $(self.createPublicErrorID).setStyle('display', 'none');
        $(self.createPrivateErrorID).setStyle('display', 'none');

        $(self.createTypeID).set('html', '');
        $(self.createNameID).value = '';
        $(self.createHostID).value = '';
        $(self.createPublicID).value = '';
        $(self.createPrivateID).value = '';
        $(self.createNetworkID).value = '';
        $(self.createLocationID).value = '';
        $(self.createDescriptionID).value = '';
        $(self.createProductionID).value = '';
        $(self.createTerminationID).value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.createCSRFID).value,
                'name'              : $(self.createNameID).value,
                'server_type'       : data['server_type'],
                'hostname'          : $(self.createHostID).value,
                'public_ip'         : $(self.createPublicID).value,
                'private_ip'        : $(self.createPrivateID).value,
                'network'           : $(self.createNetworkID).value,
                'location'          : $(self.createLocationID).value,
                'description'       : $(self.createDescriptionID).value,
                'production_date'   : $(self.createProductionID).value,
                'termination_date'  : $(self.createTerminationID).value
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'success') {    
                        var entry = response['data'];
                        ProjectsSite.appServersObj.appServers.get(entry['server_type']).include(entry['server']);
                        self.closeModal();
                        onCreate(entry['server']);
                    } else if (response['type'] == 'error') {
                        self._request.stop;
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'NETWORK_ERROR') {
                                $(self.createNetworkErrorID).set('html', msg[1]);
                                $(self.createNetworkErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'TYPE_ERROR') {
                                $(self.createTypeErrorID).set('html', msg[1]);
                                $(self.createTypeErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'PUBLIC_ERROR') {
                                $(self.createPublicErrorID).set('html', msg[1]);
                                $(self.createPublicErrorID).setStyle('display', 'block');
                            
                                new AppServersNoticeModal(
                                    'Notice', msg[1], response['duplicate'], 'OK',
                                    function(){})
                                .show();
                            } else if (msg[0] == 'PRIVATE_ERROR') {
                                $(self.createPrivateErrorID).set('html', msg[1]);
                                $(self.createPrivateErrorID).setStyle('display', 'block');

                                new AppServersNoticeModal(
                                    'Notice', msg[1], response['duplicate'], 'OK',
                                    function(){})
                                .show();
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
        // CLOSE BUTTON EVENT
        $(self.closeID).removeEvents()
        $(self.closeID).addEvent('click', function(e)
        {
            e.preventDefault()
            self.closeModal();
            onCancel();
        });
    
        // CREATE BUTTON EVENT
        $(self.confirmButtonID).removeEvents()
        $(self.confirmButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        // CANCEL BUTTON EVENT
        $(self.cancelButtonID).removeEvents()
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
            onCancel();
        });
    }
}

var AppServersNoticeModal = function(title, message, duplicate, confirm, onConfirm)
{
    var self = this;

    self.modalID = 'confirmation-modal';
    self.overlayID = 'overlay2';
    self.dialogWrapperID = 'dialog-wrapper';

    self.titleID = 'modal-title';
    self.messageID = 'modal-message';
    self.cancelButtonID = 'button-cancel-modal';
    self.confirmButtonID = 'button-confirm-modal';
    self.closeModalID = 'close-modal';

    self.forNoticeID = 'modal-for-server';

    // duplicate data
    self.noticeServerID = 'notice-id';
    self.noticeNameID = 'notice-name';
    self.noticePrivateID = 'notice-private';
    self.noticePublicID = 'notice-public';
    self.noticeTypeID = 'notice-type';
    self.noticeNetworkID = 'notice-network';
    self.noticeDescriptionID = 'notice-description';

    self.show = function()
    {
        $(self.titleID).set('html', title);
        $(self.messageID).set('html', message);
        $(self.confirmButtonID).set('html', confirm);

        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
        $(self.forNoticeID).setStyle('display', 'block');
        
        $(self.overlayID).grab($(self.modalID), 'after');

        self.addEvents();
        self.renderData();
    }      

    self.closeModal = function()
    {
        $(self.messageID).set('html', 'Confirm Action');
        $(self.messageID).set('html', '');
        $(self.confirmButtonID).set('html', 'Confirm');
        $(self.cancelButtonID).set('html', 'Cancel');
        $(self.modalID).setStyle('display', 'none');
        $(self.overlayID).setStyle('display', 'none');
    }

    self.renderData = function()
    {
        $(self.noticeServerID).set('html', duplicate['server_id']);
        $(self.noticeNameID).set('html', duplicate['name']);
        $(self.noticePrivateID).set('html', (duplicate['private_ip'] == NULL || duplicate['private_ip'] == '')? 'NONE' : duplicate['private_ip']);
        $(self.noticePublicID).set('html', (duplicate['public_ip'] == NULL || duplicate['public_ip'] == '')? 'NONE' : duplicate['public_ip']);
        $(self.noticeTypeID).set('html', duplicate['server_type']);
        $(self.noticeNetworkID).set('html', duplicate['network']);
        $(self.noticeDescriptionID).set('html', '<pre>'+duplicate['description']);
    }

    self.addEvents = function()
    {
        //FOR CANCEL
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
        });

        //FOR CLOSE
        $(self.closeModalID).removeEvents();
        $(self.closeModalID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
        });

        //FOR CONFIRM
        $(self.confirmButtonID).removeEvents();
        $(self.confirmButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            onConfirm();
            self.closeModal();
        });
    }
}