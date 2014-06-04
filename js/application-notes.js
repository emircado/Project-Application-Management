var ApplicationNotesList = function(application_id)
{
    var self = this;
    self.getDataURL = baseURL + '/notes/list';
    self._request = null;

    self.containerID    = 'application-notes-list';
    self.csrfID         = 'application-notes-list-csrf';

    //for pagination
    self.nextID         = 'application-notes-list-next';
    self.prevID         = 'application-notes-list-prev';
    self.totalDataID    = 'application-notes-list-total';
    self.totalPartID    = 'application-notes-list-part';

    //for table
    self.tableID        = 'application-notes-list-table';
    self.totalPage      = 1;
    self.currentPage    = 1;
    self.resultData     = [];
    self.tableRowClass  = 'application-notes-list-row';

    //buttons
    self.viewButtonID   = 'tr[id^=application-notes-list-view_]';
    self.createButtonID = 'application-notes-list-create-button';

    self.init = function()
    {
        ApplicationNotesSite.activeView = 'LIST';
        $$('.'+self.tableRowClass).dispose();
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

    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            Array.each(self.resultData, function(val, idx)
            {
                var created = (val['date_created'] == null || val['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(val['date_created']);

                contentHTML = '<td>'+created+'</td>'                    
                            + '<td>'+val['notes']+'</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'application-notes-list-view_'+idx,
                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td>No notes found</td><td></td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : contentHTML,
                'id'    : 'application-notes-list-view_none',
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
            ApplicationNotesSite.initCreate(application_id);
        });
        
        //VIEW CONTACT PERSON
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var idx = parseInt($(this).get('id').split('_')[1]);
            if (typeof idx==='number' && (idx%1)===0) {
                ApplicationNotesSite.initView(self.resultData[idx]);
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

var ApplicationNotesCreate = function(application_id)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/create';
    self._request = null;

    self.containerID    = 'application-notes-create';

    //buttons
    self.saveButtonID   = 'application-notes-create-save-button';
    self.cancelButtonID = 'application-notes-create-cancel-button';

    //fields
    self.fieldNotesID  = 'application-notes-create-notes';
    self.csrfID         = 'application-notes-create-csrf';

    self.init = function()
    {
        ApplicationNotesSite.activeView = 'CREATE';
        $(self.containerID).setStyle('display', 'block');
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        //clean form
        $(self.fieldNotesID).value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'application_id'    : application_id,
                'notes'             : $(self.fieldNotesID).value.trim()
            };

            console.log(params);

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'error') {
                        self._request.stop;
                        console.log(response['data'])
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
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ApplicationNotesSite.initObj(application_id);
        });
    }
}

var ApplicationNotesView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/delete';
    self._request = null;

    self.containerID = 'application-notes-view';

    //fields
    self.fieldNotesID       = 'application-notes-view-notes';
    self.fieldCreatedID     = 'application-notes-view-created';
    self.fieldUpdatedID     = 'application-notes-view-updated';
    self.fieldCreatedByID   = 'application-notes-view-createdby';
    self.csrfID             = 'application-notes-view-csrf';

    //buttons
    self.deleteButtonID     = 'application-notes-view-delete-button';
    self.editButtonID       = 'application-notes-view-edit-button';
    self.backButtonID       = 'application-notes-view-back-button';

    self.init = function()
    {
        ApplicationNotesSite.activeView = 'VIEW';
        $(self.containerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    
        // check if current user can edit
        if (username != data['created_by']) {
            $(self.editButtonID).set('html', '');
            $(self.deleteButtonID).set('html', '');
        } else {
            $(self.editButtonID).set('html', '[Edit]');
            $(self.deleteButtonID).set('html', '[Delete]');
        }
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'note_id'           : data['note_id'],
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
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);

        $(self.fieldNotesID).set('html', '<pre>'+data['notes']);
        $(self.fieldCreatedID).set('html', created);
        $(self.fieldUpdatedID).set('html', updated);
        $(self.fieldCreatedByID).set('html', (createdby == null)? data['created_by'] : createdby);
    }

    self.addEvents = function()
    {
        //EDIT BUTTON EVENT
        $(self.editButtonID).removeEvents();
        if (username == data['created_by']) {
            $(self.editButtonID).addEvent('click', function(e)
            {
                e.preventDefault();
                ApplicationNotesSite.initEdit(data);
            });
        }

        //DELETE BUTTON EVENT
        $(self.deleteButtonID).removeEvents();
        if (username == data['created_by']) {
            $(self.deleteButtonID).addEvent('click', function(e)
            {
                e.preventDefault();
                new ConfirmModal(
                    'Confirm Delete',
                    'Are you sure you want to delete this note from the list?',
                    'Delete',
                    self.postAjaxData)
                .show();
            });
        }

        //GO BACK TO THE LIST
        $(self.backButtonID).removeEvents();
        $(self.backButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ApplicationNotesSite.initObj(data['application_id']);
        });
    }
}

var ApplicationNotesEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/update';
    self._request = null;

    self.containerID    = 'application-notes-edit';

    //fields
    self.fieldNotesID   = 'application-notes-edit-notes';
    self.csrfID         = 'application-notes-edit-csrf';

    //buttons
    self.cancelButtonID = 'application-notes-edit-cancel-button';
    self.saveButtonID   = 'application-notes-edit-save-button';

    self.init = function()
    {
        ApplicationNotesSite.activeView = 'EDIT';
        $(self.containerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        //clean form
        $(self.fieldNotesID).value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'note_id'           : data['note_id'],
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
                        console.log(response['data']);
                    } else if (response['type'] == 'success') {
                        data['notes']           = response['data']['notes'];
                        data['date_updated']    = response['data']['date_updated']
                        data['updated_by']      = response['data']['updated_by'];

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
        $(self.fieldNotesID).value = data['notes'];
    }

    self.addEvents = function()
    {
        //UPDATE CONTACT PERSON
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        //CANCEL BUTTON
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ApplicationNotesSite.initView(data);
        });
    }
}

var ApplicationNotesSite = {
    mainObj     : null,
    createObj   : null,
    editObj     : null,
    viewObj     : null,

    activeView  : '',

    init: function(application_id)
    {
        var self = this;
        self.initObj(application_id);
    },

    initObj: function(application_id)
    {
        var self = this;
        self.closeActive();
        self.mainObj = new ApplicationNotesList(application_id);
        self.mainObj.init();
    },

    initCreate: function(application_id)
    {
        var self = this;
        self.closeActive();
        self.createObj = new ApplicationNotesCreate(application_id);
        self.createObj.init();
    },

    initEdit: function(data)
    {
        var self = this;
        self.closeActive();
        self.editObj = new ApplicationNotesEdit(data);
        self.editObj.init();
    },

    initView: function(data)
    {
        var self = this;
        self.closeActive();
        self.viewObj = new ApplicationNotesView(data);
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