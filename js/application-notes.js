var ApplicationNotesList = function(application_id)
{
    var self = this;
    self.getDataURL = baseURL + '/notes/list';
    self._request = null;

    //buttons
    self.viewID = 'a[id^=application-notes-list-view_]';
    self.createButtonID = 'application-notes-list-create-button';

    //container
    self.containerID = 'application-notes-list';

    //table
    self.nextID = 'application-notes-list-next';
    self.prevID = 'application-notes-list-prev';
    self.currentPage = 1;
    self.resultData = [];
    self.totalDataID = 'application-notes-list-total';
    self.totalPartID = 'application-notes-list-part';
    self.tableID = 'application-notes-list-table';
    self.tableRowClass = 'application-notes-list-row';

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

    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            Array.each(self.resultData, function(val, idx)
            {
                var created = (val['date_created'] == null || val['date_created'] == '0000-00-00 00:00:00')? '' : val['date_created'];
                var updated = (val['date_updated'] == null || val['date_updated'] == '0000-00-00 00:00:00')? '' : val['date_updated'];

                contentHTML = '<td>'+created+'</td>'
                            + '<td>'+updated+'</td>'                        
                            + '<td>'+val['notes']+'</td>'
                            + '<td class="actions-col two-column">'
                            + '<a id="application-notes-list-view_' + idx + '" href="#" title="View Contact Person"><span class="">View</span></a>&nbsp'
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
            
            contentHTML = '<td>No notes found</td><td></td><td></td><td></td>';
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

        //CREATE A CONTACT PERSON
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ApplicationNotesSite.initCreate(application_id);
        });
        
        //VIEW CONTACT PERSON
        $$(self.viewID).removeEvents();
        $$(self.viewID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ApplicationNotesSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
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

    //buttons
    self.saveButtonID = 'application-notes-create-save-button';
    self.cancelButtonID = 'application-notes-create-cancel-button';

    //container
    self.containerID = 'application-notes-create';

    //fields
    self.createNotesID = 'application-notes-create-notes';
    self.csrfID = 'application-notes-create-csrf';

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
                'application_id'    : application_id,
                'notes'             : $(self.createNotesID).value.trim()
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
                        console.log(response);
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
            //clean form
            $(self.createNotesID).value = '';

            $(self.containerID).setStyle('display', 'none');
            ApplicationNotesSite.initObj(application_id);
        });
    }
}

var ApplicationNotesView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/delete';
    self._request = null;

    //display
    self.containerID = 'application-notes-view';

    //buttons
    self.deleteButtonID = 'application-notes-view-delete-button';
    self.editButtonID = 'application-notes-view-edit-button';
    self.backButtonID = 'application-notes-view-back-button';

    //fields
    self.viewNotesID = 'application-notes-view-notes';
    self.viewCreatedID = 'application-notes-view-created';
    self.viewUpdatedID = 'application-notes-view-updated';
    self.viewCreatedByID = 'application-notes-view-createdby';
    self.viewUpdatedByID = 'application-notes-view-updatedby';
    self.csrfID = 'application-notes-view-csrf';

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
        var updatedby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : data['date_created'];
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : data['date_updated'];

        $(self.viewNotesID).set('html', '<pre>'+data['notes']);
        $(self.viewCreatedID).set('html', created);
        $(self.viewUpdatedID).set('html', updated);
        $(self.viewCreatedByID).set('html', (createdby == null)? data['created_by'] : createdby);
        $(self.viewUpdatedByID).set('html', (updatedby == null)? data['updated_by'] : updatedby);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ApplicationNotesSite.initEdit(data);
        });

        //DELETE CONTACT PERSON
        $(self.deleteButtonID).removeEvents();
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

        //GO BACK TO THE LIST
        $(self.backButtonID).removeEvents();
        $(self.backButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ApplicationNotesSite.initObj(data['application_id']);
        });
    }
}

var ApplicationNotesEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/update';
    self._request = null;

    //display
    self.containerID = 'application-notes-edit';

    //fields
    self.editNotesID = 'application-notes-edit-notes';
    self.csrfID = 'application-notes-edit-csrf';

    //buttons
    self.cancelButtonID = 'application-notes-edit-cancel-button';
    self.saveButtonID = 'application-notes-edit-save-button';

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
                'note_id'           : data['note_id'],
                'notes'             : $(self.editNotesID).value.trim(),
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
        $(self.editNotesID).value = data['notes'];
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
            //clean form
            $(self.editNotesID).value = '';

            $(self.containerID).setStyle('display', 'none');
            ApplicationNotesSite.initView(data);
        });
    }
}

var ApplicationNotesSite = {
    init: function(application_id)
    {
        var self = this;
        self.initObj(application_id);
    },

    initObj: function(application_id)
    {
        new ApplicationNotesList(application_id).init();
    },

    initCreate: function(application_id)
    {
        new ApplicationNotesCreate(application_id).init();
    },

    initEdit: function(data)
    {
        new ApplicationNotesEdit(data).init();
    },

    initView: function(data)
    {
        new ApplicationNotesView(data).init();
    }
}