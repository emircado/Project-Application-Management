var UsersList = function()
{
    var self            = this;
    self.containerID    = 'users-list';

    //for pagination
    self.prevID         = 'users-list-prev';
    self.nextID         = 'users-list-next';
    self.totalDataID    = 'users-list-total';
    self.totalPartID    = 'users-list-part';

    //for table
    self.tableID        = 'users-list-table';
    self.resultData     = [];
    self.lookupData     = new Hash();
    self.tableRowClass  = 'users-list-row';

    //fields
    self.fieldUserNameID    = 'users-list-username';
    self.fieldNameID        = 'users-list-name';
    self.csrfID             = 'users-list-csrf';

    //buttons
    self.viewButtonID   = 'tr[id^=users-list-view_]';
    self.searchButtonID = 'users-list-search-button';
    self.clearButtonID  = 'users-list-clear-button';

    self.init = function()
    {
        UsersSite.activeView = 'LIST';
        UsersData.getAjaxData({
            'page'              : UsersSite.searchParams['page'],
            'name'              : UsersSite.searchParams['name'],
            'point_person'      : UsersSite.searchParams['point_person'],
            'YII_CSRF_TOKEN'    : $(self.csrfID).value,
        }, self.getData, function(){});

        $(UsersSite.titleID).set('html', 'Users');
        $(UsersSite.noteID).setStyle('display', 'block');
        $$('.'+self.tableRowClass).dispose();
        $(self.containerID).setStyle('display', 'block');

        $(self.fieldNameID).value = UsersSite.searchParams['name'];
        $(self.fieldUserNameID).value = UsersSite.searchParams['point_person'];
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        $(self.fieldNameID).value = '';
        $$('.'+self.tableRowClass).dispose();
    }

    self.getData = function(data)
    {
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

    self.makeView = function(aid)
    {
        if (typeof aid==='number' && (aid%1)===0 && self.lookupData.has(aid)) {
            console.log('data is from list');
            UsersSite.initView(self.resultData[self.lookupData.get(aid)]);
            return true;
        } else {
            return false;
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
                self.lookupData.include(val['application_id'], idx);
                var description = (val['description'].length > 65)? val['description'].substr(0, 65)+'...' : val['description']; 
                contentHTML = '<td>'+val['point_person']+'</td>'
                            + '<td>'+val['name']+'</td>'
                            + '<td>'+description+'</td><td></td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'users-list-view_'+val['application_id']
                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td colspan="4">No results found</td>';
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
                UsersSite.historyMngr.set('search', {
                    'page'          : UsersSite.searchParams['page']+1,
                    'name'          : UsersSite.searchParams['name'],
                    'point_person'  : UsersSite.searchParams['point_person'],
                });
            }
        });
        
        //EVENT FOR PREVIOUS PAGE
        $(self.prevID).removeEvents();
        $(self.prevID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != 1) {
                UsersSite.historyMngr.set('search', {
                    'page'          : UsersSite.searchParams['page']-1,
                    'name'          : UsersSite.searchParams['name'],
                    'point_person'  : UsersSite.searchParams['point_person'],
                });
            }
        });

        //EVENT FOR SEARCH BUTTON
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
                UsersSite.historyMngr.set('search', {
                    'page'          : 1,
                    'name'          : $(self.fieldNameID).value.trim(),
                    'point_person'  : $(self.fieldUserNameID).value,
                });
        });

        //EVENT FOR CLEAR SEARCH FIELDS
        $(self.clearButtonID).removeEvents();
        $(self.clearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.fieldNameID).value = '';
            $(self.fieldUserNameID).value = '';
            self.fieldUserGroupID
        });

        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e) {
            e.preventDefault();
            var aid = parseInt($(this).get('id').split('_')[1]);
            if (typeof aid==='number' && (aid%1)===0 && self.lookupData.has(aid)) {
                UsersSite.historyMngr.set('id', aid);
            }
        });
    }
}

var UsersView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/delete';
    self._request = null;

    //display
    self.containerID            = 'app-main-view';

    //fields
    self.fieldIDID              = 'app-main-view-id';
    self.fieldProjectIDID       = 'app-main-view-projectid';
    self.fieldProjectNameID     = 'app-main-view-projectname';
    self.fieldNameID            = 'app-main-view-name';
    self.fieldTypeID            = 'app-main-view-type';
    self.fieldAccessibilityID   = 'app-main-view-accessibility';
    self.fieldRepositoryID      = 'app-main-view-repository';
    self.fieldPatternID         = 'app-main-view-pattern';
    self.fieldDescriptionID     = 'app-main-view-description';
    self.fieldInstructionsID    = 'app-main-view-instructions';
    self.fieldPointPersonID     = 'app-main-view-pointperson';
    self.fieldProductionID      = 'app-main-view-production';
    self.fieldTerminationID     = 'app-main-view-termination';
    self.fieldCreatedID         = 'app-main-view-created';
    self.fieldCreatedbyID       = 'app-main-view-createdby';
    self.fieldUpdatedID         = 'app-main-view-updated';
    self.fieldUpdatedbyID       = 'app-main-view-updatedby';
    self.csrfID                 = 'app-main-view-csrf';
    
    //buttons
    self.editButtonID           = 'app-main-view-edit-button';
    self.deleteButtonID         = 'app-main-view-delete-button';
    self.backButtonID           = 'app-main-view-back-button';

    self.init = function()
    {
        UsersSite.activeView = 'VIEW';
        $(UsersSite.titleID).set('html', 'Applications/'+data['name']);
        $(UsersSite.noteID).setStyle('display', 'none');
        $(self.containerID).setStyle('display', 'block');
        
        ApplicationNotesSite.init(data['application_id']);
        AppServersSite.init(data['application_id']);
        AppPointPersonsSite.init(data['application_id']);

        self.renderData();
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        
        ApplicationNotesSite.closeActive();
        AppServersSite.closeActive();
        AppPointPersonsSite.closeActive();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
                'application_id'    : data['application_id']
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
        var createdby = LDAPUsersData.get(data['created_by']);
        var updatedby = LDAPUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);
        var termination = (data['termination_date'] == null || data['termination_date'] == '0000-00-00' || data['termination_date'] == '')? '' : DateFormatter.formatDate(data['termination_date']);
        var production = (data['production_date'] == null || data['production_date'] == '0000-00-00' || data['production_date'] == '')? '' : DateFormatter.formatDate(data['production_date']);

        $(self.fieldIDID).set('html', data['application_id']);
        $(self.fieldProjectIDID).set('html', data['project_id']);
        $(self.fieldProjectNameID).set('html', data['project_name']);
        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldTypeID).set('html', AppTypesData.get(data['type_id']));
        $(self.fieldAccessibilityID).set('html', data['accessibility']);
        $(self.fieldRepositoryID).set('html', data['repository_url']);
        $(self.fieldPatternID).set('html', (data['uses_mobile_patterns'] == 1)? 'YES' : 'NO');
        new ReadMore(self.fieldDescriptionID, data['description']).renderData();
        new ReadMore(self.fieldInstructionsID, data['instructions']).renderData();
        $(self.fieldPointPersonID).set('html', LDAPUsersData.get(data['rd_point_person']));
        $(self.fieldProductionID).set('html', production);
        $(self.fieldTerminationID).set('html', termination);
        $(self.fieldCreatedID).set('html', created);
        $(self.fieldUpdatedID).set('html', updated);
        $(self.fieldCreatedbyID).set('html', (createdby == null)? data['created_by'] : createdby);
        $(self.fieldUpdatedbyID).set('html', (updatedby == null)? data['updated_by'] : updatedby);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            UsersSite.initEdit(data);
        });

        //DELETE CONTACT PERSON
        $(self.deleteButtonID).removeEvents();
        $(self.deleteButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            new ConfirmModal(
                'Confirm Delete',
                'Are you sure you want to delete this point person from the list?',
                'Delete',
                self.postAjaxData)
            .show();
        });

        //GO BACK TO THE LIST
        $(self.backButtonID).removeEvents();
        $(self.backButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            UsersSite.historyMngr.remove('id');
            UsersSite.initObj();
        });
    }
}

var UsersEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/update';
    self._request = null;

    self.containerID            = 'app-main-edit';
    self.modalContainerID       = 'app-main-edit-modal-container';
    self.typeModal              = new ApplicationTypesModal();
    self.projectModal           = new ProjectsListModal();

    //fields
    self.fieldProjectID         = 'app-main-edit-project';
    self.fieldNameID            = 'app-main-edit-name';
    self.fieldTypeID            = 'app-main-edit-type';
    self.fieldAccessibilityID   = 'app-main-edit-accessibility';
    self.fieldRepositoryID      = 'app-main-edit-repository';
    self.fieldDescriptionID     = 'app-main-edit-description';
    self.fieldInstructionsID    = 'app-main-edit-instructions';
    self.fieldPointPersonID     = 'app-main-edit-pointperson';
    self.fieldProductionID      = 'app-main-edit-production';
    self.fieldTerminationID     = 'app-main-edit-termination';
    self.fieldPatternID         = 'app-main-edit-pattern';
    self.csrfID                 = 'app-main-edit-csrf';
    self.project_id             = '';

    //dropdown class
    self.pointPersonRowClass    = 'app-main-edit-pointperson-row';

    //error fields
    self.errorProjectID         = 'app-main-edit-project-error';
    self.errorNameID            = 'app-main-edit-name-error';
    self.errorTypeID            = 'app-main-edit-type-error';
    self.errorAccessibilityID   = 'app-main-edit-accessibility-error';

    //buttons
    self.saveButtonID           = 'app-main-edit-save-button';
    self.cancelButtonID         = 'app-main-edit-cancel-button';

    self.datePickerProd         = null;
    self.datePickerTerm         = null;

    self.init = function()
    {
        UsersSite.activeView = 'EDIT';
        self.datePickerProd = new DatePicker($(self.fieldProductionID), {
            allowEmpty: true,
            timePicker: false,
            pickerClass: 'datepicker_vista',
            positionOffset: {x: 380, y:-40},
            format: 'M j, Y',
            inputOutputFormat: 'Y-m-d',
        });

        self.datePickerTerm = new DatePicker($(self.fieldTerminationID), {
            allowEmpty: true,
            timePicker: false,
            pickerClass: 'datepicker_vista',
            positionOffset: {x: 380, y:-40},
            format: 'M j, Y',
            inputOutputFormat: 'Y-m-d',
        });

        $(self.containerID).setStyle('display', 'block');
        $(self.modalContainerID).grab($(self.typeModal.modalID), 'top');
        self.initDropdown();
        self.renderData();
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        // close modal
        self.typeModal.closeModal();
        
        // clear errors
        $(self.errorProjectID).setStyle('display', 'none');
        $(self.errorNameID).setStyle('display', 'none');
        $(self.errorTypeID).setStyle('display', 'none');
        $(self.errorAccessibilityID).setStyle('display', 'none');

        // clear fields
        $(self.fieldProjectID).value = '';
        $(self.fieldNameID).value = '';
        $(self.fieldTypeID).value = '';
        $(self.fieldAccessibilityID).value = 'PUBLIC';
        $(self.fieldRepositoryID).value = '';
        $(self.fieldDescriptionID).value = '';
        $(self.fieldInstructionsID).value = '';
        $(self.fieldPointPersonID).set('html', '');
        $(self.fieldProductionID).value = '';
        $(self.fieldTerminationID).value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':       $(self.csrfID).value,
                'application_id':       data['application_id'],
                'project_id':           self.project_id,
                'name':                 $(self.fieldNameID).value.trim(),
                'type_name':            $(self.fieldTypeID).value.trim(),
                'accessibility':        $(self.fieldAccessibilityID).value.trim(),
                'repository_url':       $(self.fieldRepositoryID).value.trim(),
                'uses_mobile_patterns': $(self.fieldPatternID).checked,
                'description':          $(self.fieldDescriptionID).value.trim(),
                'instructions':         $(self.fieldInstructionsID).value.trim(),
                'rd_point_person':      $(self.fieldPointPersonID).value.trim(),
                'production_date':      $(self.fieldProductionID).value,
                'termination_date':     $(self.fieldTerminationID).value
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
                            if (msg[0] == 'PROJECT_ERROR') {
                                $(self.errorProjectID).set('html', msg[1]);
                                $(self.errorProjectID).setStyle('display', 'block');
                            } else if (msg[0] == 'NAME_ERROR') {
                                $(self.errorNameID).set('html', msg[1]);
                                $(self.errorNameID).setStyle('display', 'block');
                            } else if (msg[0] == 'TYPE_ERROR') {
                                $(self.errorTypeID).set('html', msg[1]);
                                $(self.errorTypeID).setStyle('display', 'block');
                            } else if (msg[0] == 'ACCESSIBILITY_ERROR') {
                                $(self.errorAccessibilityID).set('html', msg[1]);
                                $(self.errorAccessibilityID).setStyle('display', 'block');
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        data['project_id']           = response['data']['project_id'];
                        data['project_name']         = $(self.fieldProjectID).value.trim();
                        data['type_id']              = response['data']['type_id'];
                        data['name']                 = response['data']['name'];
                        data['description']          = response['data']['description'];
                        data['accessibility']        = response['data']['accessibility'];
                        data['repository_url']       = response['data']['repository_url'];
                        data['uses_mobile_patterns'] = response['data']['uses_mobile_patterns'];
                        data['instructions']         = response['data']['instructions'];
                        data['rd_point_person']      = response['data']['rd_point_person'];
                        data['production_date']      = response['data']['production_date'];
                        data['termination_date']     = response['data']['termination_date'];
                        data['date_updated']         = response['data']['date_updated'];
                        data['updated_by']           = response['data']['updated_by'];

                        $(self.cancelButtonID).click();
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
        var termination = (data['termination_date'] == null || data['termination_date'] == '0000-00-00' || data['termination_date'] == '')? '' : DateFormatter.formatDate(data['termination_date']);
        var production = (data['production_date'] == null || data['production_date'] == '0000-00-00' || data['production_date'] == '')? '' : DateFormatter.formatDate(data['production_date']);

        self.project_id                      = data['project_id'];
        $(self.fieldProjectID).value         = data['project_name'];
        $(self.fieldNameID).value            = data['name'].replace(/&lt/g, '<');;
        $(self.fieldTypeID).value            = AppTypesData.get(data['type_id']);
        $(self.fieldAccessibilityID).value   = data['accessibility'];
        $(self.fieldRepositoryID).value      = data['repository_url'].replace(/&lt/g, '<');;
        $(self.fieldPatternID).checked       = (data['uses_mobile_patterns'] == 1)? true : false;
        $(self.fieldDescriptionID).value     = data['description'].replace(/&lt/g, '<');;
        $(self.fieldInstructionsID).value    = data['instructions'].replace(/&lt/g, '<');;
        $(self.fieldPointPersonID).value     = data['rd_point_person'];
        $(self.fieldProductionID).value      = data['production_date'];
        $(self.fieldTerminationID).value     = data['termination_date'];
        $(self.fieldProductionID).getNext().value   = production;
        $(self.fieldTerminationID).getNext().value  = termination;
    }

    self.addEvents = function()
    {
        // prevent focus on type field
        $(self.fieldTypeID).removeEvents();
        $(self.fieldTypeID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();

            self.typeModal = new ApplicationTypesModal(
                function(app_type) {
                    $(self.fieldTypeID).value = app_type;
                }
            );
            self.typeModal.show();
        });

        // event for project id
        $(self.fieldProjectID).removeEvents();
        $(self.fieldProjectID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();

            self.projectModal = new ProjectsListModal(
                function(project) {
                    self.project_id = project['project_id']
                    $(self.fieldProjectID).value = project['name'];
                    $(self.errorProjectID).setStyle('display', 'none');
                }
            );
            self.projectModal.show();
        });

        // event for edit button
        $(self.saveButtonID).removeEvents();
        $(self.saveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.errorProjectID).setStyle('display', 'none');
            $(self.errorNameID).setStyle('display', 'none');
            $(self.errorTypeID).setStyle('display', 'none');
            $(self.errorAccessibilityID).setStyle('display', 'none');
            self.postAjaxData();
        });
    
        // event for cancel button
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            UsersSite.initView(data);
        });

        //EVENT FOR CHOOSE PRODUCTION DATE
        $(self.fieldProductionID).removeEvents();
        $(self.fieldProductionID).addEvent('focus', function(e) 
        {
            e.preventDefault();
            $(this).blur();
            self.datePickerProd.show();
        });

        //EVENT FOR CHOOSE TERMINATION DATE
        $(self.fieldTerminationID).removeEvents();
        $(self.fieldTerminationID).addEvent('focus', function(e) 
        {
            e.preventDefault();
            $(this).blur();
            self.datePickerTerm.show();
        });
    }

    self.initDropdown = function()
    {
        $$('.'+self.pointPersonRowClass).dispose();

        contentElem = new Element('<option />',
        {
            'class' : self.pointPersonRowClass,
            'value' : '',
            'html'  : '--Select Point Person--'
        });
        contentElem.inject($(self.fieldPointPersonID), 'bottom');

        hash = new Hash(LDAPGroupsData.get('DEVELOPERS'));
        hash.each(function(val, idx) {
            contentElem = new Element('<option />',
            {
                'class' : self.pointPersonRowClass,
                'value' : idx,
                'html'  : val
            });
            contentElem.inject($(self.fieldPointPersonID), 'bottom');
        });
    }
}

var UsersSite = {
    titleID         : 'users-title',
    noteID          : 'users-note',
    csrfID          : 'users-csrf',
    mainObj         : new UsersList(),
    viewObj         : null,
    editObj         : null,
    //some more variables
    activeView      : '',
    historyMngr     : new HistoryManager(),
    searchParams    : {
        'page'          : 1,
        'name'          : '',
        'point_person'  : '',
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
            self.historyMngr.set('search', {
                'page'          : self.searchParams['page'],
                'name'          : self.searchParams['name'],
                'point_person'  : self.searchParams['point_person'],
            });
        }
    },

    initObj: function()
    {
        var self = this;
        self.closeActive();
        self.mainObj.init();
    },

    initView: function(data)
    {
        var self = this;
        self.closeActive();
        self.viewObj = new UsersView(data);
        self.viewObj.init();
    },

    initEdit: function(data)
    {
        var self = this;
        self.closeActive();
        self.editObj = new UsersEdit(data);
        self.editObj.init();
    },

    addEvents: function()
    {
        var self = this;
        var processAID = function(new_value)
        {
            var aid = parseInt(new_value);
            // if project info is not yet retrieved
            if (!self.mainObj.makeView(aid)) {
                console.log('retrieve new');
                
                UsersData.getAjaxData({
                    'application_id': aid,
                    'YII_CSRF_TOKEN': $(self.csrfID).value,
                // on success
                }, function(data) {
                    self.initView(data)
                // on fail
                }, function() {
                    AppMainData.historyMngr.remove('id');
                });
            }
        }
        self.historyMngr.addEvent('id:added', processAID);
        self.historyMngr.addEvent('id:updated', processAID);
        self.historyMngr.addEvent('id:removed', function(removed)
        {
            self.initObj();
        });

        var processSearch = function(new_value)
        {
            if (self.processChange) {
                hash = self.historyMngr.deserializeHash(self.historyMngr.getHash());
                
                // FIX HASH IF NEEDED
                var hasInvalid = false;
                self.searchParams['page']           = ('page' in new_value)? new_value['page'] : 1;
                self.searchParams['name']           = ('name' in new_value)? new_value['name'] : '';
                self.searchParams['point_person']   = ('point_person' in new_value)? new_value['point_person'] : '';

                if (hasInvalid) {
                    UsersSite.historyMngr.set('search', {
                        'page'          : UsersSite.searchParams['page'],
                        'name'          : UsersSite.searchParams['name'],
                        'point_person'  : UsersSite.searchParams['point_person'],
                    });
                } else {
                    if (!('id' in hash)) {
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
                'page'          : 1,
                'name'          : '',
                'point_person'  : '',
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
    UsersSite.init();
});