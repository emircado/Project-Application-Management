var AppMainList = function()
{
    var self            = this;
    self.containerID    = 'app-main-list';
    self.basicConID     = 'app-main-list-basic';

    //for pagination
    self.prevID         = 'app-main-list-prev';
    self.nextID         = 'app-main-list-next';
    self.totalDataID    = 'app-main-list-total';
    self.totalPartID    = 'app-main-list-part';

    //for table
    self.tableID        = 'app-main-list-table';
    self.resultData     = [];
    self.lookupData     = new Hash();
    self.tableRowClass  = 'app-main-list-row';

    //fields
    self.fieldNameID        = 'app-main-list-search-name';
    self.fieldProjectID     = 'app-main-list-search-project';
    self.fieldPointPersonID = 'app-main-list-search-point';
    self.csrfID             = 'app-main-list-csrf';

    //buttons
    self.createButtonID = 'app-main-list-create-button';
    self.viewButtonID   = 'tr[id^=app-main-list-view_]';
    self.searchButtonID = 'app-main-list-search-button';
    self.clearButtonID  = 'app-main-list-clear-button';
    self.switchButtonID = 'app-main-list-advanced-button';

    self.advancedSearch = null;

    self.init = function()
    {
        AppMainSite.activeView = 'LIST';
        var params = {
            'page'              : AppMainSite.searchParams['page'],
            'name'              : AppMainSite.searchParams['name'],
            'project'           : AppMainSite.searchParams['project'],
            'rd_point_person'   : AppMainSite.searchParams['rd_point_person'],
            'server_type'       : AppMainSite.searchParams['server_type'],
            'server_id'         : AppMainSite.searchParams['server_id'],
            'usergroup'         : AppMainSite.searchParams['usergroup'],
            'point_person'      : AppMainSite.searchParams['point_person'],
            'is_main'           : true,
            'YII_CSRF_TOKEN'    : $(self.csrfID).value,
        };

        AppMainData.getAjaxData(params, self.getData, function(){});

        $(AppMainSite.titleID).set('html', 'Applications');
        $$('.'+self.tableRowClass).dispose();
        $(self.containerID).setStyle('display', 'block');
        
        self.switchSearch();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        $(self.fieldNameID).value = '';
        $(self.fieldProjectID).value = '';
        $(self.fieldPointPersonID).value = '';
        $$('.'+self.tableRowClass).dispose();
    }

    self.switchSearch = function()
    {
        if (AppMainSite.searchParams['type'] == 'BASIC') {
            $(self.basicConID).setStyle('display', 'table-row');

            $(self.fieldNameID).value    = AppMainSite.searchParams['name'];
            $(self.fieldProjectID).value = AppMainSite.searchParams['project'];
            $(self.fieldPointPersonID).value = AppMainSite.searchParams['rd_point_person'];

        } else if (AppMainSite.searchParams['type'] == 'ADVANCED') {
            if (self.advancedSearch == null)
            {
                self.advancedSearch = new AppMainSearch();
                self.advancedSearch.init();
            }
            self.advancedSearch.show();
            $(self.basicConID).setStyle('display', 'none');
        }
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
            AppMainSite.initView(self.resultData[self.lookupData.get(aid)]);
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
                var displayname = LDAPUsersData.get(val['rd_point_person']);

                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['project_name']+'</td>'
                            + '<td>'+((displayname == null)? '' : displayname)+'</td>'            
                            + '<td>'+description+'</td><td></td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'app-main-list-view_'+val['application_id']
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
                var h = {
                    'type'              : AppMainSite.searchParams['type'],
                    'page'              : AppMainSite.searchParams['page']+1,
                    'name'              : AppMainSite.searchParams['name'],
                    'project'           : AppMainSite.searchParams['project'],
                    'rd_point_person'   : AppMainSite.searchParams['rd_point_person'],
                }
                if (h['type'] == 'ADVANCED') {
                    h['server_type']    = AppMainSite.searchParams['server_type'];
                    h['server_id']      = AppMainSite.searchParams['server_id'];
                    h['usergroup']      = AppMainSite.searchParams['usergroup'];
                    h['point_person']   = AppMainSite.searchParams['point_person'];
                }
                AppMainSite.historyMngr.set('search', h);
            }
        });
        
        //EVENT FOR PREVIOUS PAGE
        $(self.prevID).removeEvents();
        $(self.prevID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != 1) {
                var h = {
                    'type'              : AppMainSite.searchParams['type'],
                    'page'              : AppMainSite.searchParams['page']-1,
                    'name'              : AppMainSite.searchParams['name'],
                    'project'           : AppMainSite.searchParams['project'],
                    'rd_point_person'   : AppMainSite.searchParams['rd_point_person'],
                }
                if (h['type'] == 'ADVANCED') {
                    h['server_type']    = AppMainSite.searchParams['server_type'];
                    h['server_id']      = AppMainSite.searchParams['server_id'];
                    h['usergroup']      = AppMainSite.searchParams['usergroup'];
                    h['point_person']   = AppMainSite.searchParams['point_person'];
                }
                AppMainSite.historyMngr.set('search', h);
            }
        });

        //EVENT FOR SEARCH BUTTON
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (AppMainSite.searchParams['type'] == 'BASIC')
            {
                AppMainSite.historyMngr.set('search', {
                    'type'              : 'BASIC',
                    'page'              : 1,
                    'name'              : $(self.fieldNameID).value.trim(),
                    'project'           : $(self.fieldProjectID).value.trim(),
                    'rd_point_person'   : $(self.fieldPointPersonID).value.trim(),
                });
            }
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
            var aid = parseInt($(this).get('id').split('_')[1]);
            if (typeof aid==='number' && (aid%1)===0 && self.lookupData.has(aid)) {
                AppMainSite.historyMngr.set('id', aid);
            }
        });

        //EVENT FOR CREATING A NEW PROJECT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            AppMainSite.initCreate();
        });

        //EVENT FOR ADVANCED SEARCH
        $(self.switchButtonID).removeEvents();
        $(self.switchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();        
            AppMainSite.historyMngr.set('search', {
                'type'              : 'ADVANCED',
                'page'              : AppMainSite.searchParams['page'],
                'name'              : AppMainSite.searchParams['name'],
                'project'           : AppMainSite.searchParams['project'],
                'rd_point_person'   : AppMainSite.searchParams['rd_point_person'],
                'server_type'       : AppMainSite.searchParams['server_type'],
                'server_id'         : AppMainSite.searchParams['server_id'],
                'usergroup'         : AppMainSite.searchParams['usergroup'],
                'point_person'      : AppMainSite.searchParams['point_person'],
            });
        });
    }
}

var AppMainSearch = function(onHide)
{
    var self = this;

    self.containerID        = 'app-main-advanced';
    
    // search by server
    self.serverModal        = new AppServersListModal();
    self.selectedServer     = '';

    //fields
    self.fieldNameID        = 'app-main-advanced-application';
    self.fieldProjectID     = 'app-main-advanced-project';
    self.fieldPointPersonID = 'app-main-advanced-pointperson';
    self.fieldServerTypeID  = 'app-main-advanced-servertype';
    self.fieldServerNameID  = 'app-main-advanced-servername';
    self.fieldUserGroupID   = 'app-main-advanced-usergroup';
    self.fieldUserNameID    = 'app-main-advanced-username';

    //buttons
    self.searchButtonID     = 'app-main-advanced-search-button';
    self.clearButtonID      = 'app-main-advanced-clear-button';
    self.closeButtonID      = 'app-main-advanced-close-button';
    self.serverclearButtonID = 'app-main-advanced-serverclear-button';

    self.usernameRowClass   = 'app-main-advanced-username-row';
    self.usergroupRowClass  = 'app-main-advanced-usergroup-row';

    self.init = function()
    {
        self.addEvents();
        self.initDropdown();
    }

    self.show = function()
    {
        $(self.containerID).setStyle('display', 'block');
        $(self.fieldNameID).value = AppMainSite.searchParams['name'];
        $(self.fieldProjectID).value = AppMainSite.searchParams['project'];
        $(self.fieldPointPersonID).value = AppMainSite.searchParams['rd_point_person'];  
        
        $(self.fieldServerTypeID).value = AppMainSite.searchParams['server_type'];
        self.selectedServer = AppMainSite.searchParams['server_id'];
        if (AppMainSite.searchParams['server_type'] != '')
        {
            $(self.fieldServerNameID).set('disabled', false);
            if (self.selectedServer != '') {
                for (server in AppServersData.get(AppMainSite.searchParams['server_type'])) {
                    if (server['server_id'] == self.selectedServer) {
                        $(self.fieldServerNameID).value = server['name'];
                        break;
                    }
                }
            } else {
                $(self.fieldServerNameID).value = '';
            }
        } else {
            $(self.fieldServerNameID).set('disabled', 'true');
        }

        $(self.fieldUserGroupID).value = AppMainSite.searchParams['usergroup'];
        if (AppMainSite.searchParams['usergroup'] != '') {
            $(self.fieldUserGroupID).fireEvent('change');
        }
        $(self.fieldUserNameID).value = AppMainSite.searchParams['point_person'];
    }

    self.hide = function()
    {
        AppMainSite.searchParams['type'] = 'BASIC'
        $(self.containerID).setStyle('display', 'none');
        AppMainSite.historyMngr.set('search', {
            'type'              : 'BASIC',
            'page'              : AppMainSite.searchParams['page'],
            'name'              : AppMainSite.searchParams['name'],
            'project'           : AppMainSite.searchParams['project'],
            'rd_point_person'   : AppMainSite.searchParams['rd_point_person'],
        });
    }

    self.clearSearch = function()
    {
        $(self.fieldNameID).value = '';
        $(self.fieldProjectID).value = '';

        $(self.fieldServerTypeID).value = '';
        $(self.fieldServerNameID).value = '';
        $(self.fieldServerNameID).set('disabled', true);
        self.selectedServer = '';

        $$('.'+self.usernameRowClass).dispose();
        $$('.'+self.usergroupRowClass).dispose();
        self.initDropdown();
    }

    self.initDropdown = function()
    {
        contentElem = new Element('<option />',
        {
            'class' : self.usernameRowClass,
            'value' : '',
            'html'  : '--Select Username--'
        });
        contentElem.inject($(self.fieldUserNameID), 'bottom');
        contentElem = new Element('<option />',
        {
            'class' : self.usergroupRowClass,
            'value' : '',
            'html'  : '--Select User Group--'
        });
        contentElem.inject($(self.fieldUserGroupID), 'bottom');

        LDAPGroupsData.resultData.each(function(val, idx)
        {
            contentElem = new Element('<option />',
            {
                'class' : self.usergroupRowClass,
                'value' : idx,
                'html'  : idx
            });
            contentElem.inject($(self.fieldUserGroupID), 'bottom');
        });
    }

    self.addEvents = function()
    {
        // SERVER FIELD
        $(self.fieldServerNameID).removeEvents();
        $(self.fieldServerNameID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();
            var servertype = $(self.fieldServerTypeID).value;

            if (['PRODUCTION', 'DEVELOPMENT', 'STAGING'].contains(servertype)) {
                self.serverModal = new AppServersListModal(servertype, self.setSelectedServer, false);
                self.serverModal.show();
            } else {
                $(self.fieldServerNameID).set('disabled', true);
            }
        });

        // CLOSE BUTTON EVENT
        $(self.closeButtonID).removeEvents();
        $(self.closeButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.hide();
        });

        // CLEAR BUTTON EVENT
        $(self.clearButtonID).removeEvents();
        $(self.clearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.clearSearch();
        });

        // SERVER CLEAR BUTTON EVENT
        $(self.serverclearButtonID).removeEvents();
        $(self.serverclearButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.fieldServerNameID).value = '';
            self.selectedServer = '';
        });

        // SEARCH BUTTON EVENT
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            AppMainSite.historyMngr.set('search', {
                'type'              : 'ADVANCED',
                'page'              : 1,
                'name'              : $(self.fieldNameID).value.trim(),
                'project'           : $(self.fieldProjectID).value.trim(),
                'rd_point_person'   : $(self.fieldPointPersonID).value.trim(),
                'server_type'       : $(self.fieldServerTypeID).value,
                'server_id'         : self.selectedServer,
                'usergroup'         : $(self.fieldUserGroupID).value,
                'point_person'      : $(self.fieldUserNameID).value,
            })
        });

        //USER GROUP DROPDOWN
        $(self.fieldUserGroupID).removeEvents();
        $(self.fieldUserGroupID).addEvent('change', function(e)
        {
            var usergroup = this.getElement(':selected').value;

            $$('.'+self.usernameRowClass).dispose();

            contentElem = new Element('<option />',
            {
                'class' : self.usernameRowClass,
                'value' : '',
                'html'  : '--Select Username--'
            });
            contentElem.inject($(self.fieldUserNameID), 'bottom');

            if (usergroup != '') {
                LDAPGroupsData.get(usergroup).each(function(val, idx) {
                    contentElem = new Element('<option />',
                    {
                        'class' : self.usernameRowClass,
                        'value' : idx,
                        'html'  : val
                    });
                    contentElem.inject($(self.fieldUserNameID), 'bottom');
                });
            }
        });

        // SELECT SERVER TYPE DROPDOWN
        $(self.fieldServerTypeID).removeEvents();
        $(self.fieldServerTypeID).addEvent('change', function(e)
        {
            e.preventDefault();
            var servertype = this.getElement(':selected').value;

            $(self.fieldServerNameID).value = '';
            if (['PRODUCTION', 'DEVELOPMENT', 'STAGING'].contains(servertype)) {
                $(self.fieldServerNameID).set('disabled', false);
                self.selectedServer = '';
            } else {
                $(self.fieldServerNameID).set('disabled', true);
                self.selectedServer = '';
            }
        });
    }

    self.setSelectedServer = function(server) {
        $(self.fieldServerNameID).value = server['name'];
        self.selectedServer = server['server_id'];
    }
}

var AppMainCreate = function()
{
    var self = this;
    self.postDataURL = baseURL + '/applications/create';
    self._request = null;

    self.containerID = 'app-main-create';
    self.modalContainerID = 'app-main-create-modal-container';
    self.typeModal = new ApplicationTypesModal();
    self.projectModal = new ProjectsListModal();

    //fields
    self.fieldProjectID        = 'app-main-create-project';
    self.fieldNameID           = 'app-main-create-name';
    self.fieldTypeID           = 'app-main-create-type';
    self.fieldAccessibilityID  = 'app-main-create-accessibility';
    self.fieldRepositoryID     = 'app-main-create-repository';
    self.fieldDescriptionID    = 'app-main-create-description';
    self.fieldInstructionsID   = 'app-main-create-instructions';
    self.fieldPointPersonID    = 'app-main-create-pointperson';
    self.fieldProductionID     = 'app-main-create-production';
    self.fieldTerminationID    = 'app-main-create-termination';
    self.fieldPatternID        = 'app-main-create-pattern';
    self.csrfID                = 'app-main-create-csrf';
    self.project_id            = '';

    //dropdown class
    self.pointPersonRowClass   = 'app-main-create-pointperson-row';
    
    //error fields
    self.errorProjectID        = 'app-main-create-project-error'
    self.errorNameID           = 'app-main-create-name-error';
    self.errorTypeID           = 'app-main-create-type-error';
    self.errorAccessibilityID  = 'app-main-create-accessibility-error';

    //buttons
    self.createButtonID        = 'app-main-create-save-button';
    self.cancelButtonID        = 'app-main-create-cancel-button';

    self.datePickerProd        = null;
    self.datePickerTerm        = null;

    self.init = function()
    {
        AppMainSite.activeView = 'CREATE';

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
        self.addEvents();
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');

        // close modals
        self.typeModal.closeModal();
        self.projectModal.closeModal();

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
        $(self.fieldProductionID).getNext().value = '';
        $(self.fieldTerminationID).getNext().value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':       $(self.csrfID).value,
                'project_id':           self.project_id,
                'name':                 $(self.fieldNameID).value.trim(),
                'type_name':            $(self.fieldTypeID).value.trim(),
                'accessibility':        $(self.fieldAccessibilityID).value.trim(),
                'repository_url':       $(self.fieldRepositoryID).value.trim(),
                'uses_mobile_patterns': $(self.fieldPatternID).checked,
                'description':          $(self.fieldDescriptionID).value.trim(),
                'instructions':         $(self.fieldInstructionsID).value.trim(),
                'rd_point_person':      $(self.fieldPointPersonID).value.trim(),
                'production_date':      $(self.fieldProductionID).value.trim(),
                'termination_date':     $(self.fieldTerminationID).value.trim()
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

    self.addEvents = function()
    {
        // event for application type
        $(self.fieldTypeID).removeEvents();
        $(self.fieldTypeID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();

            self.typeModal = new ApplicationTypesModal(
                function(app_type) {
                    $(self.fieldTypeID).value = app_type;
                    $(self.errorTypeID).setStyle('display', 'none');
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

        // event for create button
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
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
            AppMainSite.initObj();
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

var AppMainView = function(data)
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
        AppMainSite.activeView = 'VIEW';
        $(AppMainSite.titleID).set('html', 'Applications/'+data['name']);
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
            AppMainSite.initEdit(data);
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
            AppMainSite.historyMngr.remove('id');
            AppMainSite.initObj();
        });
    }
}

var AppMainEdit = function(data)
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
        AppMainSite.activeView = 'EDIT';
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
  
        if ([null, '0000-00-00', ''].contains(data['production_date'])) {
            $(self.fieldProductionID).value = '';
            $(self.fieldProductionID).getNext().value = '';
        } else {
            $(self.fieldProductionID).value = data['production_date'];
            $(self.fieldProductionID).getNext().value = DateFormatter.formatDate(data['production_date']);
        }

        if ([null, '0000-00-00', ''].contains(data['termination_date'])) {
            $(self.fieldTerminationID).value = '';
            $(self.fieldTerminationID).getNext().value = '';
        } else {
            $(self.fieldTerminationID).value = data['termination_date'];
            $(self.fieldTerminationID).getNext().value = DateFormatter.formatDate(data['termination_date']);
        }
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
            AppMainSite.initView(data);
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

var AppMainSite = {
    titleID         : 'app-main-title',
    csrfID          : 'app-main-csrf',
    mainObj         : new AppMainList(),
    createObj       : new AppMainCreate(),
    viewObj         : null,
    editObj         : null,
    //some more variables
    activeView      : '',
    historyMngr     : new HistoryManager(),
    searchParams    : {
        'type'              : 'BASIC',
        'page'              : 1,
        'name'              : '',
        'project'           : '',
        'rd_point_person'   : '',
        'server_type'       : '',
        'server_id'         : '',
        'usergroup'         : '',
        'point_person'      : '',
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
            self.historyMngr.set('search', {
                'type'              : self.searchParams['type'],
                'page'              : self.searchParams['page'],
                'name'              : self.searchParams['name'],
                'project'           : self.searchParams['project'],
                'rd_point_person'   : self.searchParams['rd_point_person'],
            });
        }
    },

    initObj: function()
    {
        var self = this;
        self.closeActive();
        self.mainObj.init();
    },

    initCreate: function()
    {
        var self = this;
        self.closeActive();
        self.createObj.init();
    },

    initView: function(data)
    {
        var self = this;
        self.closeActive();
        self.viewObj = new AppMainView(data);
        self.viewObj.init();
    },

    initEdit: function(data)
    {
        var self = this;
        self.closeActive();
        self.editObj = new AppMainEdit(data);
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
                AppMainData.getAjaxData({
                    'application_id': aid,
                    'is_main'       : true,
                    'YII_CSRF_TOKEN': $(self.csrfID).value,
                // on success
                }, function(data) {
                    self.initView(data)
                // on fail
                }, function() {
                    AppMainSite.historyMngr.remove('id');
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
                self.searchParams['type']               = ('type' in new_value)? new_value['type'] : 'BASIC';
                self.searchParams['page']               = ('page' in new_value)? new_value['page'] : 1;
                self.searchParams['name']               = ('name' in new_value)? new_value['name'] : '';
                self.searchParams['project']            = ('project' in new_value)? new_value['project'] : '';
                self.searchParams['rd_point_person']    = ('rd_point_person' in new_value)? new_value['rd_point_person'] : '';
                self.searchParams['server_type']        = ('server_type' in new_value)? new_value['server_type'] : '';
                self.searchParams['server_id']          = ('server_id' in new_value)? new_value['server_id'] : '';
                self.searchParams['usergroup']          = ('usergroup' in new_value)? new_value['usergroup'] : '';
                self.searchParams['point_person']       = ('point_person' in new_value)? new_value['point_person'] : '';

                if (hasInvalid) {
                    var h = {
                        'type'              : AppMainSite.searchParams['type'],
                        'page'              : AppMainSite.searchParams['page'],
                        'name'              : AppMainSite.searchParams['name'],
                        'project'           : AppMainSite.searchParams['project'],
                        'rd_point_person'   : AppMainSite.searchParams['rd_point_person'],
                    }
                    if (h['type'] == 'ADVANCED') {
                        h['server_type']    = AppMainSite.searchParams['server_type'];
                        h['server_id']      = AppMainSite.searchParams['server_id'];
                        h['usergroup']      = AppMainSite.searchParams['usergroup'];
                        h['point_person']   = AppMainSite.searchParams['point_person'];
                    }
                    AppMainSite.historyMngr.set('search', h);
                } else {
                    if (!('id' in hash)) {
                        self.initObj();
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
                'type'      : 'BASIC',
                'page'      : 1,
                'name'      : '',
                'project'   : '',
                'rd_point_person': '',
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
    AppMainSite.init();
});