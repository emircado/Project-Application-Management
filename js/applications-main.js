var AppMainData = function()
{
    var self = this;
    self.getDataURL = baseURL + '/applications/list';
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
                    onRetrieve(data);
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

var AppMainList = function()
{
    var self            = this;
    self.containerID    = 'app-main-list';

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
    self.fieldNameID    = 'app-main-list-search-name';
    self.fieldProjectID = 'app-main-list-search-project';
    self.csrfID         = 'app-main-list-csrf';

    //buttons
    self.createButtonID = 'app-main-list-create-button';
    self.viewButtonID   = 'tr[id^=app-main-list-view_]';
    self.searchButtonID = 'search-submit';
    self.clearButtonID  = 'app-main-list-clear-button';

    self.init = function()
    {
        AppMainSite.activeView = 'LIST';
        AppMainSite.dataObj.getAjaxData({
            'page'      : AppMainSite.searchParams['page'],
            'name'      : AppMainSite.searchParams['name'],
            'project'   : AppMainSite.searchParams['project'],
            'is_main'   : true,
            'YII_CSRF_TOKEN': $(self.csrfID).value,
        }, self.getData, function(){});

        $(AppMainSite.titleID).set('html', 'Projects');
        $$('.'+self.tableRowClass).dispose();
        $(self.containerID).setStyle('display', 'block');

        $(self.fieldNameID).value    = AppMainSite.searchParams['name'];
        $(self.fieldProjectID).value = AppMainSite.searchParams['project'];
    }

    self.hide = function()
    {
        $(self.containerID).setStyle('display', 'none');
        $(self.fieldNameID).value = '';
        $(self.fieldProjectID).value = '';
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

                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['project_name']+'</td>'                        
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
                // ProjectsSite.historyMngr.set('search', {
                //     'page'  : ProjectsSite.searchParams['page']+1,
                //     'name'  : ProjectsSite.searchParams['name'],
                //     'code'  : ProjectsSite.searchParams['code'],
                //     'status': ProjectsSite.searchParams['status'],
                // });

                AppMainSite.searchParams['page']++;
                self.init();
            }
        });
        
        //EVENT FOR PREVIOUS PAGE
        $(self.prevID).removeEvents();
        $(self.prevID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != 1) {
                // ProjectsSite.historyMngr.set('search', {
                //     'page'  : ProjectsSite.searchParams['page']-1,
                //     'name'  : ProjectsSite.searchParams['name'],
                //     'code'  : ProjectsSite.searchParams['code'],
                //     'status': ProjectsSite.searchParams['status'],
                // });

                AppMainSite.searchParams['page']--;
                self.init();
            }
        });

        //EVENT FOR SEARCH BUTTON
        $(self.searchButtonID).removeEvents();
        $(self.searchButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            // ProjectsSite.historyMngr.set('search', {
            //     'page'  : 1,
            //     'name'  : $(self.fieldNameID).value.trim(),
            //     'code'  : $(self.fieldCodeID).value.trim(),
            //     'status': $(self.fieldStatusID).value.trim(),
            // });

            AppMainSite.searchParams['page'] = 1;
            AppMainSite.searchParams['name'] = $(self.fieldNameID).value.trim();
            AppMainSite.searchParams['project'] = $(self.fieldProjectID).value.trim();
            self.init();
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
                // ProjectsSite.historyMngr.set('pid', pid);
                AppMainSite.initView(self.resultData[self.lookupData.get(aid)]);
            }
        });

        //EVENT FOR CREATING A NEW PROJECT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            AppMainSite.initCreate();
        });
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
                'project_id':           $(self.fieldProjectID).value,
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
    self.fieldProjectID         = 'app-main-view-project';
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
        $(AppMainSite.titleID).set('html', 'Projects/'+data['name']);
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

        $(self.fieldProjectID).set('html', '(ID: '+data['project_id']+') '+data['project_name']);
        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldTypeID).set('html', AppTypesData.get(data['type_id']));
        $(self.fieldAccessibilityID).set('html', data['accessibility']);
        $(self.fieldRepositoryID).set('html', data['repository_url']);
        $(self.fieldPatternID).set('html', (data['uses_mobile_patterns'] == 1)? 'YES' : 'NO');
        new ReadMore(self.fieldDescriptionID, data['description']).renderData();
        new ReadMore(self.fieldInstructionsID, data['instructions']).renderData();
        $(self.fieldPointPersonID).set('html', LDAPGroupsData.get('DEVELOPERS').get(data['rd_point_person']));
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
                'project_id':           $(self.fieldProjectID).value.trim(),
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

        $(self.fieldProjectID).value         = data['project_id'];
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
    // data objects
    dataObj         : new AppMainData(),
    ldapGroupsObj   : null,
    ldapUsersObj    : null,
    appTypesObj     : null,
    appServersObj   : null,
    //some more variables
    activeView      : '',
    searchParams    : {
        'page'    : 1,
        'name'    : '',
        'project' : '',
    },

    init: function()
    {
        var self = this;
        LDAPUsersData.init($(self.csrfID).value);
        LDAPGroupsData.init($(self.csrfID).value);
        AppTypesData.init($(self.csrfID).value);
        AppServersData.init($(self.csrfID).value);

        self.initObj();
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