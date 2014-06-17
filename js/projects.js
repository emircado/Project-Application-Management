var ProjectsData = function()
{
    var self = this;
    self.getDataURL = baseURL + '/projects/list';
    self._request = null;

    self.getAjaxData = function(params, onRetrieve, onFail)
    {
        if(!self._request || !self._request.isRunning())
        {
            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
                'onSuccess' : function(data)
                {
                    if (params['project_id'] != null) {
                        if (data.totalData == 0) {
                            console.log('data not available');
                            onFail();
                        } else {
                            console.log('displaying individual');
                            onRetrieve(data.resultData[0]);
                        }
                    } else {
                        console.log('displaying list');
                        onRetrieve(data);
                    }
                },
                'onError' : function(data)
                {
                    self._request.stop;
                    console.log('Something went wrong!');
                }
            }).send();
        }
    }
}

var ProjectsList = function()
{
    var self            = this;
    self.containerID    = 'projects-list';

    //for pagination
    self.prevID         = 'projects-list-prev';
    self.nextID         = 'projects-list-next';
    self.totalDataID    = 'projects-list-total';
    self.totalPartID    = 'projects-list-part';

    //for table
    self.tableID        = 'projects-list-table';
    self.resultData     = [];
    self.lookupData     = new Hash();
    self.tableRowClass  = 'projects-list-row';

    //fields
    self.fieldNameID    = 'projects-list-search-name';
    self.fieldCodeID    = 'projects-list-search-code';
    self.fieldStatusID  = 'projects-list-search-status';
    self.csrfID         = 'projects-list-csrf';

    //buttons
    self.createButtonID = 'projects-list-create-button';
    self.viewButtonID   = 'tr[id^=projects-list-view_]';
    self.searchButtonID = 'search-submit';
    self.clearButtonID  = 'projects-list-clear-button';

    self.init = function()
    {
        ProjectsSite.activeView = 'LIST';
        ProjectsSite.dataObj.getAjaxData({
            'page'  : ProjectsSite.searchParams['page'],
            'name'  : ProjectsSite.searchParams['name'],
            'code'  : ProjectsSite.searchParams['code'],
            'status': ProjectsSite.searchParams['status'],
            'YII_CSRF_TOKEN': $(self.csrfID).value,
        }, self.getData, function(){});
        
        $(ProjectsSite.titleID).set('html', 'Projects');
        $$('.'+self.tableRowClass).dispose();
        $(self.containerID).setStyle('display', 'block');

        $(self.fieldNameID).value   = ProjectsSite.searchParams['name'];
        $(self.fieldCodeID).value   = ProjectsSite.searchParams['code'];
        $(self.fieldStatusID).value = ProjectsSite.searchParams['status'];
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        $(self.fieldNameID).value = '';
        $(self.fieldCodeID).value = '';
        $(self.fieldStatusID).value = '';
        $$('.'+self.tableRowClass).dispose();
    }
    
    self.getData = function(data)
    {
        // detects if page requested is invalid
        if (data.page != ProjectsSite.searchParams['page']) {
            ProjectsSite.processChange = false;
            ProjectsSite.searchParams['page'] = data.page;
            ProjectsSite.historyMngr.set('search', ProjectsSite.searchParams);
        }
        self.currentPage = data.page;
        self.totalPage = data.totalPage;
        self.resultData = data.resultData;
        self.pageLimit = data.limit;

        self.renderData(data.totalData);
        self.addEvents();
        self.paginationChecker();
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
    }
    
    self.renderData = function(count)
    {
        if(count != 0)
        {
            $(self.totalDataID).set('html', ' of '+count);

            self.lookupData = new Hash();
            Array.each(self.resultData, function(val, idx)
            {
                self.lookupData.include(val['project_id'], idx);
                var description = (val['description'].length > 65)? val['description'].substr(0, 65)+'...' : val['description']; 

                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['code']+'</td>'                        
                            + '<td>'+description+'</td>'
                            + '<td>'+val['status']+'</td><td></td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'projects-list-view_'+val['project_id']
                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td colspan="5">No results found</td>';
            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html'  : contentHTML,
            });

            contentElem.inject($(self.tableID), 'bottom');
        }
    }

    self.makeView = function(pid)
    {
        if (typeof pid==='number' && (pid%1)===0 && self.lookupData.has(pid)) {
            console.log('data is from list');
            ProjectsSite.initView(self.resultData[self.lookupData.get(pid)]);
            return true;
        } else {
            return false;
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
                ProjectsSite.historyMngr.set('search', {
                    'page'  : ProjectsSite.searchParams['page']+1,
                    'name'  : ProjectsSite.searchParams['name'],
                    'code'  : ProjectsSite.searchParams['code'],
                    'status': ProjectsSite.searchParams['status'],
                });
            }
        });
        
        //EVENT FOR PREVIOUS PAGE
        $(self.prevID).removeEvents();
        $(self.prevID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != 1) {
                ProjectsSite.historyMngr.set('search', {
                    'page'  : ProjectsSite.searchParams['page']-1,
                    'name'  : ProjectsSite.searchParams['name'],
                    'code'  : ProjectsSite.searchParams['code'],
                    'status': ProjectsSite.searchParams['status'],
                });
            }
        });

        //EVENT FOR SEARCH BUTTON
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ProjectsSite.historyMngr.set('search', {
                'page'  : 1,
                'name'  : $(self.fieldNameID).value.trim(),
                'code'  : $(self.fieldCodeID).value.trim(),
                'status': $(self.fieldStatusID).value.trim(),
            });
        });

        //EVENT FOR SEARCH CODE FIELD INPUT
        $(self.fieldCodeID).removeEvents();
        $(self.fieldCodeID).addEvent('input', function(e)
        {
            e.preventDefault();
            $(this).value = $(this).value.substr(0,5).toUpperCase().replace(/[^a-zA-Z0-9]/i, '');
        });

        //EVENT FOR CLEAR SEARCH FIELDS
        $(self.clearButtonID).removeEvents();
        $(self.clearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.fieldNameID).value = '';
            $(self.fieldCodeID).value = '';
            $(self.fieldStatusID).value = '';
        });

        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e) {
            e.preventDefault();
            var pid = parseInt($(this).get('id').split('_')[1]);
            if (typeof pid==='number' && (pid%1)===0 && self.lookupData.has(pid)) {
                ProjectsSite.historyMngr.set('pid', pid);
            }
        });

        //EVENT FOR CREATING A NEW PROJECT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ProjectsSite.initCreate();
        });
    };
};

var ProjectsCreate = function()
{
    var self = this;
    self.postDataURL        = baseURL + '/projects/create';
    self._request           = null;

    self.containerID        = 'projects-create';

    //buttons
    self.saveButtonID       = 'projects-create-save-button';
    self.cancelButtonID     = 'projects-create-cancel-button';

    //fields
    self.fieldNameID        = 'projects-create-name';
    self.fieldCodeID        = 'projects-create-code';
    self.fieldDescriptionID = 'projects-create-description';
    self.fieldProductionID  = 'projects-create-production';
    self.csrfID             = 'projects-create-csrf';

    //errors
    self.errorNameID        = 'projects-create-name-error';
    self.errorCodeID        = 'projects-create-code-error';

    self.datePicker         = null;

    self.init = function()
    {
        ProjectsSite.activeView = 'CREATE';
        self.datePicker = new DatePicker($(self.fieldProductionID), {
            allowEmpty: true,
            timePicker: false,
            pickerClass: 'datepicker_vista',
            positionOffset: {x: 370, y:-40},
            format: 'M j, Y',
            inputOutputFormat: 'Y-m-d',
        });

        $(ProjectsSite.titleID).set('html', 'Projects');
        $(self.containerID).setStyle('display', 'block');
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        //clear errors
        $(self.errorNameID).setStyle('display', 'none');
        $(self.errorCodeID).setStyle('display', 'none');

        //clear fields
        $(self.fieldNameID).value = '';
        $(self.fieldCodeID).value = '';
        $(self.fieldDescriptionID).value = '';
        $(self.fieldProductionID).value = '';
        $(self.fieldProductionID).getNext().value = '';
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
                            if (msg[0] == 'NAME_ERROR') {
                                $(self.errorNameID).set('html', msg[1]);
                                $(self.errorNameID).setStyle('display', 'block');
                            } else if (msg[0] == 'CODE_ERROR') {
                                $(self.errorCodeID).set('html', msg[1]);
                                $(self.errorCodeID).setStyle('display', 'block');
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        ProjectsSite.historyMngr.set('search', {
                            'page'  : 1,
                            'name'  : '',
                            'code'  : '',
                            'status': '',
                        });
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
            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorCodeID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT/CREATE PROJECT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ProjectsSite.initObj();
        });

        //EVENT FOR CODE FIELD INPUT
        $(self.fieldCodeID).removeEvents();
        $(self.fieldCodeID).addEvent('input', function(e)
        {
            e.preventDefault();
            $(this).value = $(this).value.substr(0,5).toUpperCase().replace(/[^a-zA-Z0-9]/i, '');
        });

        //EVENT FOR CHOOSE PRODUCTION DATE
        $(self.fieldProductionID).removeEvents();
        $(self.fieldProductionID).addEvent('focus', function(e) 
        {
            e.preventDefault();
            $(this).blur();
            self.datePicker.show();
        });
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
    self.fieldIdentifierID      = 'projects-view-id';
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
        ProjectsSite.activeView = 'VIEW';
        $(ProjectsSite.titleID).set('html', 'Projects/'+data['name']);
        $(self.containerID).setStyle('display', 'block');

        self.renderData();
        self.addEvents();
        ProjectNotesSite.init(data['project_id']);
        ContactPersonsSite.init(data['project_id']);
        PointPersonsSite.init(data['project_id']);
        ApplicationsSite.init(data['project_id']);
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        ContactPersonsSite.closeActive();
        PointPersonsSite.closeActive();
        ProjectNotesSite.closeActive();
        ApplicationsSite.closeActive();
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
        var createdby = LDAPUsersData.get(data['created_by']);
        var updatedby = LDAPUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);
        var termination = (data['termination_date'] == null || data['termination_date'] == '0000-00-00' || data['termination_date'] == '')? '' : DateFormatter.formatDate(data['termination_date']);
        var production = (data['production_date'] == null || data['production_date'] == '0000-00-00' || data['production_date'] == '')? '' : DateFormatter.formatDate(data['production_date']);

        $(self.fieldIdentifierID).set('html', data['project_id']);
        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldCodeID).set('html', data['code']);
        new ReadMore(self.fieldDescriptionID, data['description']).renderData();
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
            ProjectsSite.historyMngr.remove('pid');
        });

        //EVENT FOR EDITING A PROJECT
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
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
    self.errorNameID        = 'projects-edit-name-error';
    self.errorCodeID        = 'projects-edit-code-error';

    //buttons
    self.saveButtonID       = 'projects-edit-save-button';
    self.cancelButtonID     = 'projects-edit-cancel-button';

    self.datePicker         = null;

    self.init = function()
    {
        ProjectsSite.activeView = 'EDIT';
        self.datePicker = new DatePicker($(self.fieldProductionID), {
            allowEmpty: true,
            timePicker: false,
            pickerClass: 'datepicker_vista',
            positionOffset: {x: 370, y:-40},
            format: 'M j, Y',
            inputOutputFormat: 'Y-m-d',
        });

        $(ProjectsSite.titleID).set('html', 'Projects');
        $(self.containerID).setStyle('display', 'block');
        self.renderData();
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        //clear errors
        $(self.errorCodeID).setStyle('display', 'none');
        $(self.errorCodeID).setStyle('display', 'none');

        //clear fields
        $(self.fieldNameID).value = '';
        $(self.fieldCodeID).value = '';
        $(self.fieldDescriptionID).value = '';
        $(self.fieldProductionID).value = '';
        $(self.fieldProductionID).getNext().value = '';

        self.datePicker.close();
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
                            if (msg[0] == 'NAME_ERROR') {
                                $(self.errorNameID).set('html', msg[1]);
                                $(self.errorNameID).setStyle('display', 'block');
                            } else if (msg[0] == 'CODE_ERROR') {
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
        $(self.fieldNameID).value = data['name'].replace(/&lt/g, '<');
        $(self.fieldCodeID).value = data['code'];
        $(self.fieldDescriptionID).value = data['description'].replace(/&lt/g, '<');

        if (data['production_date'] == '0000-00-00' || data['production_date'] == '') {
            $(self.fieldProductionID).value = '';
            $(self.fieldProductionID).getNext().value = '';
        } else {
            $(self.fieldProductionID).value = data['production_date'];
            var production = (data['production_date'] == null || data['production_date'] == '0000-00-00' || data['production_date'] == '')? '' : DateFormatter.formatDate(data['production_date']);
            $(self.fieldProductionID).getNext().value = production;
        }
    }

    self.addEvents = function()
    {
        //EVENT FOR SAVING CHANGES BUTTON IN EDIT PROJECT
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorCodeID).setStyle('display', 'none');
            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT PROJECT
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
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
        });

        //EVENT FOR CHOOSE PRODUCTION DATE
        $(self.fieldProductionID).removeEvents();
        $(self.fieldProductionID).addEvent('focus', function(e) 
        {
            e.preventDefault();
            $(this).blur();
            self.datePicker.show();
        });
    }
}

var ProjectsSite = {
    titleID         : 'projects-title',
    csrfID          : 'projects-csrf',
    mainObj         : new ProjectsList(),
    createObj       : new ProjectsCreate(),
    editObj         : null,
    viewObj         : null,
    dataObj         : new ProjectsData(),
    // some more variables
    activeView      : '',
    historyMngr     : new HistoryManager(),
    searchParams    : {
        'page'  : 1,
        'name'  : '',
        'code'  : '',
        'status': '',
    },
    processChange   : true,     //allow or prevent prevent action on hash change in search

    init: function()
    {
        var self = this;
        LDAPUsersData.init($(self.csrfID).value);
        LDAPGroupsData.init($(self.csrfID).value);
        AppTypesData.init($(self.csrfID).value);
        AppServersData.init($(self.csrfID).value);

        self.historyMngr.start();
        self.addEvents();

        hash = self.historyMngr.deserializeHash(self.historyMngr.getHash());
        if (hash == null || Object.keys(hash).length == 0) {
            console.log('no hash');
            self.historyMngr.set('search', self.searchParams);
        }
    },

    initObj: function(search)
    {
        var self = this;
        self.closeActive();
        self.mainObj.init(search);
    },

    initCreate: function()
    {
        var self = this;
        self.closeActive();
        self.createObj.init();
    },

    initEdit: function(data)
    {
        var self = this;
        self.closeActive();
        self.editObj = new ProjectsEdit(data)
        self.editObj.init();
    },

    initView: function(data)
    {
        var self = this;
        self.closeActive();
        self.viewObj = new ProjectsView(data)
        self.viewObj.init();
    },

    addEvents: function()
    {
        var self = this;
        var processPID = function(new_value)
        {
            var pid = parseInt(new_value);
            // if project info is not yet retrieved
            if (!self.mainObj.makeView(pid)) {
                console.log('retrieve new');
                ProjectsSite.dataObj.getAjaxData({
                    'project_id': pid,
                    'YII_CSRF_TOKEN': $(self.csrfID).value,
                // on success
                }, function(data) {
                    self.initView(data)
                // on fail
                }, function() {
                    ProjectsSite.historyMngr.remove('pid');
                });
            }
        }
        self.historyMngr.addEvent('pid:added', processPID);
        self.historyMngr.addEvent('pid:updated', processPID);
        self.historyMngr.addEvent('pid:removed', function(removed)
        {
            self.initObj();
        });

        var processSearch = function(new_value)
        {
            if (self.processChange) {
                hash = self.historyMngr.deserializeHash(self.historyMngr.getHash());
                
                // FIX HASH IF NEEDED
                var hasInvalid = false;
                if (!('page' in hash['search'])) {
                    new_value['page'] = 1;
                    hasInvalid = true;
                } else if ((typeof hash['search']['page']) != "number") {
                    new_value['page'] = 1;
                    hasInvalid = true;
                }
                
                if (!('name' in hash['search'])) {
                    new_value['name'] = '';
                    hasInvalid = true;
                }
                
                if (!('code' in hash['search'])) {
                    new_value['code'] = '';
                    hasInvalid = true;
                } else {
                    var code = hash['search']['code'].substr(0,5).toUpperCase().replace(/[^a-zA-Z0-9]/i, '');
                    if (code != hash['search']['code']) {
                        new_value['code'] = '';
                        hasInvalid = true;
                    }
                }
                
                if (!('status' in hash['search'])) {
                    new_value['status'] = '';
                    hasInvalid = true;
                } else if (!['', 'ACTIVE', 'TERMINATED'].contains(hash['search']['status'])) {
                    new_value['status'] = '';
                    hasInvalid = true;
                }

                self.searchParams = new_value;

                if (hasInvalid) {
                    self.historyMngr.set('search', self.searchParams);
                } else {
                    if (!('pid' in hash)) {
                        self.initObj();
                    } else {
                        console.log('search doing nothing');
                    }
                }
            } else {
                self.processChange = true;
            }
        }
        self.historyMngr.addEvent('search:added', processSearch);
        self.historyMngr.addEvent('search:updated', processSearch);
        self.historyMngr.addEvent('search:removed', function(removed)
        {
            hash = self.historyMngr.deserializeHash(self.historyMngr.getHash());
            self.searchParams = {
                'page'  : 1,
                'name'  : '',
                'code'  : '',
                'status': '',
            };
            self.historyMngr.set('search', self.searchParams);
        });
    },

    closeActive: function()
    {
        var self = this;
        switch (self.activeView)
        {
            case 'LIST':
                self.mainObj.hide();
                break;
            case 'CREATE':
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

window.addEvent('domready', function()
{
    ProjectsSite.init();
});