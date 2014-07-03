var ProjectNotesList = function(project_id)
{
    var self = this;
    self.getDataURL = baseURL + '/notes/list';
    self._request = null;

    self.containerID    = 'project-notes-list';
    self.csrfID         = 'project-notes-list-csrf';
    
    //for pagination
    self.prevID         = 'project-notes-list-prev';
    self.nextID         = 'project-notes-list-next';
    self.totalDataID    = 'project-notes-list-total';
    self.totalPartID    = 'project-notes-list-part';

    //for table
    self.tableID        = 'project-notes-list-table';
    self.totalPage      = 1;
    self.currentPage    = 1;
    self.resultData     = [];
    self.tableRowClass  = 'project-notes-list-row';
    
    //buttons
    self.createButtonID = 'project-notes-list-create-button';

    self.init = function()
    {
        ProjectNotesSite.activeView = 'LIST';
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
                'project_id'        : project_id,
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
                var note = new ProjectNotesView(val);
                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : note.contentHTML,
                });
                
                contentElem.inject($(self.tableID), 'bottom');
                note.init();
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td>No notes found</td>';
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

        //CREATE A CONTACT PERSON
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ProjectNotesSite.initCreate(project_id);
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

var ProjectNotesCreate = function(project_id)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/create';
    self._request = null;

    self.containerID = 'project-notes-create';
    
    //buttons
    self.saveButtonID = 'project-notes-create-save-button';
    self.cancelButtonID = 'project-notes-create-cancel-button';

    //fields
    self.fieldNotesID = 'project-notes-create-notes';
    self.csrfID = 'project-notes-create-csrf';

    self.init = function()
    {
        ProjectNotesSite.activeView = 'CREATE';
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
                'project_id'        : project_id,
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
            ProjectNotesSite.initObj(project_id);
        });
    }
}

var ProjectNotesView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/delete';
    self._request = null;

    self.fieldNotesConID    = 'project-notes-view-notes-con_'+data['note_id'];

    //fields
    self.fieldNotesID       = 'project-notes-view-notes_'+data['note_id'];
    self.fieldMoreID        = 'project-notes-view-more_'+data['note_id'];
    self.fieldCreatedID     = 'project-notes-view-created_'+data['note_id'];
    self.fieldCreatedByID   = 'project-notes-view-createdby_'+data['note_id'];
    self.csrfID             = 'project-notes-list-csrf';

    //buttons
    self.deleteButtonID     = 'project-notes-view-delete_'+data['note_id'];
    self.editButtonID       = 'project-notes-view-edit_'+data['note_id'];

    self.contentHTML    = '<td class="note">'
                        +   '<div class="note-head">'
                        +       '<b id="'+self.fieldCreatedByID+'"></b>'
                        +       '<div style="float:right;">'
                        +           '<a id="'+self.editButtonID+'" href="#"></a> '
                        +           '<a id="'+self.deleteButtonID+'" href="#"></a>'
                        +       '</div>'
                        +       '<div><i id="'+self.fieldCreatedID+'" style="font-size:12px;"></i></div>'
                        +   '</div>'
                        +   '<div id="'+self.fieldNotesConID+'" class="note-body">'
                        +   '</div>'
                        + '</td>';
    
    self.notesHTML  = '<div class="value collapsible" id="'+self.fieldNotesID+'"></div>'
                    + '<a href="#" id="'+self.fieldMoreID+'" class="small-text"></a>'

    self.init = function()
    {
        $(self.fieldNotesConID).set('html', self.notesHTML);
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
                        ProjectNotesSite.initObj(data['project_id']);
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
        var createdby = LDAPUsersData.get(data['created_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);

        if (username == data['created_by']) {
            $(self.editButtonID).set('html', 'Edit');
            $(self.deleteButtonID).set('html', 'Delete');
        } else {
            $(self.editButtonID).set('html', '');
            $(self.deleteButtonID).set('html', '');
        }

        $(self.fieldNotesID).set('html', '<pre>'+data['notes']);
        //if overflow
        if ($(self.fieldNotesID).scrollHeight > $(self.fieldNotesID).clientHeight+1) {
            $(self.fieldMoreID).set('html', 'Read more');
        //if not
        } else {
            $(self.fieldMoreID).set('html', '');    
        }
        $(self.fieldCreatedID).set('html', created);
        $(self.fieldCreatedByID).set('html', (createdby == null)? data['created_by'] : createdby);
    }

    self.addEvents = function()
    {
        //EXPAND NOTES
        $(self.fieldMoreID).removeEvents();
        $(self.fieldMoreID).addEvent('click', function(e)
        {
            e.preventDefault();
            // toggle view
            if (!$(self.fieldNotesID).hasClass('edit')) {
                if ($(self.fieldNotesID).hasClass('expand')) {
                    $(self.fieldNotesID).removeClass('expand');
                    $(self.fieldMoreID).set('html', 'Read more');
                } else {
                    $(self.fieldNotesID).addClass('expand');
                    $(self.fieldMoreID).set('html', 'Read less');
                }
            }
        });

        //EDIT BUTTON EVENT
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (username == data['created_by']) {
                $(self.editButtonID).set('html', '');
                $(self.deleteButtonID).set('html', '');
                new ProjectNotesEdit(data, self).init();
            }
        });

        //DELETE BUTTON EVENT
        $(self.deleteButtonID).removeEvents();
        $(self.deleteButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (username == data['created_by']) {
                new ConfirmModal(
                    'Confirm Delete',
                    'Are you sure you want to delete this note?',
                    'Delete',
                    self.postAjaxData)
                .show();
            }
        });
    }

    self.updateData = function(update)
    {
        update.each(function(val, key){
            data[key] = val;
        });
    }
}

var ProjectNotesEdit = function(data, caller)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/update';
    self._request = null;

    //fields
    self.fieldNotesID   = 'project-notes-edit-notes_'+data['note_id'];
    self.csrfID         = 'project-notes-list-csrf';

    //buttons
    self.saveButtonID   = 'project-notes-edit-save_'+data['note_id'];
    self.cancelButtonID = 'project-notes-edit-cancel_'+data['note_id'];

    self.editHTML   = '<div style="text-align:center;">'
                    +   '<textarea id="'+self.fieldNotesID+'" rows="8" style="width:95%; margin:auto;"></textarea>'
                    +   '<div class="note-foot field-action-content">'
                    +       '<div class="pseudo-field pseudo-button">'
                    +           '<a id="'+self.cancelButtonID+'" class="cancel" href="#">Cancel</a>'
                    +       '</div>'
                    +       '<div class="pseudo-field pseudo-button primary-button">'
                    +           '<button id="'+self.saveButtonID+'">Save Changes</button>'
                    +       '</div>'
                    +   '</div>'
                    + '</div>';

    self.init = function()
    {
        $(caller.fieldNotesConID).set('html', self.editHTML);
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN': $(self.csrfID).value,
                'note_id'       : data['note_id'],
                'notes'         : $(self.fieldNotesID).value.trim(),
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
                        caller.updateData(new Hash(response['data']));
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
        $(self.fieldNotesID).value = data['notes'].replace(/&lt/g, '<');
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
            caller.init();
        });
    }
}

var ProjectNotesSite = {
    mainObj     : null,
    createObj   : null,

    activeView  : '',

    init: function(project_id)
    {
        var self = this;
        self.initObj(project_id);
    },

    initObj: function(project_id)
    {
        var self = this;
        self.closeActive();
        self.mainObj = new ProjectNotesList(project_id);
        self.mainObj.init();
    },

    initCreate: function(project_id)
    {
        var self = this;
        self.closeActive();
        self.createObj = new ProjectNotesCreate(project_id);
        self.createObj.init();
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
        }
        self.activeView = '';
    }
}