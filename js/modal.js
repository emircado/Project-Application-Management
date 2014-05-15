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

    self.show = function()
    {
        $(self.titleID).set('html', title);
        $(self.messageID).set('html', message);
        $(self.confirmButtonID).set('html', confirm);

        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
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
        var inputKey = hash.get(inputVal);
        if (inputVal != '' && inputKey == null)
        {
            contentHTML = '<td>'+inputVal+' <i>(Create)</i></td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass+' selected',
                'html'  : contentHTML,
                'id'    : 'type_create'
            });
            contentElem.inject($(self.tableID), 'bottom');
            self.rowSelected = 'create';
        }

        self.choices.each(function(val, idx)
        {
            contentHTML = '<td>'+idx+'</td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : contentHTML,
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

var AppServersSearchModal = function()
{
    var self = this;

    self.modalID = 'app-servers-search-modal';

    self.createModal = new AppServersCreateModal();

    // buttons
    self.cancelButtonID = 'app-servers-search-modal-cancel-button';
    self.confirmButtonID = 'app-servers-search-modal-confirm-button';

    self.show = function()
    {
        $(self.modalID).setStyle('display', 'block');
        self.addEvents();
    }

    self.closeModal = function()
    {
        $(self.modalID).setStyle('display', 'none');
    }

    self.addEvents = function()
    {
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
            self.createModalID = new AppServersCreateModal(self.setServer, self.cancelServer);
            self.createModalID.show();
        });
    }

    self.setServer = function()
    {
        console.log('created');
    }

    self.cancelServer = function()
    {
        console.log('cancelled');
    }
}

var AppServersListModal = function(onSelected)
{
    var self = this;

    self.modalID = 'app-servers-list-modal';
    self.overlayID = 'overlay';
    self.dialogWrapperID = 'dialog-wrapper';

    self.createModal = new AppServersCreateModal();

    // buttons
    self.selectID = 'a[id^=app-servers-select]';
    self.closeID = 'app-servers-list-modal-close-button';

    self.show = function()
    {
        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
        self.addEvents();
    }

    self.closeModal = function()
    {
        $(self.modalID).setStyle('display', 'none');
        $(self.overlayID).setStyle('display', 'none');
        $(self.dialogWrapperID).setStyle('display', 'none');
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
                self.createModal = new AppServersCreateModal(self.setServer, self.cancelServer);
                self.createModal.show();
            } else {
                console.log('selecting...');
                self.closeModal();
                onSelected();
            }
        });

        // CLOSE SERVER EVENT
        $(self.closeID).removeEvents();
        $(self.closeID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.closeModal();
        });
    }

    self.setServer = function()
    {
        self.show();
        console.log('created server');
    }

    self.cancelServer = function()
    {
        self.show();
        console.log('cancelled creation');
    }
}

var AppServersCreateModal = function(onCreate, onCancel)
{
    var self = this;

    self.modalID = 'app-servers-create-modal';
    self.overlayID = 'overlay';
    self.dialogWrapperID = 'dialog-wrapper';

    //buttons
    self.closeID = 'app-servers-create-modal-close-button';
    self.cancelButtonID = 'app-servers-create-modal-cancel-button';
    self.confirmButtonID = 'app-servers-create-modal-create-button';

    self.show = function()
    {
        $(self.modalID).setStyle('display', 'block');
        $(self.overlayID).setStyle('display', 'block');
        $(self.dialogWrapperID).setStyle('display', 'block');
        self.addEvents();
    }

    self.closeModal = function()
    {
        $(self.modalID).setStyle('display', 'none');
        $(self.overlayID).setStyle('display', 'none');
        $(self.dialogWrapperID).setStyle('display', 'none');
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
            self.closeModal();
            onCreate();
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