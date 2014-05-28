var ApplicationsList = function(project_id)
{
    var self = this;
    self.getDataURL = baseURL + '/applications/list';
    self._request = null;

    self.containerID    = 'applications-list';
    
    //for pagination
    self.nextID         = 'applications-list-next';
    self.prevID         = 'applications-list-prev';
    self.totalDataID    = 'applications-list-total';
    self.totalPartID    = 'applications-list-part';

    //for table
    self.tableID        = 'applications-list-table';
    self.totalPage      = 1;
    self.currentPage    = 1;
    self.resultData     = [];
    self.tableRowClass  = 'applications-list-row';

    //buttons
    self.viewButtonID   = 'a[id^=applications-list-view_]';
    self.createButtonID = 'applications-list-create-button';

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
                'page'          : self.currentPage,
                'project_id'    : project_id
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
                var pointperson = ProjectsSite.ldapGroupsObj.ldapGroupsData.get('DEVELOPERS').get(val['rd_point_person']);
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+ProjectsSite.appTypesObj.appTypes.keyOf(val['type_id'])+'</td>'
                            + '<td>'+((pointperson == null)? '' : pointperson)+'</td>'
                            + '<td class="actions-col two-column">'
                            + '<a id="applications-list-view_' + idx + '" href="#" title="View Application"><span class="">View</span></a>&nbsp'
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
            
            contentHTML = '<td>No applications found</td><td></td><td></td><td></td>';
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

        //CREATE AN APPLICATION
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ApplicationsSite.initCreate(project_id);
        });

        //VIEW CONTACT PERSON
        $$(self.viewButtonID).removeEvents();
        $$(self.viewButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');
            ApplicationsSite.initView(self.resultData[parseInt($(this).get('id').split('_')[1])]);
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

var ApplicationsCreate = function(project_id)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/create';
    self._request = null;

    self.containerID = 'applications-create';
    self.modalContainerID = 'applications-create-modal-container';
    self.typeModal = new ApplicationTypesModal();

    //fields
    self.fieldNameID           = 'applications-create-name';
    self.fieldTypeID           = 'applications-create-type';
    self.fieldAccessibilityID  = 'applications-create-accessibility';
    self.fieldRepositoryID     = 'applications-create-repository';
    self.fieldDescriptionID    = 'applications-create-description';
    self.fieldInstructionsID   = 'applications-create-instructions';
    self.fieldPointPersonID    = 'applications-create-pointperson';
    self.fieldProductionID     = 'applications-create-production';
    self.fieldTerminationID    = 'applications-create-termination';
    self.fieldPatternID        = 'applications-create-pattern';
    self.csrfID                = 'applications-create-csrf';

    //dropdown class
    self.pointPersonRowClass   = 'applications-create-pointperson-row';
    
    //error fields
    self.errorTypeID           = 'applications-create-type-error';
    self.errorAccessibilityID  = 'applications-create-accessibility-error';

    //buttons
    self.createButtonID        = 'applications-create-save-button';
    self.cancelButtonID        = 'applications-create-cancel-button';

    self.init = function()
    {
        $(self.containerID).setStyle('display', 'block');
        $(self.modalContainerID).grab($(self.typeModal.modalID), 'top');
        self.initDropdown();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':       $(self.csrfID).value,
                'project_id':           project_id,
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
                            if (msg[0] == 'TYPE_ERROR') {
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
            $(self.errorTypeID).setStyle('display', 'none');
            $(self.errorAccessibilityID).setStyle('display', 'none');
            self.postAjaxData();
        });
    
        // event for cancel button
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');

            // clear form
            self.typeModal.closeModal();
            $(self.fieldNameID).value = '';
            $(self.fieldTypeID).value = '';
            $(self.fieldAccessibilityID).value = 'PUBLIC';
            $(self.fieldRepositoryID).value = '';
            $(self.fieldDescriptionID).value = '';
            $(self.fieldInstructionsID).value = '';
            $(self.fieldPointPersonID).set('html', '');
            $(self.fieldProductionID).value = '0000-00-00';
            $(self.fieldTerminationID).value = '0000-00-00';

            ApplicationsSite.initObj(project_id);
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

        hash = new Hash(ProjectsSite.ldapGroupsObj.ldapGroupsData['DEVELOPERS']);
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

var ApplicationsView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/delete';
    self._request = null;

    //display
    self.containerID            = 'applications-view';

    //fields
    self.fieldNameID            = 'applications-view-name';
    self.fieldTypeID            = 'applications-view-type';
    self.fieldAccessibilityID   = 'applications-view-accessibility';
    self.fieldRepositoryID      = 'applications-view-repository';
    self.fieldPatternID         = 'applications-view-pattern';
    self.fieldDescriptionID     = 'applications-view-description';
    self.fieldInstructionsID    = 'applications-view-instructions';
    self.fieldPointPersonID     = 'applications-view-pointperson';
    self.fieldProductionID      = 'applications-view-production';
    self.fieldTerminationID     = 'applications-view-termination';
    self.fieldCreatedID         = 'applications-view-created';
    self.fieldCreatedbyID       = 'applications-view-createdby';
    self.fieldUpdatedID         = 'applications-view-updated';
    self.fieldUpdatedbyID       = 'applications-view-updatedby';
    self.csrfID                 = 'applications-view-csrf';
    
    //buttons
    self.editButtonID           = 'applications-view-edit-button';
    self.deleteButtonID         = 'applications-view-delete-button';
    self.backButtonID           = 'applications-view-back-button';

    self.init = function()
    {
        $(self.containerID).setStyle('display', 'block');
        
        ApplicationNotesSite.init(data['application_id']);
        AppServersSite.init(data['application_id']);
        AppPointPersonsSite.init(data['application_id']);
        
        self.renderData();
        self.addEvents();
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
        var createdby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['created_by']);
        var updatedby = ProjectsSite.ldapUsersObj.ldapUsersData.get(data['updated_by']);
        var created = (data['date_created'] == null || data['date_created'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_created']);
        var updated = (data['date_updated'] == null || data['date_updated'] == '0000-00-00 00:00:00')? '' : DateFormatter.formatDateTime(data['date_updated']);
        var termination = (data['termination_date'] == null || data['termination_date'] == '0000-00-00')? '' : DateFormatter.formatDate(data['termination_date']);
        var production = (data['production_date'] == null || data['production_date'] == '0000-00-00')? '' : DateFormatter.formatDate(data['production_date']);

        $(self.fieldNameID).set('html', data['name']);
        $(self.fieldTypeID).set('html', ProjectsSite.appTypesObj.appTypes.keyOf(data['type_id']));
        $(self.fieldAccessibilityID).set('html', data['accessibility']);
        $(self.fieldRepositoryID).set('html', data['repository_url']);
        $(self.fieldPatternID).set('html', (data['uses_mobile_patterns'] == 1)? 'YES' : 'NO');
        $(self.fieldDescriptionID).set('html', '<pre>'+data['description']);
        $(self.fieldInstructionsID).set('html', '<pre>'+data['instructions']);
        $(self.fieldPointPersonID).set('html', ProjectsSite.ldapGroupsObj.ldapGroupsData.get('DEVELOPERS').get(data['rd_point_person']));
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
            $(self.containerID).setStyle('display', 'none');
            ApplicationsSite.initEdit(data);
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
            $(self.containerID).setStyle('display', 'none');
            ApplicationsSite.initObj(data['project_id']);
        });
    }
}

var ApplicationsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/update';
    self._request = null;

    self.containerID            = 'applications-edit';
    self.modalContainerID       = 'applications-edit-modal-container';
    self.typeModal              = new ApplicationTypesModal();

    //fields
    self.fieldNameID            = 'applications-edit-name';
    self.fieldTypeID            = 'applications-edit-type';
    self.fieldAccessibilityID   = 'applications-edit-accessibility';
    self.fieldRepositoryID      = 'applications-edit-repository';
    self.fieldDescriptionID     = 'applications-edit-description';
    self.fieldInstructionsID    = 'applications-edit-instructions';
    self.fieldPointPersonID     = 'applications-edit-pointperson';
    self.fieldProductionID      = 'applications-edit-production';
    self.fieldTerminationID     = 'applications-edit-termination';
    self.fieldPatternID         = 'applications-edit-pattern';
    self.csrfID                 = 'applications-edit-csrf';

    //dropdown class
    self.pointPersonRowClass = 'applications-edit-pointperson-row';

    //error fields
    self.errorTypeID = 'applications-edit-type-error';
    self.errorAccessibilityID = 'applications-edit-accessibility-error';

    //buttons
    self.saveButtonID = 'applications-edit-save-button';
    self.cancelButtonID = 'applications-edit-cancel-button';

    self.init = function()
    {
        $(self.containerID).setStyle('display', 'block');
        $(self.modalContainerID).grab($(self.typeModal.modalID), 'top');
        self.initDropdown();
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':       $(self.csrfID).value,
                'application_id':       data['application_id'],
                'project_id':           data['project_id'],
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
                            if (msg[0] == 'TYPE_ERROR') {
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
                        data['type_id']             = ProjectsSite.appTypesObj.appTypes.get(params['type_name']);
                        data['name']                = response['data']['name'];
                        data['description']         = response['data']['description'];
                        data['accessibility']       = response['data']['accessibility'];
                        data['repository_url']      = response['data']['repository_url'];
                        data['uses_mobile_patterns']= response['data']['uses_mobile_patterns'];
                        data['instructions']        = response['data']['instructions'];
                        data['rd_point_person']     = response['data']['rd_point_person'];
                        data['production_date']     = response['data']['production_date'];
                        data['termination_date']    = response['data']['termination_date'];
                        data['date_updated']        = response['data']['date_updated'];
                        data['updated_by']          = response['data']['updated_by'];

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
        $(self.fieldNameID).value            = data['name'];
        $(self.fieldTypeID).value            = ProjectsSite.appTypesObj.appTypes.keyOf(data['type_id']);
        $(self.fieldAccessibilityID).value   = data['accessibility'];
        $(self.fieldRepositoryID).value      = data['repository_url'];
        $(self.fieldPatternID).checked       = (data['uses_mobile_patterns'] == 1)? true : false;
        $(self.fieldDescriptionID).value     = data['description'];
        $(self.fieldInstructionsID).value    = data['instructions'];
        $(self.fieldPointPersonID).value     = data['rd_point_person'];
        $(self.fieldProductionID).value      = data['production_date'];
        $(self.fieldTerminationID).value     = data['termination_date'];
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
            $(self.errorTypeID).setStyle('display', 'none');
            $(self.errorAccessibilityID).setStyle('display', 'none');
            self.postAjaxData();
        });
    
        // event for cancel button
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.containerID).setStyle('display', 'none');

            // clear form
            self.typeModal.closeModal();
            $(self.fieldNameID).value = '';
            $(self.fieldTypeID).value = '';
            $(self.fieldAccessibilityID).value = 'PUBLIC';
            $(self.fieldRepositoryID).value = '';
            $(self.fieldDescriptionID).value = '';
            $(self.fieldInstructionsID).value = '';
            $(self.fieldPointPersonID).set('html', '');
            $(self.fieldProductionID).value = '0000-00-00';
            $(self.fieldTerminationID).value = '0000-00-00';

            ApplicationsSite.initView(data);
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

        hash = new Hash(ProjectsSite.ldapGroupsObj.ldapGroupsData['DEVELOPERS']);
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

var ApplicationsSite = {
    init: function(project_id)
    {
        var self = this;
        self.initObj(project_id);
    },

    initObj: function(project_id)
    {
        new ApplicationsList(project_id).init();
    },

    initCreate: function(project_id)
    {
        new ApplicationsCreate(project_id).init();
    },

    initEdit: function(data)
    {
        new ApplicationsEdit(data).init();
    },

    initView: function(data)
    {
        new ApplicationsView(data).init();
    }
}