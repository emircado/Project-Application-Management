var ProjectNotesList = function(project_id)
{
    var self = this;
    self.getDataURL = baseURL + '/notes/list';
    self.postDataURL = baseURL + '/notes/delete';
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
    self.viewButtonID   = 'div[id^=project-notes-list-view_]';
    self.editButtonID   = 'a[id^=project-notes-list-edit_]';
    self.deleteButtonID = 'a[id^=project-notes-list-delete_]';
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
                'page'          : self.currentPage,
                'project_id'    : project_id,
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

    self.postAjaxData = function(note_id)
    {
        console.log('deleting...'+note_id);
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'note_id'           : note_id,
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
                        // $(self.backButtonID).click();
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

    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            Array.each(self.resultData, function(val, idx)
            {
                var created = (val['date_created'] == null || val['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(val['date_created']);
                var createdby = ProjectsSite.ldapUsersObj.ldapUsersData.get(val['created_by']);

                contentHTML = '<td class="note">'
                            +   '<div class="note-head">'
                            +       '<b>'+createdby+'</b>';
                
                if (username == val['created_by'])
                {
                    contentHTML +=  '<div style="float:right;">'
                                +       '<a id="project-notes-list-edit_'+idx+'" href="#">Edit</a> '
                                +       '<a id="project-notes-list-delete_'+idx+'" href="#">Delete</a>'
                                +   '</div>';
                }
                
                contentHTML +=  '</div>'
                            +   '<div id="project-notes-list-view_'+idx+'" class="note-body"><pre>'+val['notes']+'</div>'
                            +   '<div class="note-foot"><i>'+created+'</i></div>'
                            + '</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                });
                
                contentElem.inject($(self.tableID), 'bottom');
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
        
        //VIEW CONTACT PERSON
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            // var idx = parseInt($(this).get('id').split('_')[1]);
            // ProjectNotesSite.initView(self.resultData[idx]);
            //toggle view
            if ($(this).hasClass('expand')) {
                $(this).removeClass('expand');
            } else {
                $(this).addClass('expand');
            }
        });

        //EDIT CONTACT PERSON
        $$(self.editButtonID).removeEvents();
        $$(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var idx = parseInt($(this).get('id').split('_')[1]);
            ProjectNotesSite.initEdit(self.resultData[idx]);
        });

        //DELETE CONTACT PERSON
        $$(self.deleteButtonID).removeEvents();
        $$(self.deleteButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var idx = parseInt($(this).get('id').split('_')[1]);
            new ConfirmModal(
                'Confirm Delete',
                'Are you sure you want to delete this note from the list?',
                'Delete',
                function() {
                    self.postAjaxData(self.resultData[idx]['note_id']);    
                })
            .show();
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

var ProjectNotesEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/notes/update';
    self._request = null;

    self.containerID    = 'project-notes-edit';

    //fields
    self.fieldNotesID   = 'project-notes-edit-notes';
    self.csrfID         = 'project-notes-edit-csrf';

    //buttons
    self.saveButtonID   = 'project-notes-edit-save-button';
    self.cancelButtonID = 'project-notes-edit-cancel-button';

    self.init = function()
    {
        
        
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
            
        });
    }
}

var ProjectNotesSite = {
    mainObj     : null,
    createObj   : null,
    editObj     : null,

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

    initEdit: function(data)
    {
        var self = this;
        self.closeActive();
        self.editObj = new ProjectNotesEdit(data);
        self.editObj.init();
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