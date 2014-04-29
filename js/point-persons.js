var ContactPersonsList = function()
{
    var self = this;

    //navigation buttons
    self.nextContactID = 'contact-next';
    self.prevContactID = 'contact-prev';

    //for creating a new contact person
    self.createContactButtonID = 'contact-button-add';

    //actions
    self.viewContactPersonID = 'a[id^=contact-persons-view_]';

    //container
    self.contactPersonsListID = 'contact-persons-list';

    self.init = function()
    {
        $(self.contactPersonsListID).setStyle('display', 'block');
        self.addEvents();
    }

    self.addEvents = function()
    {
        //NAVIGATE TO NEXT PAGE
        $(self.nextContactID).removeEvents();
        $(self.nextContactID).addEvent('click', function(e)
        {
            e.preventDefault();
            console.log('testing next');
        });
        
        //NAVIGATE TO PREVIOUS PAGE
        $(self.prevContactID).removeEvents();
        $(self.prevContactID).addEvent('click', function(e)
        {
            e.preventDefault();
            console.log('testing previous');
        });

        //CREATE A CONTACT PERSON
        $(self.createContactButtonID).removeEvents();
        $(self.createContactButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.contactPersonsListID).setStyle('display', 'none');
            ContactPersonsSite.initCreate();
        });
        
        //VIEW CONTACT PERSON
        $$(self.viewContactPersonID).removeEvents();
        $$(self.viewContactPersonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.contactPersonsListID).setStyle('display', 'none');
            ContactPersonsSite.initView();
        });
    }

    // self.checkPagination = function()
    // {

    // }

};

var ContactPersonsCreate = function()
{
    var self = this;

    //buttons
    self.createContactPersonSaveButtonID = 'create-button-create-contact-persons';
    self.createContactPersonCancelButtonID = 'contact-persons-create-button-cancel';

    //container
    self.createContactPersonsViewID = 'create-contact-persons-view';

    self.init = function()
    {
        $(self.createContactPersonsViewID).setStyle('display', 'block');
        self.addEvents();
    }

    self.addEvents = function()
    {
        //CREATE CONTACT PERSON
        $(self.createContactPersonSaveButtonID).removeEvents();
        $(self.createContactPersonSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.createContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initObj();
        });

        //CANCEL BUTTON
        $(self.createContactPersonCancelButtonID).removeEvents();
        $(self.createContactPersonCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.createContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initObj();
        });
    }
}

var ContactPersonsView = function(data)
{
    var self = this;

    //display
    self.viewContactPersonsViewID = 'view-contact-persons-view';

    //for edit
    self.editContactPersonID = 'a[id^=contact-persons-edit_]';

    //back to list
    self.contactPersonsViewToListID = 'contact-person-view-to-list';

    self.init = function()
    {
        $(self.viewContactPersonsViewID).setStyle('display', 'block');
        self.addEvents();
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $$(self.editContactPersonID).removeEvents();
        $$(self.editContactPersonID).addEvent('click', function(e)
        {
            e.preventDefault();
            // console.log('editing...');
            $(self.viewContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initEdit();
        });

        //GO BACK TO THE LIST
        $(self.contactPersonsViewToListID).removeEvents();
        $(self.contactPersonsViewToListID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initObj();
        });
    }
}

var ContactPersonsEdit = function()
{
    var self = this;

    //display
    self.editContactPersonsViewID = 'edit-contact-persons-view';

    //buttons
    self.editContactPersonSaveButtonID = 'edit-button-update-contact-persons';
    self.editContactPersonCancelButtonID = 'contact-persons-edit-button-cancel';

    self.init = function()
    {
        $(self.editContactPersonsViewID).setStyle('display', 'block');
        self.addEvents();
    }

    self.addEvents = function()
    {
        //CREATE CONTACT PERSON
        $(self.editContactPersonSaveButtonID).removeEvents();
        $(self.editContactPersonSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.editContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initView();
        });

        //CANCEL BUTTON
        $(self.editContactPersonCancelButtonID).removeEvents();
        $(self.editContactPersonCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.editContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initView();
        });
    }
}

var ContactPersonsSite = {
    mainObj         : null,
    createObj       : null,

    init: function()
    {
        var self = this;
        self.initObj();
    },

    initObj: function()
    {
        var self = this;

        if (self.mainObj == null)
        {
            self.mainObj = new ContactPersonsList();
        }
        self.mainObj.init();
    },

    initCreate: function()
    {
        var self = this;
        new ContactPersonsCreate().init();

        if (self.createObj == null)
        {
            self.createObj = new ContactPersonsCreate();
        }
        self.createObj.init();
    },

    initEdit: function()
    {
        var self = this;
        new ContactPersonsEdit().init();
    },

    initView: function(data)
    {
        var self = this;
        new ContactPersonsView(data).init();
    }
}