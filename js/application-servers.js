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

    //nav
    self.nextID = 'app-servers-next';
    self.prevID = 'app-servers-prev';

    self.init = function()
    {
        $(self.appserversListID).setStyle('display', 'block');
        self.addEvents();
    }


    self.addEvents = function()
    {
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
            AppServersSite.initView({'application_id':application_id});
        });
    }
}

var AppServersCreate = function(application_id)
{
    var self = this;

    // modals
    self.searchModal = new AppServersSearchModal();
    self.listModal = new AppServersListModal();

    //container
    self.createAppServerID = 'create-app-servers-view';
    self.searchModalContainerID = 'create-app-servers-modal-container';

    //buttons
    self.createButtonID = 'create-app-servers-add-button';
    self.cancelButtonID = 'create-app-servers-cancel-button';
    self.listButtonID = 'create-app-servers-advanced';

    //fields
    self.createServerID = 'create-app-servers-server';

    self.init = function()
    {
        $(self.createAppServerID).setStyle('display', 'block');
        $(self.searchModalContainerID).grab($(self.searchModal.modalID), 'top');
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        $(self.cancelButtonID).click();
    }

    self.addEvents = function()
    {
        // SERVER FIELD
        $(self.createServerID).removeEvents();
        $(self.createServerID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();

           self.searchModal = new AppServersSearchModal();
           self.searchModal.show(); 
        });

        // CREATE BUTTON EVENT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        // CANCEL BUTTON EVENT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.createAppServerID).setStyle('display', 'none');
            AppServersSite.initObj(application_id);
        });

        // ADVANCED SEARCH BUTTON
        $(self.listButtonID).removeEvents();
        $(self.listButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.listModal = new AppServersListModal(self.setServer);
            self.listModal.show();
        });
    }

    self.setServer = function()
    {
        console.log('selected from list');
    }
}

var AppServersView = function(data)
{
    var self = this;

    //container
    self.viewAppServerID = 'view-app-servers-view';
    self.detailsContainerID = 'view-app-servers-details-container';

    //buttons
    self.editID = 'app-servers-edit-button';
    self.deleteID = 'app-servers-delete-button';
    self.viewToListID = 'view-app-servers-back';
    self.detailsID = 'view-app-servers-details';

    self._isDetailsShown = false;

    self.init = function()
    {
        $(self.viewAppServerID).setStyle('display', 'block');
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        $(self.viewToListID).click();
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

    // containers
    self.editAppServerID = 'edit-app-servers-view';

    //buttons
    self.cancelButtonID = 'edit-app-servers-cancel-button';
    self.editButtonID = 'edit-app-servers-save-button';

    self.init = function()
    {
        $(self.editAppServerID).setStyle('display', 'block');
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        $(self.cancelButtonID).click();
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