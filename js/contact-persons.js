var ContactPersonsList = function(project_id)
{
    var self = this;
    self.getDataURL = baseURL + '/contactpersons/list';
    self._request = null;

    self.containerID    = 'contact-persons-list';
    self.csrfID         = 'contact-persons-list-csrf';
    
    //for pagination
    self.nextID         = 'contact-persons-list-next';
    self.prevID         = 'contact-persons-list-prev';
    self.totalDataID    = 'contact-persons-list-total';
    self.totalPartID    = 'contact-persons-list-part';

    //for table
    self.tableID        = 'contact-persons-list-table';
    self.totalPage      = 1;
    self.currentPage    = 1;
    self.resultData     = [];
    self.tableRowClass  = 'contact-persons-list-row';

    //buttons
    self.createButtonID = 'contact-persons-list-create-button';
    self.viewButtonID   = 'tr[id^=contact-persons-list-view_]';

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
                'page'            : self.currentPage,
                'project_id'      : project_id,
                'YII_CSRF_TOKEN'  : $(self.csrfID).value,
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

    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            Array.each(self.resultData, function(val, idx)
            {
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['company']+'</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'contact-persons-list-view_'+idx

                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td>No contact persons found</td><td></td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : contentHTML,
                'id'    : 'contact-persons-list-view_none'
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

        //CREATE A CONTACT PERSON
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ContactPersonsSite.initCreate(project_id);
        });
        
        //VIEW CONTACT PERSON
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var idx = parseInt($(this).get('id').split('_')[1]);
            if (typeof idx==='number' && (idx%1)===0) {
                $(self.containerID).setStyle('display', 'none');
                ContactPersonsSite.initView(self.resultData[idx]);
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

var ContactPersonsCreate = function(project_id)
{
    var self = this;
    self.postDataURL = baseURL + '/contactpersons/create';
    self._request = null;

    self.containerID = 'contact-persons-create';
    
    //buttons
    self.saveButtonID    = 'contact-persons-create-save-button';
    self.cancelButtonID  = 'contact-persons-create-cancel-button';

    //fields
    self.fieldNameID     = 'contact-persons-create-name';
    self.fieldCompanyID  = 'contact-persons-create-company';
    self.fieldPositionID = 'contact-persons-create-position';
    self.fieldContactsID = 'contact-persons-create-contacts';
    self.fieldEmailID    = 'contact-persons-create-email';
    self.fieldAddressID  = 'contact-persons-create-address';
    self.fieldNotesID    = 'contact-persons-create-notes';
    self.csrfID          = 'contact-persons-create-csrf';

    //errors
    self.errorNameID = 'contact-persons-create-name-error';
    self.errorEmailID = 'contact-persons-create-email-error';

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
                'project_id'        : project_id,
                'name'              : $(self.fieldNameID).value.trim(),
                'company'           : $(self.fieldCompanyID).value.trim(),
                'position'          : $(self.fieldPositionID).value.trim(),
                'contact_numbers'   : $(self.fieldContactsID).value.trim(),
                'email'             : $(self.fieldEmailID).value.trim(),
                'address'           : $(self.fieldAddressID).value.trim(),
                'notes'             : $(self.fieldNotesID).value.trim()
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
                                $(self.errorNameID).set('html', msg[1]);
                                $(self.errorNameID).setStyle('display', 'block');
                            
                            } else if (msg[0] == 'EMAIL_ERROR') {
                                $(self.errorEmailID).set('html', msg[1]);
                                $(self.errorEmailID).setStyle('display', 'block');

                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        $(self.cancelButtonID).click();
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
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorEmailID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //clean form
            $(self.fieldNameID).value = '';
            $(self.fieldCompanyID).value = '';
            $(self.fieldPositionID).value = '';
            $(self.fieldEmailID).value = '';
            $(self.fieldContactsID).value = '';
            $(self.fieldAddressID).value = '';
            $(self.fieldNotesID).value = '';

            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorEmailID).setStyle('display', 'none');
            
            $(self.containerID).setStyle('display', 'none');
            ContactPersonsSite.initObj(project_id);

        });
    }
}

var ContactPersonsView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/contactpersons/delete';
    self._request = null;

    self.containerID = 'contact-persons-view';

    //fields
    self.fieldNameID        = 'contact-persons-view-name';
    self.fieldCompanyID     = 'contact-persons-view-company';
    self.fieldPositionID    = 'contact-persons-view-position';
    self.fieldContactsID    = 'contact-persons-view-contacts';
    self.fieldEmailID       = 'contact-persons-view-email';
    self.fieldAddressID     = 'contact-persons-view-address';
    self.fieldNotesID       = 'contact-persons-view-notes';
    self.csrfID             = 'contact-persons-view-csrf';

    //buttons
    self.editButtonID       = 'contact-persons-view-edit-button';
    self.deleteButtonID     = 'contact-persons-view-delete-button';
    self.backButtonID       = 'contact-persons-view-back-button';

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
        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldCompanyID).set('html', data['company']);
        $(self.fieldPositionID).set('html', data['position']);
        $(self.fieldContactsID).set('html', data['contact_numbers']);
        $(self.fieldEmailID).set('html', data['email']);
        $(self.fieldAddressID).set('html', '<pre>'+data['address']);
        $(self.fieldNotesID).set('html', '<pre>'+data['notes']);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ContactPersonsSite.initEdit(data);
        });

        //DELETE CONTACT PERSON
        $(self.deleteButtonID).removeEvents();
        $(self.deleteButtonID).addEvent('click', function(e)
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
        $(self.backButtonID).removeEvents();
        $(self.backButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ContactPersonsSite.initObj(data['project_id']);
        });
    }
}

var ContactPersonsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/contactpersons/update';
    self._request = null;

    self.containerID        = 'contact-persons-edit';

    //fields
    self.fieldNameID        = 'contact-persons-edit-name';
    self.fieldCompanyID     = 'contact-persons-edit-company';
    self.fieldPositionID    = 'contact-persons-edit-position';
    self.fieldEmailID       = 'contact-persons-edit-email';
    self.fieldContactsID    = 'contact-persons-edit-contacts';
    self.fieldAddressID     = 'contact-persons-edit-address';
    self.fieldNotesID       = 'contact-persons-edit-notes';
    self.csrfID             = 'contact-persons-edit-csrf';

    //errors
    self.errorNameID        = 'contact-persons-edit-name-error';
    self.errorEmailID       = 'contact-persons-edit-email-error';

    //buttons
    self.saveButtonID       = 'contact-persons-edit-save-button';
    self.cancelButtonID     = 'contact-persons-edit-cancel-button';

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
                'project_id'        : data['project_id'],
                'name'              : $(self.fieldNameID).value.trim(),
                'company'           : $(self.fieldCompanyID).value.trim(),
                'position'          : $(self.fieldPositionID).value.trim(),
                'contact_numbers'   : $(self.fieldContactsID).value.trim(),
                'email'             : data['email'],
                'new_email'         : $(self.fieldEmailID).value.trim(),
                'address'           : $(self.fieldAddressID).value.trim(),
                'notes'             : $(self.fieldNotesID).value.trim(),
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
                                $(self.errorNameID).set('html', msg[1]);
                                $(self.errorNameID).setStyle('display', 'block');
                            
                            } else if (msg[0] == 'EMAIL_ERROR') {
                                $(self.errorEmailID).set('html', msg[1]);
                                $(self.errorEmailID).setStyle('display', 'block');

                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        data['name']            = response['data']['name'];
                        data['company']         = response['data']['company'];
                        data['position']        = response['data']['position'];
                        data['contact_numbers'] = response['data']['contact_numbers'];
                        data['email']           = response['data']['email'];
                        data['address']         = response['data']['address'];
                        data['notes']           = response['data']['notes'];

                        $(self.cancelButtonID).click();
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
        $(self.fieldNameID).value = data['name'];
        $(self.fieldCompanyID).value = data['company'];
        $(self.fieldPositionID).value = data['position'];
        $(self.fieldEmailID).value = data['email'];
        $(self.fieldContactsID).value = data['contact_numbers'];
        $(self.fieldAddressID).value = data['address'];
        $(self.fieldNotesID).value = data['notes'];
    }

    self.addEvents = function()
    {
        //UPDATE CONTACT PERSON
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorEmailID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            //clean form
            $(self.fieldNameID).value = '';
            $(self.fieldCompanyID).value = '';
            $(self.fieldPositionID).value = '';
            $(self.fieldEmailID).value = '';
            $(self.fieldContactsID).value = '';
            $(self.fieldAddressID).value = '';
            $(self.fieldNotesID).value = '';
            
            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorEmailID).setStyle('display', 'none');

            $(self.containerID).setStyle('display', 'none');
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