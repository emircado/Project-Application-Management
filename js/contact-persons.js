var ContactPersonsList = function(project_id)
{
    var self = this;
    self.getDataURL = baseURL + '/contactpersons/list';
    self._request = null;

    //buttons
    self.viewContactPersonID = 'a[id^=contact-persons-view_]';
    self.createContactButtonID = 'contact-button-add';

    //container
    self.contactPersonsListID = 'contact-persons-list';

    //table
    self.nextID = 'contact-next';
    self.prevID = 'contact-prev';
    self.currentPage = 1;
    self.resultData = [];
    self.totalDataID = 'contact-persons-total';
    self.totalPartID = 'contact-persons-part';
    self.contactPersonsTableID = 'contact-persons-table';
    self.tableRowClass = 'contact-person-row';

    self.init = function()
    {
        $$('.'+self.tableRowClass).dispose();
        $(self.contactPersonsListID).setStyle('display', 'block');
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
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['company']+'</td>'                        
                            + '<td>'+val['position']+'</td>'
                            + '<td>'+val['email']+'</td>'
                            + '<td class="actions-col two-column">'
                            + '<a id="contact-persons-view_' + idx + '" href="#" title="View Contact Person"><span class="">View</span></a>&nbsp'
                            + '</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html' : contentHTML
                });
                
                contentElem.inject($(self.contactPersonsTableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td>No contact persons found</td><td></td><td></td><td></td><td></td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html' : contentHTML
            });

            contentElem.inject($(self.contactPersonsTableID), 'bottom');
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

        //CREATE A CONTACT PERSON
        $(self.createContactButtonID).removeEvents();
        $(self.createContactButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.contactPersonsListID).setStyle('display', 'none');
            ContactPersonsSite.initCreate(project_id);
        });
        
        //VIEW CONTACT PERSON
        $$(self.viewContactPersonID).removeEvents();
        $$(self.viewContactPersonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.contactPersonsListID).setStyle('display', 'none');
            ContactPersonsSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
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

var ContactPersonsCreate = function(project_id)
{
    var self = this;
    self.postDataURL = baseURL + '/contactpersons/create';
    self._request = null;

    //buttons
    self.createContactPersonsSaveButtonID = 'create-button-create-contact-persons';
    self.createContactPersonsCancelButtonID = 'contact-persons-create-button-cancel';

    //container
    self.createContactPersonsViewID = 'create-contact-persons-view';

    //fields
    self.createContactPersonsNameID =       'contact-persons-create-name';
    self.createContactPersonsCompanyID =    'contact-persons-create-company';
    self.createContactPersonsPositionID =   'contact-persons-create-position';
    self.createContactPersonsContactsID =   'contact-persons-create-contacts';
    self.createContactPersonsEmailID =      'contact-persons-create-email';
    self.createContactPersonsAddressID =    'contact-persons-create-address';
    self.createContactPersonsNotesID =      'contact-persons-create-notes';

    //for csrf
    self.createContactPersonsCSRFID = 'contact-persons-create-csrf';

    //errors
    self.createContactPersonsNameErrorID = 'contact-persons-create-name-error';
    self.createContactPersonsEmailErrorID = 'contact-persons-create-email-error';

    self.init = function()
    {
        $(self.createContactPersonsViewID).setStyle('display', 'block');
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.createContactPersonsCSRFID).value,
                'project_id'        : project_id,
                'name'              : $(self.createContactPersonsNameID).value.trim(),
                'company'           : $(self.createContactPersonsCompanyID).value.trim(),
                'position'          : $(self.createContactPersonsPositionID).value.trim(),
                'contact_numbers'  : $(self.createContactPersonsContactsID).value.trim(),
                'email'             : $(self.createContactPersonsEmailID).value.trim(),
                'address'           : $(self.createContactPersonsAddressID).value.trim(),
                'notes'             : $(self.createContactPersonsNotesID).value.trim()
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
                            if (msg[0] == 'NAME_ERROR') {
                                $(self.createContactPersonsNameErrorID).set('html', msg[1]);
                                $(self.createContactPersonsNameErrorID).setStyle('display', 'block');
                            
                            } else if (msg[0] == 'EMAIL_ERROR') {
                                $(self.createContactPersonsEmailErrorID).set('html', msg[1]);
                                $(self.createContactPersonsEmailErrorID).setStyle('display', 'block');

                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        $(self.createContactPersonsCancelButtonID).click();
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
        //CREATE CONTACT PERSON
        $(self.createContactPersonsSaveButtonID).removeEvents();
        $(self.createContactPersonsSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.createContactPersonsCancelButtonID).removeEvents();
        $(self.createContactPersonsCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //clean form
            $(self.createContactPersonsNameID).value = '';
            $(self.createContactPersonsCompanyID).value = '';
            $(self.createContactPersonsPositionID).value = '';
            $(self.createContactPersonsEmailID).value = '';
            $(self.createContactPersonsContactsID).value = '';
            $(self.createContactPersonsAddressID).value = '';
            $(self.createContactPersonsNotesID).value = '';

            $(self.createContactPersonsNameErrorID).setStyle('display', 'none');
            $(self.createContactPersonsEmailErrorID).setStyle('display', 'none');
            
            $(self.createContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initObj(project_id);

        });
    }
}

var ContactPersonsView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/contactpersons/delete';
    self._request = null;

    //display
    self.viewContactPersonsViewID = 'view-contact-persons-view';

    //buttons
    self.editContactPersonID = 'contact-persons-edit';
    self.deleteContactPersonID = 'contact-persons-delete';

    //back to list
    self.contactPersonsViewToListID = 'contact-person-view-to-list';

    //fields
    self.viewContactPersonsNameID = 'contact-persons-view-name';
    self.viewContactPersonsCompanyID = 'contact-persons-view-company';
    self.viewContactPersonsPositionID = 'contact-persons-view-position';
    self.viewContactPersonsContactsID = 'contact-persons-view-contacts';
    self.viewContactPersonsEmailID = 'contact-persons-view-email';
    self.viewContactPersonsAddressID = 'contact-persons-view-address';
    self.viewContactPersonsNotesID = 'contact-persons-view-notes';
    self.viewContactPersonsCreatedID = 'contact-persons-view-created';
    self.viewContactPersonsUpdatedID = 'contact-persons-view-updated';

    //for csrf
    self.viewContactPersonsCSRFID = 'contact-persons-view-csrf';

    self.init = function()
    {
        $(self.viewContactPersonsViewID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.viewContactPersonsCSRFID).value,
                'project_id'        : data['project_id'],
                'email'             : data['email']
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
                        $(self.contactPersonsViewToListID).click();
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
        $(self.viewContactPersonsNameID).set('html', data['name']);
        $(self.viewContactPersonsCompanyID).set('html', data['company']);
        $(self.viewContactPersonsPositionID).set('html', data['position']);
        $(self.viewContactPersonsContactsID).set('html', data['contact_numbers']);
        $(self.viewContactPersonsEmailID).set('html', data['email']);
        $(self.viewContactPersonsAddressID).set('html', '<pre>'+data['address']);
        $(self.viewContactPersonsNotesID).set('html', '<pre>'+data['notes']);
        $(self.viewContactPersonsCreatedID).set('html', data['date_created_formatted']);
        $(self.viewContactPersonsUpdatedID).set('html', data['date_updated_formatted']);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editContactPersonID).removeEvents();
        $(self.editContactPersonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initEdit(data);
        });

        //DELETE CONTACT PERSON
        $(self.deleteContactPersonID).removeEvents();
        $(self.deleteContactPersonID).addEvent('click', function(e)
        {
            e.preventDefault();
            new ConfirmModal(
                'Confirm Delete',
                'Are you sure you want to delete this contact person from the list?',
                'Delete',
                self.postAjaxData)
            .show();
        });

        //GO BACK TO THE LIST
        $(self.contactPersonsViewToListID).removeEvents();
        $(self.contactPersonsViewToListID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initObj(data['project_id']);
        });
    }
}

var ContactPersonsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/contactpersons/update';
    self._request = null;

    //display
    self.editContactPersonsViewID = 'edit-contact-persons-view';

    //fields
    self.editContactPersonsNameID = 'contact-persons-edit-name';
    self.editContactPersonsCompanyID = 'contact-persons-edit-company';
    self.editContactPersonsPositionID = 'contact-persons-edit-position';
    self.editContactPersonsEmailID = 'contact-persons-edit-email';
    self.editContactPersonsContactsID = 'contact-persons-edit-contacts';
    self.editContactPersonsAddressID = 'contact-persons-edit-address';
    self.editContactPersonsNotesID = 'contact-persons-edit-notes';

    //for csrf
    self.editContactPersonsCSRFID = 'contact-persons-edit-csrf';

    //errors
    self.editContactPersonsNameErrorID = 'contact-persons-edit-name-error';
    self.editContactPersonsEmailErrorID = 'contact-persons-edit-email-error';

    //buttons
    self.editContactPersonsSaveButtonID = 'edit-button-update-contact-persons';
    self.editContactPersonsCancelButtonID = 'contact-persons-edit-button-cancel';

    self.init = function()
    {
        $(self.editContactPersonsViewID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.editContactPersonsCSRFID).value,
                'project_id'        : data['project_id'],
                'name'              : $(self.editContactPersonsNameID).value.trim(),
                'company'           : $(self.editContactPersonsCompanyID).value.trim(),
                'position'          : $(self.editContactPersonsPositionID).value.trim(),
                'contact_numbers'   : $(self.editContactPersonsContactsID).value.trim(),
                'email'             : data['email'],
                'new_email'         : $(self.editContactPersonsEmailID).value.trim(),
                'address'           : $(self.editContactPersonsAddressID).value.trim(),
                'notes'             : $(self.editContactPersonsNotesID).value.trim(),
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
                            if (msg[0] == 'NAME_ERROR') {
                                $(self.editContactPersonsNameErrorID).set('html', msg[1]);
                                $(self.editContactPersonsNameErrorID).setStyle('display', 'block');
                            
                            } else if (msg[0] == 'EMAIL_ERROR') {
                                $(self.editContactPersonsEmailErrorID).set('html', msg[1]);
                                $(self.editContactPersonsEmailErrorID).setStyle('display', 'block');

                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        data = response['data'];
                        $(self.editContactPersonsCancelButtonID).click();
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
        $(self.editContactPersonsNameID).value = data['name'];
        $(self.editContactPersonsCompanyID).value = data['company'];
        $(self.editContactPersonsPositionID).value = data['position'];
        $(self.editContactPersonsEmailID).value = data['email'];
        $(self.editContactPersonsContactsID).value = data['contact_numbers'];
        $(self.editContactPersonsAddressID).value = data['address'];
        $(self.editContactPersonsNotesID).value = data['notes'];
    }

    self.addEvents = function()
    {
        //UPDATE CONTACT PERSON
        $(self.editContactPersonsSaveButtonID).removeEvents();
        $(self.editContactPersonsSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.editContactPersonsCancelButtonID).removeEvents();
        $(self.editContactPersonsCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //clean form
            $(self.editContactPersonsNameID).value = '';
            $(self.editContactPersonsCompanyID).value = '';
            $(self.editContactPersonsPositionID).value = '';
            $(self.editContactPersonsEmailID).value = '';
            $(self.editContactPersonsContactsID).value = '';
            $(self.editContactPersonsAddressID).value = '';
            $(self.editContactPersonsNotesID).value = '';
            
            $(self.editContactPersonsNameErrorID).setStyle('display', 'none');
            $(self.editContactPersonsEmailErrorID).setStyle('display', 'none');

            $(self.editContactPersonsViewID).setStyle('display', 'none');
            ContactPersonsSite.initView(data);
        });
    }
}

var ContactPersonsSite = {
    init: function(project_id)
    {
        var self = this;
        self.initObj(project_id);
    },

    initObj: function(project_id)
    {
        new ContactPersonsList(project_id).init();
    },

    initCreate: function(project_id)
    {
        new ContactPersonsCreate(project_id).init();
    },

    initEdit: function(data)
    {
        new ContactPersonsEdit(data).init();
    },

    initView: function(data)
    {
        new ContactPersonsView(data).init();
    }
}