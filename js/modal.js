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

    //fields
    self.inputID = 'application-type-input';
    self.csrfID = 'application-type-modal-csrf';

    //for table
    self.tableID = 'application-type-table';
    self.tableRowClass = 'application-type-row';
    self.tableRowID = 'tr[id^=type_]';
    self.rowSelected = '';
    self.choices = AppTypesData.resultData;

    //buttons
    self.cancelButtonID = 'application-type-modal-cancel-button';
    self.confirmButtonID = 'application-type-modal-confirm-button';

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
                'name'              : $(self.inputID).value.trim()
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
                        AppTypesData.set(entry['type_id'], entry['name']);
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
            AppTypesData.resultData.each(function(val, idx)
            {
                if (val.indexOf(filter) == 0) {
                    filtered[idx] = val;
                }
            });

            $(self.confirmButtonID).set('disabled', false); 
            self.choices = new Hash(filtered);
        } else {
            $(self.confirmButtonID).set('disabled', true);
            self.choices = AppTypesData.resultData;
        }
        self.renderData();
    }

    self.renderData = function()
    {
        var inputVal = $(self.inputID).value;
        var inputKey = self.choices.keyOf(inputVal);
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

        var sorted = self.choices.getValues().sort();

        sorted.each(function(val, idx)
        {
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : '<td>'+val+'</td>',
                'id'    : 'type_'+self.choices.keyOf(val)
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
                $(this).value = $(this).value.replace(/[^a-zA-Z0-9\-\_]/gi, '').substr(0,12).toUpperCase();
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
                    $('type_'+self.rowSelected).removeClass('selected');
                }
                $(this).addClass('selected');
                self.rowSelected = idx;
                $(self.inputID).value = (idx == 'create')? $(this).getChildren()[0].get('html').split('<i>')[0].trim() : self.choices.get(self.rowSelected);
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
    self.choices = AppServersData.get(server_type);

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
            AppServersData.get(server_type).each(function(val)
            {
                if (val['name'].toLowerCase().indexOf(filter.toLowerCase()) == 0) {
                    filtered.include(val);
                }
            });

            $(self.confirmButtonID).set('disabled', false); 
            self.choices = filtered;
        } else {
            $(self.confirmButtonID).set('disabled', true);
            self.choices = AppServersData.get(server_type);
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

var AppServersListModal = function(server_type, onSelected, hasCreate)
{
    var self = this;

    // modal
    self.modalID         = 'app-servers-list-modal';
    self.overlayID       = 'overlay';
    self.dialogWrapperID = 'dialog-wrapper';
    self.createModal     = new AppServersCreateModal();

    //title
    self.titleID         = 'app-servers-list-modal-title';
    self.titles          = {
        'PRODUCTION' : 'Production',
        'STAGING'    : 'Staging',
        'DEVELOPMENT': 'Development'
    }

    //search fields
    self.searchNameID    = 'app-servers-list-modal-name';
    self.searchNetworkID = 'app-servers-list-modal-network';
    self.searchPublicID  = 'app-servers-list-modal-public';
    self.searchPrivateID = 'app-servers-list-modal-private';
    self.searchParams    = {
        'server_type': server_type,
        'name': '',
        'network': '',
        'public_ip': '',
        'private_ip': ''
    };

    //table
    self.tableID        = 'app-servers-list-modal-table';
    self.tableRowClass  = 'app-servers-list-modal-row';

    //for pagination
    self.currentPage    = 1;
    self.totalPage      = 1;
    self.pageLimit      = 5;

    self.prevID         = 'app-servers-list-modal-prev';
    self.nextID         = 'app-servers-list-modal-next';
    self.totalDataID    = 'app-servers-list-modal-total';
    self.totalPartID    = 'app-servers-list-modal-part';

    // buttons
    self.selectID       = 'a[id^=appserverslist-select_]';
    self.closeID        = 'app-servers-list-modal-close-button';
    self.searchButtonID = 'app-servers-list-modal-search';
    self.clearButtonID  = 'app-servers-list-modal-clear';

    self.choices = AppServersData.get(server_type);

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
            self.choices = AppServersData.get(server_type);
        } else {
            var filtered = [];
            AppServersData.get(server_type).each(function(val, idx)
            {
                var toInclude = true;
                // filter name
                if (self.searchParams['name'].length > 0 && (val['name'] == null || val['name'].toLowerCase().indexOf(self.searchParams['name'].toLowerCase()) == -1)) {
                    toInclude = false;
                }
                // filter network
                if (self.searchParams['network'].length > 0 && (val['network'] == null || val['network'].toLowerCase().indexOf(self.searchParams['network'].toLowerCase()) == -1)) {
                    toInclude = false;
                } 
                // filter public ip
                if (self.searchParams['public_ip'].length > 0 && (val['public_ip'] == null || val['public_ip'].toLowerCase().indexOf(self.searchParams['public_ip'].toLowerCase()) == -1)) {
                    toInclude = false;
                }
                // filter private ip
                if (self.searchParams['private_ip'].length > 0 && (val['private_ip'] == null || val['private_ip'].toLowerCase().indexOf(self.searchParams['private_ip'].toLowerCase()) == -1)) {
                    toInclude = false;                    
                }
                if (toInclude) {
                    filtered.include(val);
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

            var contentHTML = '';

            if (hasCreate) {
                contentHTML = '<td><b>'+self.searchParams['name']+'</b> <i>(Create)</i></td>'
                    + '<td>'+self.searchParams['network']+'</td>'
                    + '<td>'+self.searchParams['public_ip']+'</td>'
                    + '<td>'+self.searchParams['private_ip']+'</td>'
                    + '<td><a href="#" id="appserverslist-select_create">Create</a></td>';
            } else {
                contentHTML = '<td colspan="5">No servers found</td>';
            }

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

    self.modalID            = 'app-servers-create-modal';
    self.overlayID          = 'overlay';
    self.dialogWrapperID    = 'dialog-wrapper';

    // fields
    self.fieldTypeID        = 'app-servers-create-modal-type';
    self.fieldNameID        = 'app-servers-create-modal-name';
    self.fieldHostID        = 'app-servers-create-modal-host';
    self.fieldPublicID      = 'app-servers-create-modal-public';
    self.fieldPrivateID     = 'app-servers-create-modal-private';
    self.fieldNetworkID     = 'app-servers-create-modal-network';
    self.fieldLocationID    = 'app-servers-create-modal-location';
    self.fieldDescriptionID = 'app-servers-create-modal-description';
    self.fieldProductionID  = 'app-servers-create-modal-production';
    self.fieldTerminationID = 'app-servers-create-modal-termination';
    self.csrfID             = 'app-servers-create-modal-csrf';

    // errors
    self.errorTypeID        = 'app-servers-create-modal-type-error';
    self.errorNetworkID     = 'app-servers-create-modal-network-error';
    self.errorPublicID      = 'app-servers-create-modal-public-error';
    self.errorPrivateID     = 'app-servers-create-modal-private-error';    

    //buttons
    self.closeButtonID      = 'app-servers-create-modal-close-button';
    self.cancelButtonID     = 'app-servers-create-modal-cancel-button';
    self.confirmButtonID    = 'app-servers-create-modal-save-button';

    self.datePickerProd     = null;
    self.datePickerTerm     = null;

    self.show = function()
    {
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

        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.renderData = function()
    {
        $(self.fieldTypeID).set('html', data['server_type']);
        $(self.fieldNameID).value = data['name'];
        $(self.fieldNetworkID).value = ((data['network'] == null)? '' : data['network']);
        $(self.fieldPublicID).value = ((data['public_ip'] == null)? '' : data['public_ip']);
        $(self.fieldPrivateID).value = ((data['private_ip'] == null)? '' : data['private_ip']);
    }

    self.closeModal = function()
    {
        $(self.modalID).setStyle('display', 'none');
        $(self.overlayID).setStyle('display', 'none');
        $(self.dialogWrapperID).setStyle('display', 'none');

        // clear form
        $(self.errorTypeID).setStyle('display', 'none');
        $(self.errorNetworkID).setStyle('display', 'none');
        $(self.errorPublicID).setStyle('display', 'none');
        $(self.errorPrivateID).setStyle('display', 'none');

        $(self.fieldTypeID).set('html', '');
        $(self.fieldNameID).value = '';
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
                'server_type'       : data['server_type'],
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
                        var entry = response['data'];
                        AppServersData.get(entry['server_type']).include(entry['server']);
                        self.closeModal();
                        onCreate(entry['server']);
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
                            
                                new AppServersNoticeModal('Notice', msg[1], response['duplicate'], 'OK', function(){}, false).show();
                            } else if (msg[0] == 'PRIVATE_ERROR') {
                                $(self.errorPrivateID).set('html', msg[1]);
                                $(self.errorPrivateID).setStyle('display', 'block');

                                new AppServersNoticeModal('Notice', msg[1], response['duplicate'], 'OK', function(){}, false).show();
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
        $(self.closeButtonID).removeEvents()
        $(self.closeButtonID).addEvent('click', function(e)
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
            self.closeModal();
            onCancel();
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

var AppServersNoticeModal = function(title, message, duplicate, confirm, onConfirm, closeWrapper)
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

        if (closeWrapper == true) {
            $(self.dialogWrapperID).setStyle('display', 'none');
        }
    }

    self.renderData = function()
    {
        $(self.noticeServerID).set('html', duplicate['server_id']);
        $(self.noticeNameID).set('html', duplicate['name']);
        $(self.noticePrivateID).set('html', (duplicate['private_ip'] == null || duplicate['private_ip'] == '')? 'NONE' : duplicate['private_ip']);
        $(self.noticePublicID).set('html', (duplicate['public_ip'] == null || duplicate['public_ip'] == '')? 'NONE' : duplicate['public_ip']);
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

var ProjectsListModal = function(onSelected)
{
    var self = this;
    self.getDataURL      = baseURL + '/projects/list';
    self._request        = null;

    // containers
    self.modalID         = 'projects-list-modal';
    self.overlayID       = 'overlay';
    self.dialogWrapperID = 'dialog-wrapper';

    // search fields
    self.searchNameID    = 'projects-list-modal-name';
    self.searchCodeID    = 'projects-list-modal-code';

    // table
    self.tableID         = 'projects-list-modal-table';
    self.tableRowClass   = 'projects-list-modal-row';

    // for pagination
    self.currentPage     = 1;
    self.totalPage       = 1;
    self.pageLimit       = 10;
    self.resultData      = [];

    self.prevID          = 'projects-list-modal-prev';
    self.nextID          = 'projects-list-modal-next';
    self.totalDataID     = 'projects-list-modal-total';
    self.totalPartID     = 'projects-list-modal-part';

    // buttons
    self.selectID        = 'a[id^=projects-list-modal-select_]';
    self.closeID         = 'projects-list-modal-close-button';
    self.searchButtonID  = 'projects-list-modal-search-button';
    self.clearButtonID   = 'projects-list-modal-clear-button';

    self.csrfID          = 'projects-list-modal-csrf';
    self.searchParams    = {
        'name'  : '',
        'code'  : '',
        'limit' : 10,
    }

    self.show = function()
    {
        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
        self.init();
    }

    self.closeModal = function()
    {
        $(self.modalID).setStyle('display', 'none');
        $(self.overlayID).setStyle('display', 'none');
        $(self.dialogWrapperID).setStyle('display', 'none');

        $(self.searchNameID).value = '';
        $(self.searchCodeID).value = '';
    }

    self.init = function()
    {
        $$('.'+self.tableRowClass).dispose();
        ProjectsData.getAjaxData({
            'page'  : self.currentPage,
            'name'  : self.searchParams['name'],
            'code'  : self.searchParams['code'],
            'limit' : self.searchParams['limit'],
            'YII_CSRF_TOKEN' : $(self.csrfID).value,
        }, self.getData, function(){});
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
                self.lookupData.include(val['project_id'], idx);
                // var description = (val['description'].length > 65)? val['description'].substr(0, 65)+'...' : val['description']; 

                contentHTML = '<td>'+val['project_id']+'</td>'
                            + '<td>'+val['name']+'</td>'
                            + '<td>'+val['code']+'</td>'
                            + '<td><a href="#" id="projects-list-modal-select_'+val['project_id']+'">Select</a></td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'projects-list-modal-view_'+val['project_id']
                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td colspan="4">No results found</td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : contentHTML,
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

        // SELECT SERVER EVENT
        $$(self.selectID).removeEvents()
        $$(self.selectID).addEvent('click', function(e)
        {
            e.preventDefault();
            var id = $(this).get('id').split('_')[1];

            self.closeModal();
            onSelected({
                'project_id': id,
                'name'      : self.resultData[self.lookupData.get(id)]['name'],
            });
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
            self.currentPage = 1
            self.searchParams['name'] = $(self.searchNameID).value;
            self.searchParams['code'] = $(self.searchCodeID).value;
            self.init();
        });

        // CLEAR EVENT
        $(self.clearButtonID).removeEvents();
        $(self.clearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.searchNameID).value = '';
            $(self.searchCodeID).value = '';
        });

        //EVENT FOR SEARCH CODE FIELD INPUT
        $(self.searchCodeID).removeEvents();
        $(self.searchCodeID).addEvent('input', function(e)
        {
            e.preventDefault();
            $(this).value = $(this).value.substr(0,5).toUpperCase().replace(/[^a-zA-Z0-9]/i, '');
        });
    }
}