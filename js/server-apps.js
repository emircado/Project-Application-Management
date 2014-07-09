var ServerAppsList = function(server_id)
{
    var self = this;
    self.getDataURL = baseURL + '/applications/list';
    self._request = null;

    self.containerID    = 'server-apps-list';
    self.csrfID         = 'server-apps-list-csrf';
    
    //for pagination
    self.nextID         = 'server-apps-list-next';
    self.prevID         = 'server-apps-list-prev';
    self.totalDataID    = 'server-apps-list-total';
    self.totalPartID    = 'server-apps-list-part';

    //for table
    self.tableID        = 'server-apps-list-table';
    self.totalPage      = 1;
    self.currentPage    = 1;
    self.resultData     = [];
    self.tableRowClass  = 'server-apps-list-row';

    //buttons
    self.viewButtonID   = 'tr[id^=server-apps-list-view_]';
    self.createButtonID = 'server-apps-list-create-button';

    self.init = function()
    {
        ServerAppsSite.activeView = 'LIST';
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
                'server_id'     : server_id,
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
                var pointperson = LDAPGroupsData.get('DEVELOPERS').get(val['rd_point_person']);
                contentHTML = '<td>'+val['project_name']+'</td>'
                            + '<td>'+val['name']+'</td>'
                            + '<td>'+((pointperson == null)? '' : pointperson)+'</td>';

                contentElem = new Element('<tr />',
                {
                    'class' : self.tableRowClass,
                    'html'  : contentHTML,
                    'id'    : 'server-apps-list-view_'+idx
                });
                
                contentElem.inject($(self.tableID), 'bottom');
            });
        }
        else
        {
            $(self.totalDataID).set('html', '');
            
            contentHTML = '<td colspan="3">No applications found</td>';
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

        //CREATE AN APPLICATION
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ServerAppsSite.initCreate(server_id);
        });

        //VIEW CONTACT PERSON
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            var idx = parseInt($(this).get('id').split('_')[1]);
            if (typeof idx==='number' && (idx%1)===0) {
                ServerAppsSite.initView(self.resultData[idx]);
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

var ServerAppsCreate = function(server_id)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/create';
    self._request = null;

    self.containerID = 'server-apps-create';
    self.modalContainerID = 'server-apps-create-modal-container';
    self.typeModal = new ApplicationTypesModal();
    self.projectModal = new ProjectsListModal();

    //fields
    self.fieldProjectID        = 'server-apps-create-project';
    self.fieldNameID           = 'server-apps-create-name';
    self.fieldTypeID           = 'server-apps-create-type';
    self.fieldAccessibilityID  = 'server-apps-create-accessibility';
    self.fieldRepositoryID     = 'server-apps-create-repository';
    self.fieldDescriptionID    = 'server-apps-create-description';
    self.fieldInstructionsID   = 'server-apps-create-instructions';
    self.fieldPointPersonID    = 'server-apps-create-pointperson';
    self.fieldProductionID     = 'server-apps-create-production';
    self.fieldTerminationID    = 'server-apps-create-termination';
    self.fieldPatternID        = 'server-apps-create-pattern';
    self.fieldPathID           = 'server-apps-create-path';
    self.fieldLogID            = 'server-apps-create-log';
    self.csrfID                = 'server-apps-create-csrf';
    self.project_id            = '';

    //dropdown class
    self.pointPersonRowClass   = 'server-apps-create-pointperson-row';
    
    //error fields
    self.errorProjectID        = 'server-apps-create-project-error'
    self.errorNameID           = 'server-apps-create-name-error';
    self.errorTypeID           = 'server-apps-create-type-error';
    self.errorAccessibilityID  = 'server-apps-create-accessibility-error';

    //buttons
    self.createButtonID        = 'server-apps-create-save-button';
    self.cancelButtonID        = 'server-apps-create-cancel-button';

    self.datePickerProd        = null;
    self.datePickerTerm        = null;

    self.init = function()
    {
        ServerAppsSite.activeView = 'CREATE';

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
        $(self.fieldPathID).value = '';
        $(self.fieldLogID).value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':       $(self.csrfID).value,
                'server_id':            server_id,
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
                'termination_date':     $(self.fieldTerminationID).value.trim(),
                'application_path':     $(self.fieldPathID).value.trim(), 
                'application_log':      $(self.fieldLogID).value.trim(),
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
            ServerAppsSite.initObj(server_id);
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

var ServerAppsView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/delete';
    self._request = null;

    //display
    self.containerID            = 'server-apps-view';

    //fields
    self.fieldNameID            = 'server-apps-view-name';
    self.fieldTypeID            = 'server-apps-view-type';
    self.fieldAccessibilityID   = 'server-apps-view-accessibility';
    self.fieldRepositoryID      = 'server-apps-view-repository';
    self.fieldPatternID         = 'server-apps-view-pattern';
    self.fieldDescriptionID     = 'server-apps-view-description';
    self.fieldInstructionsID    = 'server-apps-view-instructions';
    self.fieldPointPersonID     = 'server-apps-view-pointperson';
    self.fieldProductionID      = 'server-apps-view-production';
    self.fieldTerminationID     = 'server-apps-view-termination';
    self.fieldCreatedID         = 'server-apps-view-created';
    self.fieldCreatedbyID       = 'server-apps-view-createdby';
    self.fieldUpdatedID         = 'server-apps-view-updated';
    self.fieldUpdatedbyID       = 'server-apps-view-updatedby';
    self.fieldPathID            = 'server-apps-view-path';
    self.fieldLogID             = 'server-apps-view-log';
    self.csrfID                 = 'server-apps-view-csrf';
    
    //buttons
    self.editButtonID           = 'server-apps-view-edit-button';
    self.deleteButtonID         = 'server-apps-view-delete-button';
    self.backButtonID           = 'server-apps-view-back-button';

    self.init = function()
    {
        ServerAppsSite.activeView = 'VIEW';
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
        $(self.fieldPathID).set('html', data['application_path']);
        $(self.fieldLogID).set('html', data['application_log']);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            ServerAppsSite.initEdit(data);
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
            ServerAppsSite.initObj(data['server_id']);
        });
    }
}

var ServerAppsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/update';
    self._request = null;

    self.containerID           = 'server-apps-edit';
    self.modalContainerID      = 'server-apps-create-modal-container';
    self.typeModal             = new ApplicationTypesModal();
    self.projectModal          = new ProjectsListModal();

    //fields
    self.fieldProjectID        = 'server-apps-edit-project';
    self.fieldNameID           = 'server-apps-edit-name';
    self.fieldTypeID           = 'server-apps-edit-type';
    self.fieldAccessibilityID  = 'server-apps-edit-accessibility';
    self.fieldRepositoryID     = 'server-apps-edit-repository';
    self.fieldDescriptionID    = 'server-apps-edit-description';
    self.fieldInstructionsID   = 'server-apps-edit-instructions';
    self.fieldPointPersonID    = 'server-apps-edit-pointperson';
    self.fieldProductionID     = 'server-apps-edit-production';
    self.fieldTerminationID    = 'server-apps-edit-termination';
    self.fieldPatternID        = 'server-apps-edit-pattern';
    self.fieldPathID           = 'server-apps-edit-path';
    self.fieldLogID            = 'server-apps-edit-log';
    self.csrfID                = 'server-apps-edit-csrf';
    self.project_id            = '';

    //dropdown class
    self.pointPersonRowClass   = 'server-apps-edit-pointperson-row';
    
    //error fields
    self.errorProjectID        = 'server-apps-edit-project-error'
    self.errorNameID           = 'server-apps-edit-name-error';
    self.errorTypeID           = 'server-apps-edit-type-error';
    self.errorAccessibilityID  = 'server-apps-edit-accessibility-error';

    //buttons
    self.saveButtonID          = 'server-apps-edit-save-button';
    self.cancelButtonID        = 'server-apps-edit-cancel-button';

    self.datePickerProd        = null;
    self.datePickerTerm        = null;

    self.init = function()
    {
        ServerAppsSite.activeView = 'EDIT';

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
        $(self.fieldPathID).value = '';
        $(self.fieldLogID).value = '';
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':       $(self.csrfID).value,
                'application_id':       data['application_id'],
                'server_id':            data['server_id'],
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
                'termination_date':     $(self.fieldTerminationID).value.trim(),
                'application_path':     $(self.fieldPathID).value.trim(), 
                'application_log':      $(self.fieldLogID).value.trim(),
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
                        data['application_path']     = response['data']['application_path'];
                        data['application_log']      = response['data']['application_log'];

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
        $(self.fieldNameID).value            = data['name'].replace(/&lt/g, '<');
        $(self.fieldTypeID).value            = AppTypesData.get(data['type_id']);
        $(self.fieldAccessibilityID).value   = data['accessibility'];
        $(self.fieldRepositoryID).value      = data['repository_url'].replace(/&lt/g, '<');
        $(self.fieldPatternID).checked       = (data['uses_mobile_patterns'] == 1)? true : false;
        $(self.fieldDescriptionID).value     = data['description'].replace(/&lt/g, '<');;
        $(self.fieldInstructionsID).value    = data['instructions'].replace(/&lt/g, '<');
        $(self.fieldPointPersonID).value     = data['rd_point_person'];
        $(self.fieldPathID).value            = data['application_path'].replace(/&lt/g, '<');
        $(self.fieldLogID).value             = data['application_log'].replace(/&lt/g, '<');
  
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
            ServerAppsSite.initView(data);
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

var ServerAppsSite = {
    mainObj     : null,
    createObj   : null,
    editObj     : null,
    viewObj     : null,

    activeView  : '',

    init: function(server_id)
    {
        var self = this;
        self.initObj(server_id);
    },

    initObj: function(server_id)
    {
        var self = this;
        self.closeActive();
        self.mainObj = new ServerAppsList(server_id);
        self.mainObj.init();
    },

    initCreate: function(server_id)
    {
        var self = this;
        self.closeActive();
        self.createObj = new ServerAppsCreate(server_id);
        self.createObj.init();
    },

    initEdit: function(data)
    {
        var self = this;
        self.closeActive();
        self.editObj = new ServerAppsEdit(data);
        self.editObj.init();
    },

    initView: function(data)
    {
        var self = this;
        self.closeActive();
        self.viewObj = new ServerAppsView(data);
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