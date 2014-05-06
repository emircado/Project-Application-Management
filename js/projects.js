var ProjectsList = function()
{
    var self = this;
    
    self.getDataURL = baseURL + '/projects/list';
    
    //for data gathering
    self.tableContainerID       = 'data-result';
    self._request               = null;
    self.totalPage        = 1;
    self.currentPage      = 1;
    self.resultData       = [];

    //for pagination
    self.pageLimit        = '';
    self.prevID           = 'prev-main-button';
    self.nextID           = 'next-main-button';
    self.totalDataID      = 'total-main-data';
    self.totalPartID      = 'total-main-part';

    //for table
    self.projectListID    = 'projects-lists';
    self.tableRowClass    = 'data-row';

    //for search
    self.searchNameID     = 'search-name';
    self.searchCodeID     = 'search-code';
    self.searchStatusID   = 'search-status';
    self.searchSubmitID   = 'search-submit';
    self.searchClearID    = 'clear-search';
    self.searchParams     = {
        'name'      : '',
        'code'      : '',
        'status'    : ''
    };
    
    //actions
    self.createButtonID = 'create-project';
    self.viewID = 'a[id^=view_]';

    self.init = function()
    {
        $$('.'+self.tableRowClass).dispose();
        $(self.projectListID).setStyle('display', 'block');
        self.getAjaxData();
    }
    
    self.getAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'page'      : self.currentPage,
                'name'      : self.searchParams['name'],
                'code'      : self.searchParams['code'],
                'status'    : self.searchParams['status'],
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
                    console.log('got new data '+data.totalData);
                },
                'onError' : function(data)
                {
                    self._request.stop;
                    console.log('Something went wrong!');
                }
            }).send();
        }
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
        var start   = (self.pageLimit * self.currentPage) - self.pageLimit + 1;
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
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['code']+'</td>'                        
                            + '<td>'+val['description']+'</td>'
                            + '<td>'+val['status']+'</td>'
                            + '<td>'+val['production_date_formatted']+'</td>'
                            + '<td class="actions-col three-column">'
                            + '<a id="view_' + idx + '" href="#" title="View Project"><span class="">View</span></a>&nbsp'
                            + '</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html' : contentHTML
                });
                
                contentElem.inject($(self.tableContainerID), 'bottom');
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

            contentElem.inject($(self.tableContainerID), 'bottom');
        }
    }

    self.clearSearch = function()
    {
        self.currentPage = 1;
        self.searchParams['name'] = '';
        self.searchParams['code'] = '';
        self.searchParams['status'] = '';

        $(self.searchNameID).value = '';
        $(self.searchCodeID).value = '';
        $(self.searchStatusID).value = '';    
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
        $(self.searchSubmitID).removeEvents();
        $(self.searchSubmitID).addEvent('click', function(e)
        {
            e.preventDefault();

            self.currentPage = 1;
            self.searchParams['name'] = $(self.searchNameID).value.trim();
            self.searchParams['code'] = $(self.searchCodeID).value.trim();
            self.searchParams['status'] = $(self.searchStatusID).value;
            self.init();
        });

        //EVENT FOR SEARCH CODE FIELD KEYPRESS
        $(self.searchCodeID).removeEvents();
        $(self.searchCodeID).addEvent('keypress', function(e)
        {
            e.preventDefault();
            if ($(this).value.length < 5)
            {   
                var c = String.fromCharCode(e.event.charCode);
                if (/[a-zA-Z0-9]/.test(c)) {
                    $(this).value+=c.toUpperCase();
                }
            }
        });

        //EVENT FOR CLEAR SEARCH FIELDS
        $(self.searchClearID).removeEvents();
        $(self.searchClearID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.clearSearch();
        });

        //EVENT FOR VIEWING A PROJECT
        $$(self.viewID).removeEvents();
        $$(self.viewID).addEvent('click',function(e)
        {
            e.preventDefault();
            $(self.projectListID).setStyle('display', 'none');
            ProjectsSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
        });

        //EVENT FOR CREATING A NEW PROJECT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.projectListID).setStyle('display', 'none');
            ProjectsSite.initCreate();
        });
    };
};

var ProjectsCreate = function()
{
    var self = this;
    self.postDataURL = baseURL + '/projects/create';
    self._request = null;

    //display
    self.createProjectViewID = 'create-projects-view';

    //buttons
    self.createSaveButtonID = 'create-button-create-project';
    self.createCancelButtonID = 'create-button-cancel';

    //fields
    self.createNameID = 'create-name';
    self.createCodeID = 'create-code';
    self.createDescriptionID = 'create-description';
    self.createProductionID = 'create-production';

    //error displays
    self.createNameErrorID = 'create-name-error';
    self.createCodeErrorID = 'create-code-error';
    self.createDescriptionErrorID = 'create-description-error';
    self.createProductionErrorID = 'create-production-error';

    //csrf
    self.createCSRFID = 'create-csrf';

    self.init = function()
    {
        $(self.createProjectViewID).setStyle('display', 'block');
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.createCSRFID).value,
                'project_id'        : '',
                'name'              : $(self.createNameID).value.trim(),
                'code'              : $(self.createCodeID).value.trim(),
                'description'       : $(self.createDescriptionID).value.trim(),
                'production_date'   : $(self.createProductionID).value.trim()
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
                                $(self.createCodeErrorID).set('html', msg[1]);
                                $(self.createCodeErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        $(self.createCancelButtonID).click();
                    }
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong.');
                },
                'onComplete': function(data)
                {
                    $(self.createCancelButtonID).click();
                }
            }).send();
        }
    };

    self.addEvents = function()
    {
        //EVENT FOR SAVING CHANGES BUTTON IN EDIT/CREATE PROJECT
        $(self.createSaveButtonID).removeEvents();
        $(self.createSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();

            //hide error messages
            $(self.createNameErrorID).setStyle('display', 'none');

            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT/CREATE PROJECT
        $(self.createCancelButtonID).removeEvents();
        $(self.createCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();

            ProjectsSite.mainObj.clearSearch();
            $(self.createProjectViewID).setStyle('display', 'none');
            ProjectsSite.mainObj.init();

            //clear form
            $(self.createNameID).value = '';
            $(self.createCodeID).value = '';
            $(self.createDescriptionID).value = '';
            $(self.createProductionID).value = '0000-00-00';
        });

        //EVENT FOR CODE INPUT FIELD - UPPERCASE INPUTS ONLY, 5 CHARS
        $(self.createCodeID).removeEvents();
        $(self.createCodeID).addEvent('keypress', function(e)
        {
            e.preventDefault();
            if ($(this).value.length < 5)
            {   
                var c = String.fromCharCode(e.event.charCode);
                if (/[a-zA-Z0-9]/.test(c)) {
                    $(this).value+=c.toUpperCase();
                }
            }
        });
    }
}

var ProjectsView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/projects/changestatus';
    self._request = null;

    //for view project
    self.viewProjectViewID = 'view-projects-view';
    self.viewToMainID  = 'view-to-main';
    self.viewContentID = 'view-content';

    //fields
    self.viewNameID = 'view-name';
    self.viewCodeID = 'view-code';
    self.viewDescriptionID = 'view-description';
    self.viewProductionID = 'view-production';
    self.viewCreatedID = 'view-created';
    self.viewUpdatedID = 'view-updated';
    self.viewStatusID = 'view-status';
    self.viewTerminationID = 'view-termination';
    self.viewTerminationFieldID = 'view-termination-field';

    //for edit
    self.editID = 'edit';
    self.deleteID = 'delete';

    //for change status
    self.viewChangeStatusID = 'a[id^=view-button-change-status]';
    self.viewCSRFID = 'view-csrf';

    self.init = function()
    {
        $(self.viewProjectViewID).setStyle('display', 'block');

        self.renderData();
        self.addEvents();
        ContactPersonsSite.init(data['project_id']);
        PointPersonsSite.init(data['project_id']);
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.viewCSRFID).value,
                'project_id'        : data['project_id'],
                'status'            : data['status']
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
                        var d = response['data'];
                        data['status'] = d['status'];
                        data['termination_date'] = d['termination_date'];
                        data['termination_date_formatted'] = d['termination_date_formatted'];
                        data['date_updated'] = d['date_updated'];
                        data['date_updated_formatted'] = d['date_updated_formatted'];

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
                'YII_CSRF_TOKEN'    : $(self.viewCSRFID).value,
                'project_id'        : data['project_id'],
            };

            self._request = new Request.JSON(
            {
                'url' : baseURL + '/projects/delete',
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    console.log('success');
                    console.log(response);

                    $(self.viewToMainID).click();
                    // if (response['type'] == 'error') {
                    //     self._request.stop;
                    //     console.log('error type 2');
                    // } else if (response['type'] == 'success') {
                    //     var d = response['data'];
                    //     data['status'] = d['status'];
                    //     data['termination_date'] = d['termination_date'];
                    //     data['termination_date_formatted'] = d['termination_date_formatted'];
                    //     data['date_updated'] = d['date_updated'];
                    //     data['date_updated_formatted'] = d['date_updated_formatted'];

                    //     self.init();
                    // }
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
        $(self.viewNameID).set('html', data['name']);
        $(self.viewCodeID).set('html', data['code']);
        $(self.viewDescriptionID).set('html', data['description']);
        $(self.viewProductionID).set('html', data['production_date_formatted']);
        $(self.viewCreatedID).set('html', data['date_created_formatted']);
        $(self.viewStatusID).set('html', data['status']);
        $(self.viewTerminationID).set('html', data['termination_date_formatted']);
        $(self.viewUpdatedID).set('html', data['date_updated_formatted']);

        if (data['status'] == 'TERMINATED') {
            $(self.viewTerminationFieldID).setStyle('display', 'block');
        } else {
            $(self.viewTerminationFieldID).setStyle('display', 'none');
        }
    }

    self.addEvents = function()
    {
        //EVENT FOR GOING BACK TO MAIN FROM VIEW
        $(self.viewToMainID).removeEvents();
        $(self.viewToMainID).addEvent('click', function(e)
        {
            e.preventDefault();
            ProjectsSite.mainObj.clearSearch();

            $(self.viewProjectViewID).setStyle('display', 'none');
            ProjectsSite.mainObj.init();
        });

        //EVENT FOR EDITING A PROJECT
        $(self.editID).removeEvents();
        $(self.editID).addEvent('click', function(e)
        {
            e.preventDefault();            

            $(self.viewProjectViewID).setStyle('display', 'none');
            ProjectsSite.initEdit(data);
        });

        //EVENT FOR CHANGING PROJECT STATUS
        $$(self.viewChangeStatusID).removeEvents();
        $$(self.viewChangeStatusID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (confirm('Are you sure you want to change the project\'s status?'))
            {
                self.postAjaxData();
            }
        });

        //EVENT FOR DELETING A PROJECT
        $(self.deleteID).removeEvents();
        $(self.deleteID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (confirm('Are you sure you want to delete the project?'))
            {
                self.deleteProject();
            }
        });
    }
}

var ProjectsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/projects/update';

    //for edit project
    self.editProjectViewID = 'edit-projects-view';
    self.editContentID = 'edit-content';
    self.editSaveButtonID = 'edit-button-update-project';
    self.editCancelButtonID = 'edit-button-cancel';

    //fields
    self.editNameID = 'edit-name';
    self.editCodeID = 'edit-code';
    self.editDescriptionID = 'edit-description';
    self.editProductionID = 'edit-production';

    //error messages
    self.editNameErrorID = 'edit-name-error';
    self.editCodeErrorID = 'edit-code-error';
    self.editDescriptionErrorID = 'edit-description-error';
    self.editProductionErrorID = 'edit-production-error';

    //for csrf
    self.editCSRFID = 'edit-csrf';

    self.init = function()
    {
        $(self.editProjectViewID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.editCSRFID).value,
                'project_id'        : data['project_id'],
                'name'              : $(self.editNameID).value.trim(),
                'code'              : $(self.editCodeID).value.trim(),
                'description'       : $(self.editDescriptionID).value.trim(),
                'status'            : data['status'],
                'production_date'   : $(self.editProductionID).value,
                'termination_date'  : data['termination_date'],
                'date_created'		: data['date_created'],
                'date_updated'		: data['date_updated']
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
                                $(self.editCodeErrorID).set('html', msg[1]);
                                $(self.editCodeErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });

                    } else if (response['type'] == 'success') {
                        data = response['data'];
                        $(self.editCancelButtonID).click();
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
        $(self.editNameID).value = data['name'];
        $(self.editCodeID).value = data['code'];
        $(self.editDescriptionID).value = data['description'];
        $(self.editProductionID).value = data['production_date'];
    }

    self.addEvents = function()
    {
        //EVENT FOR SAVING CHANGES BUTTON IN EDIT PROJECT
        $(self.editSaveButtonID).removeEvents();
        $(self.editSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT PROJECT
        $(self.editCancelButtonID).removeEvents();
        $(self.editCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.editProjectViewID).setStyle('display', 'none');
            ProjectsSite.initView(data);

            //clear form
            $(self.editNameID).value = '';
            $(self.editCodeID).value = '';
            $(self.editDescriptionID).value = '';
            $(self.editProductionID).value = '0000-00-00';
        });
    }
}

var ProjectsSite = {
    mainObj         : null,
    createObj       : null,
    ldapObj         : null,

    init: function()
    {
        var self = this;
        self.initObj();
        self.initLDAP();
    },

    initObj: function()
    {
        var self = this;

        // if (self.mainObj == null)
        // {
            self.mainObj = new ProjectsList();
        // }
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

    initLDAP: function()
    {
        var self = this;
        if (self.ldapObj == null)
        {
            self.ldapObj = new LDAPData();
        }
        self.ldapObj.init();
    }
}

var LDAPData = function()
{
    var self = this;
    self._request = null;

    self.ldapData = [];

    self.init = function()
    {
        self.getLDAPData();
    }

    self.getLDAPData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            self._request = new Request.JSON(
            {
                'url' : baseURL + '/pointpersons/getldapdata',
                'method' : 'get',
                'onSuccess': function(response)
                {
                    self.ldapData = response;
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                }
            }).send();
        }
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