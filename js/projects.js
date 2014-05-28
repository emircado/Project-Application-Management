var ProjectsList = function()
{
    var self = this;
    self.getDataURL = baseURL + '/projects/list';
    self._request         = null;
    
    self.containerID      = 'projects-list';

    //for pagination
    self.prevID          = 'projects-list-prev';
    self.nextID          = 'projects-list-next';
    self.totalDataID     = 'projects-list-total';
    self.totalPartID     = 'projects-list-part';

    //for table
    self.tableID         = 'projects-list-table';
    self.totalPage       = 1;
    self.currentPage     = 1;
    self.resultData      = [];
    self.tableRowClass   = 'projects-list-row';

    //fields
    self.fieldNameID     = 'projects-list-search-name';
    self.fieldCodeID     = 'projects-list-search-code';
    self.fieldStatusID   = 'projects-list-search-status';
    
    //buttons
    self.createButtonID  = 'projects-list-create-button';
    self.viewButtonID    = 'a[id^=projects-list-view_]';
    self.searchButtonID  = 'search-submit';
    self.clearButtonID   = 'projects-list-clear-button';
    self.searchParams    = {
        'name'      : '',
        'code'      : '',
        'status'    : ''
    };

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
                'page'      : self.currentPage,
                'name'      : self.searchParams['name'].trim(),
                'code'      : self.searchParams['code'].trim(),
                'status'    : self.searchParams['status'].trim(),
            };
            
            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
                'onSuccess' : function(data)
                {
                    self.currentPage = data.page;
                    self.totalPage = data.totalPage;
                    self.resultData = data.resultData;
                    self.pageLimit = data.limit;
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

    self.rowComparator = function(a,b) {
        if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
        if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
        return 0;
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
    };
    
    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            Array.each(self.resultData, function(val, idx)
            {
                var production = (val['production_date'] == null || val['production_date'] == '0000-00-00')? '' : DateFormatter.formatDate(val['production_date']);

                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['code']+'</td>'                        
                            + '<td>'+val['description']+'</td>'
                            + '<td>'+val['status']+'</td>'
                            + '<td>'+production+'</td>'
                            + '<td class="actions-col three-column">'
                            + '<a id="projects-list-view_' + idx + '" href="#" title="View Project">View</a>&nbsp'
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
            
            contentHTML = '<td>No results found</td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html' : contentHTML
            });

            contentElem.inject($(self.tableID), 'bottom');
        }
    }

    self.clearSearch = function()
    {
        self.currentPage = 1;
        self.searchParams['name'] = '';
        self.searchParams['code'] = '';
        self.searchParams['status'] = '';

        $(self.fieldNameID).value = '';
        $(self.fieldCodeID).value = '';
        $(self.fieldStatusID).value = '';    
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

        //EVENT FOR SEARCH BUTTON
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();

            self.currentPage = 1;
            self.searchParams['name'] = $(self.fieldNameID).value.trim();
            self.searchParams['code'] = $(self.fieldCodeID).value.trim();
            self.searchParams['status'] = $(self.fieldStatusID).value;
            self.init();
        });

        //EVENT FOR SEARCH CODE FIELD INPUT
        $(self.fieldCodeID).removeEvents();
        $(self.fieldCodeID).addEvent('input', function(e)
        {
            e.preventDefault();
            $(this).value = $(this).value.substr(0,5).toUpperCase().replace(/[^a-zA-Z0-9]/i, '');
            // e.preventDefault();
            // if ($(this).value.length < 5)
            // {   
            //     var c = String.fromCharCode(e.event.charCode);
            //     if (/[a-zA-Z0-9]/.test(c)) {
            //         $(this).value+=c.toUpperCase();
            //     }
            // }
        });

        //EVENT FOR CLEAR SEARCH FIELDS
        $(self.clearButtonID).removeEvents();
        $(self.clearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.clearSearch();
        });

        //EVENT FOR VIEWING A PROJECT
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click',function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ProjectsSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
        });

        //EVENT FOR CREATING A NEW PROJECT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ProjectsSite.initCreate();
        });
    };
};

var ProjectsCreate = function()
{
    var self = this;
    self.postDataURL = baseURL + '/projects/create';
    self._request = null;

    self.containerID = 'projects-create';

    //buttons
    self.saveButtonID = 'projects-create-save-button';
    self.cancelButtonID = 'projects-create-cancel-button';

    //fields
    self.fieldNameID = 'projects-create-name';
    self.fieldCodeID = 'projects-create-code';
    self.fieldDescriptionID = 'projects-create-description';
    self.fieldProductionID = 'projects-create-production';
    self.csrfID = 'projects-create-csrf';

    //errors
    self.errorCodeID = 'projects-create-code-error';

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
                'name'              : $(self.fieldNameID).value.trim(),
                'code'              : $(self.fieldCodeID).value.trim(),
                'description'       : $(self.fieldDescriptionID).value.trim(),
                'production_date'   : $(self.fieldProductionID).value.trim()
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
                            if (msg[0] == 'CODE_ERROR') {
                                $(self.errorCodeID).set('html', msg[1]);
                                $(self.errorCodeID).setStyle('display', 'block');
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
                    console.log('something went wrong.');
                }
            }).send();
        }
    };

    self.addEvents = function()
    {
        //EVENT FOR SAVING CHANGES BUTTON IN EDIT/CREATE PROJECT
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorCodeID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT/CREATE PROJECT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ProjectsSite.mainObj.clearSearch();
            $(self.containerID).setStyle('display', 'none');

            //clear form
            $(self.fieldNameID).value = '';
            $(self.fieldCodeID).value = '';
            $(self.fieldDescriptionID).value = '';
            $(self.fieldProductionID).value = '0000-00-00';

            ProjectsSite.mainObj.init();
        });

        //EVENT FOR CODE FIELD INPUT
        $(self.fieldCodeID).removeEvents();
        $(self.fieldCodeID).addEvent('input', function(e)
        {
            e.preventDefault();
            $(this).value = $(this).value.substr(0,5).toUpperCase().replace(/[^a-zA-Z0-9]/i, '');
            // e.preventDefault();
            // if ($(this).value.length < 5)
            // {   
            //     var c = String.fromCharCode(e.event.charCode);
            //     if (/[a-zA-Z0-9]/.test(c)) {
            //         $(this).value+=c.toUpperCase();
            //     }
            // }
        });

        //EVENT FOR CHOOSE PRODUCTION DATE
        // $(self.fieldProductionID).removeEvents();
        // $(self.fieldProductionID).addEvent('focus', function(e) 
        // {
        //     e.preventDefault();
        //     $(this).blur();

        //     picker = new DatePicker('#'+self.fieldProductionID, {
        //         timePicker: false,
        //         pickerClass: 'datepicker_vista',
        //         onSelect: function(date) {
        //             $(self.fieldProductionID).value = date.formatter('%s');
        //         }
        //     });
        //     picker.show();
        // });
    }
}

var ProjectsView = function(data)
{
    var self = this;
    self.changeStatusURL = baseURL + '/projects/changestatus';
    self.deleteURL = baseURL + '/projects/delete';
    self._request = null;

    self.containerID            = 'projects-view';

    //fields
    self.fieldNameID            = 'projects-view-name';
    self.fieldCodeID            = 'projects-view-code';
    self.fieldDescriptionID     = 'projects-view-description';
    self.fieldProductionID      = 'projects-view-production';
    self.fieldCreatedID         = 'projects-view-created';
    self.fieldCreatedByID       = 'projects-view-createdby';
    self.fieldUpdatedID         = 'projects-view-updated';
    self.fieldUpdatedByID       = 'projects-view-updatedby';
    self.fieldStatusID          = 'projects-view-status';
    self.fieldTerminationID     = 'projects-view-termination';
    self.fieldTerminationConID  = 'projects-view-termination-con';
    self.csrfID                 = 'projects-view-csrf';

    //buttons
    self.backButtonID           = 'projects-view-back-button';
    self.editButtonID           = 'projects-view-edit-button';
    self.deleteButtonID         = 'projects-view-delete-button';
    self.changeButtonID         = 'projects-view-change-button';

    self.init = function()
    {
        $(self.containerID).setStyle('display', 'block');

        self.renderData();
        self.addEvents();
        ProjectNotesSite.init(data['project_id']);
        ContactPersonsSite.init(data['project_id']);
        PointPersonsSite.init(data['project_id']);
        ApplicationsSite.init(data['project_id']);

    }

    self.changeStatus = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'project_id'        : data['project_id'],
                'status'            : data['status']
            };

            self._request = new Request.JSON(
            {
                'url' : self.changeStatusURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'error') {
                        self._request.stop;
                        console.log('error type 2');
                    } else if (response['type'] == 'success') {
                        data['status']              = response['data']['status'];
                        data['termination_date']    = response['data']['termination_date'];
                        data['date_updated']        = response['data']['date_updated'];
                        data['updated_by']          = response['data']['updated_by'];

                        self.init();
                    }
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('error type 1');
                }
            }).send();
        }
    };

    self.deleteProject = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'project_id'        : data['project_id'],
            };

            self._request = new Request.JSON(
            {
                'url' : self.deleteURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    console.log(response);
                    $(self.backButtonID).click();
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('error type 1');
                }
            }).send();
        }
    };

    self.renderData = function()
    {
        // format display data
        var createdby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['created_by']);
        var updatedby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);
        var termination = (data['termination_date'] == null || data['termination_date'] == '0000-00-00')? 'mm' : DateFormatter.formatDate(data['termination_date']);
        var production = (data['production_date'] == null || data['production_date'] == '0000-00-00')? '' : DateFormatter.formatDate(data['production_date']);

        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldCodeID).set('html', data['code']);
        $(self.fieldDescriptionID).set('html', '<pre>'+data['description']);
        $(self.fieldStatusID).set('html', data['status']);
        $(self.fieldProductionID).set('html', production);
        $(self.fieldTerminationID).set('html', termination);
        $(self.fieldCreatedID).set('html', created);
        $(self.fieldUpdatedID).set('html', updated);
        $(self.fieldCreatedByID).set('html', (createdby == null)? data['created_by'] : createdby);
        $(self.fieldUpdatedByID).set('html', (updatedby == null)? data['updated_by'] : updatedby);

        if (data['status'] == 'TERMINATED') {
            $(self.fieldTerminationConID).setStyle('display', 'block');
        } else {
            $(self.fieldTerminationConID).setStyle('display', 'none');
        }
    }

    self.addEvents = function()
    {
        //EVENT FOR GOING BACK TO MAIN FROM VIEW
        $(self.backButtonID).removeEvents();
        $(self.backButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ProjectsSite.mainObj.clearSearch();

            $(self.containerID).setStyle('display', 'none');
            ProjectsSite.mainObj.init();
        });

        //EVENT FOR EDITING A PROJECT
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();            

            $(self.containerID).setStyle('display', 'none');
            ProjectsSite.initEdit(data);
        });

        //EVENT FOR CHANGING PROJECT STATUS
        $(self.changeButtonID).removeEvents();
        $(self.changeButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            new ConfirmModal(
                'Confirm Change Status',
                'Are you sure you want to change the project\'s status?',
                'Change',
                self.changeStatus)
            .show();
        });

        //EVENT FOR DELETING A PROJECT
        $(self.deleteButtonID).removeEvents();
        $(self.deleteButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            new ConfirmModal(
                'Confirm Delete', 
                'Are you sure you want to delete the project?', 
                'Delete', 
                self.deleteProject)
            .show();
        });
    }
}

var ProjectsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/projects/update';
    self._request = null;

    self.containerID        = 'projects-edit';

    //fields
    self.fieldNameID        = 'projects-edit-name';
    self.fieldCodeID        = 'projects-edit-code';
    self.fieldDescriptionID = 'projects-edit-description';
    self.fieldProductionID  = 'projects-edit-production';
    self.csrfID             = 'projects-edit-csrf';

    //errors
    self.errorCodeID        = 'projects-edit-code-error';

    //buttons
    self.saveButtonID       = 'projects-edit-save-button';
    self.cancelButtonID     = 'projects-edit-cancel-button';

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
                'code'              : $(self.fieldCodeID).value.trim(),
                'description'       : $(self.fieldDescriptionID).value.trim(),
                'production_date'   : $(self.fieldProductionID).value.trim(),
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess' : function(response)
                {
                    if (response['type'] == 'error') {
                        self._request.stop;
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'CODE_ERROR') {
                                $(self.errorCodeID).set('html', msg[1]);
                                $(self.errorCodeID).setStyle('display', 'block');
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });

                    } else if (response['type'] == 'success') {
                        data['name']            = response['data']['name'];
                        data['code']            = response['data']['code'];
                        data['description']     = response['data']['description'];
                        data['production_date'] = response['data']['production_date'];
                        data['updated_by']      = response['data']['updated_by'];
                        data['date_updated']    = response['data']['date_updated'];

                        $(self.cancelButtonID).click();
                    }
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                }
            }).send();
        }
    };

    self.renderData = function()
    {
        $(self.fieldNameID).value = data['name'];
        $(self.fieldCodeID).value = data['code'];
        $(self.fieldDescriptionID).value = data['description'];
        $(self.fieldProductionID).value = data['production_date'];
    }

    self.addEvents = function()
    {
        //EVENT FOR SAVING CHANGES BUTTON IN EDIT PROJECT
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorCodeID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT PROJECT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ProjectsSite.initView(data);

            //clear form
            $(self.fieldNameID).value = '';
            $(self.fieldCodeID).value = '';
            $(self.fieldDescriptionID).value = '';
            $(self.fieldProductionID).value = '0000-00-00';
        });

        //EVENT FOR SEARCH CODE FIELD INPUT
        $(self.fieldCodeID).removeEvents();
        $(self.fieldCodeID).addEvent('input', function(e)
        {
            e.preventDefault();
            $(this).value = $(this).value.substr(0,5).toUpperCase().replace(/[^a-zA-Z0-9]/i, '');
            // e.preventDefault();
            // if ($(this).value.length < 5)
            // {   
            //     var c = String.fromCharCode(e.event.charCode);
            //     if (/[a-zA-Z0-9]/.test(c)) {
            //         $(this).value+=c.toUpperCase();
            //     }
            // }
        });
    }
}

var ProjectsSite = {
    mainObj         : null,
    createObj       : null,
    // data objects
    ldapGroupsObj   : null,
    ldapUsersObj    : null,
    appTypesObj     : null,
    appServersObj   : null,


    init: function()
    {
        var self = this;
        self.initLDAPGroups();
        self.initLDAPUsers();
        self.initAppTypes();
        self.initAppServers();
        self.initObj();
    },

    initObj: function()
    {
        var self = this;
        self.mainObj = new ProjectsList();
        self.mainObj.init();
    },

    initCreate: function()
    {
        var self = this;

        if (self.createObj == null)
        {
            self.createObj = new ProjectsCreate();
        }
        self.createObj.init();
    },

    initEdit: function(data)
    {
        var self = this;
        new ProjectsEdit(data).init();
    },

    initView: function(data)
    {
        var self = this;
        new ProjectsView(data).init();
    },

    initLDAPGroups: function()
    {
        var self = this;
        self.ldapGroupsObj = new LDAPGroupsData();
        self.ldapGroupsObj.init();
    },

    initLDAPUsers: function()
    {
        var self = this;
        self.ldapUsersObj = new LDAPUsersData();
        self.ldapUsersObj.init();
    },

    initAppTypes: function()
    {
        var self = this;
        self.appTypesObj = new AppTypesData();
        self.appTypesObj.init();
    },

    initAppServers: function()
    {
        var self = this;
        self.appServersObj = new AppServersData();
        self.appServersObj.init();
    }
}

window.addEvent('domready', function()
{
    ProjectsSite.init();
});

//DETECT REFRESH
// window.addEvent('keydown', function(e)
// {
//     if (e.code == 116) {
//         e.preventDefault();
//         e.keyCode = 0;
//     }
// })