var ApplicationsList = function(project_id)
{
    var self = this;
    self.getDataURL = baseURL + '/applications/list';
    self._request = null;

    //container
    self.applicationsListID = 'applications-list';
    
    //buttons
    self.viewID = 'a[id^=applications-view_]';
    self.createButtonID = 'applications-button-add';

    //table
    self.tableID = 'applications-table';
    self.tableRowClass = 'applications-row';
    self.currentPage = 1;
    self.resultData = [];

    //nav
    self.nextID = 'applications-next';
    self.prevID = 'applications-prev';
    self.totalDataID = 'applications-total';
    self.totalPartID = 'applications-part';

    self.init = function()
    {   
        $$('.'+self.tableRowClass).dispose();
        $(self.applicationsListID).setStyle('display', 'block');
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
                var pointperson = ProjectsSite.ldapObj.ldapData.get('DEVELOPERS').get(val['rd_point_person']);


                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+ProjectsSite.appTypesObj.appTypes.keyOf(val['type_id'])+'</td>'
                            + '<td>'+((pointperson == null)? '' : pointperson)+'</td>'
                            + '<td class="actions-col two-column">'
                            + '<a id="applications-view_' + idx + '" href="#" title="View Application"><span class="">View</span></a>&nbsp'
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
            $(self.applicationsListID).setStyle('display', 'none');
            ApplicationsSite.initCreate(project_id);
        });

        //VIEW CONTACT PERSON
        $$(self.viewID).removeEvents();
        $$(self.viewID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.applicationsListID).setStyle('display', 'none');
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
    self.typeModal = new ApplicationTypesModal();

    self.createApplicationID = 'applications-create';
    self.createModalContainerID = 'create-applications-modal-container';

    //fields
    self.createNameID = 'create-applications-name';
    self.createTypeID = 'create-applications-type';
    self.createAccessibilityID = 'create-applications-accessibility';
    self.createRepositoryID = 'create-applications-repository';
    self.createDescriptionID = 'create-applications-description';
    self.createInstructionsID = 'create-applications-instructions';
    self.createPointPersonID = 'create-applications-pointperson';
    self.createProductionID = 'create-applications-production';
    self.createTerminationID = 'create-applications-termination';
    self.createCSRFID = 'applications-create-csrf';

    //error fields
    self.createTypeErrorID = 'create-applications-type-error';
    self.createAccessibilityErrorID = 'create-applications-accessibility-error';

    self.pointPersonRowClass = 'create-applications-pointperson-row';

    //buttons
    self.createButtonID = 'create-applications-create-button';
    self.cancelButtonID = 'create-applications-cancel-button';

    self.init = function()
    {
        $(self.createApplicationID).setStyle('display', 'block');
        $(self.createModalContainerID).grab($(self.typeModal.modalID), 'top');
        self.initDropdown();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':   $(self.createCSRFID).value,
                'project_id':       project_id,
                'name':             $(self.createNameID).value,
                'type_name':        $(self.createTypeID).value,
                'accessibility':    $(self.createAccessibilityID).value,
                'repository_url':   $(self.createRepositoryID).value,
                'description':      $(self.createDescriptionID).value,
                'instructions':     $(self.createInstructionsID).value,
                'rd_point_person':  $(self.createPointPersonID).value,
                'production_date':  $(self.createProductionID).value,
                'termination_date': $(self.createTerminationID).value
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
                        $(self.createTypeErrorID).setStyle('display', 'none');
                        $(self.createAccessibilityErrorID).setStyle('display', 'none');
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'TYPE_ERROR') {
                                $(self.createTypeErrorID).set('html', msg[1]);
                                $(self.createTypeErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'ACCESSIBILITY_ERROR') {
                                $(self.createAccessibilityErrorID).set('html', msg[1]);
                                $(self.createAccessibilityErrorID).setStyle('display', 'block');
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
        $(self.createTypeID).removeEvents();
        $(self.createTypeID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();

            self.typeModal = new ApplicationTypesModal(
                function(app_type) {
                    $(self.createTypeID).value = app_type;
                }
            );
            self.typeModal.show();
        });

        // event for create button
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });
    
        // event for cancel button
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.createApplicationID).setStyle('display', 'none');

            // clear form
            self.typeModal.closeModal();
            $(self.createNameID).value = '';
            $(self.createTypeID).value = '';
            $(self.createAccessibilityID).value = 'PUBLIC';
            $(self.createRepositoryID).value = '';
            $(self.createDescriptionID).value = '';
            $(self.createInstructionsID).value = '';
            $(self.createPointPersonID).set('html', '');
            $(self.createProductionID).value = '0000-00-00';
            $(self.createTerminationID).value = '0000-00-00';

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
        contentElem.inject($(self.createPointPersonID), 'bottom');

        hash = new Hash(ProjectsSite.ldapObj.ldapData['DEVELOPERS']);
        hash.each(function(val, idx) {
            contentElem = new Element('<option />',
            {
                'class' : self.pointPersonRowClass,
                'value' : idx,
                'html'  : val
            });
            contentElem.inject($(self.createPointPersonID), 'bottom');
        });
    }
}

var ApplicationsView = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/delete';
    self._request = null;

    //display
    self.viewViewID = 'view-applications-view';

    //buttons
    self.editID = 'applications-edit';
    self.deleteID = 'applications-delete';
    self.viewToListID = 'view-applications-back';

    //fields
    self.viewNameID = 'view-applications-name';
    self.viewTypeID = 'view-applications-type';
    self.viewAccessibilityID = 'view-applications-accessibility';
    self.viewRepositoryID = 'view-applications-repository';
    self.viewDescriptionID = 'view-applications-description';
    self.viewInstructionsID = 'view-applications-instructions';
    self.viewPointPersonID = 'view-applications-pointperson';
    self.viewProductionID = 'view-applications-production';
    self.viewTerminationID = 'view-applications-termination';
    self.viewCreatedID = 'view-applications-created';
    self.viewCreatedbyID = 'view-applications-createdby';
    self.viewUpdatedID = 'view-applications-updated';
    self.viewUpdatedbyID = 'view-applications-updatedby';

    //for csrf
    self.viewCSRFID = 'applications-view-csrf';

    self.init = function()
    {
        $(self.viewViewID).setStyle('display', 'block');
        AppServersSite.init(data['application_id']);
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.viewCSRFID).value,
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
                        $(self.viewToListID).click();
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
        var createdby = ProjectsSite.ldapObj.ldapData.get('DEVELOPERS').get(data['created_by']);
        var updatedby = ProjectsSite.ldapObj.ldapData.get('DEVELOPERS').get(data['updated_by']);

        $(self.viewNameID).set('html', data['name']);
        $(self.viewTypeID).set('html', ProjectsSite.appTypesObj.appTypes.keyOf(data['type_id']));
        $(self.viewAccessibilityID).set('html', data['accessibility']);
        $(self.viewRepositoryID).set('html', data['repository_url']);
        $(self.viewDescriptionID).set('html', '<pre>'+data['description']);
        $(self.viewInstructionsID).set('html', '<pre>'+data['instructions']);
        $(self.viewPointPersonID).set('html', ProjectsSite.ldapObj.ldapData.get('DEVELOPERS').get(data['rd_point_person']));
        $(self.viewProductionID).set('html', data['production_date']);
        $(self.viewTerminationID).set('html', data['termination_date']);
        $(self.viewCreatedID).set('html', data['date_created']);
        $(self.viewCreatedbyID).set('html', (createdby == null)? data['created_by'] : createdby);
        $(self.viewUpdatedID).set('html', data['date_updated']);
        $(self.viewUpdatedbyID).set('html', (updatedby == null)? data['updated_by'] : updatedby);
    }

    self.addEvents = function()
    {
        //EDIT CONTACT PERSON
        $(self.editID).removeEvents();
        $(self.editID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewViewID).setStyle('display', 'none');
            ApplicationsSite.initEdit(data);
        });

        //DELETE CONTACT PERSON
        $(self.deleteID).removeEvents();
        $(self.deleteID).addEvent('click', function(e)
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
        $(self.viewToListID).removeEvents();
        $(self.viewToListID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.viewViewID).setStyle('display', 'none');
            ApplicationsSite.initObj(data['project_id']);
        });
    }
}

var ApplicationsEdit = function(data)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/update';
    self._request = null;
    self.typeModal = new ApplicationTypesModal();

    self.editApplicationID = 'edit-applications-view';
    self.editModalContainerID = 'edit-applications-modal-container';

    //fields
    self.editNameID = 'edit-applications-name';
    self.editTypeID = 'edit-applications-type';
    self.editAccessibilityID = 'edit-applications-accessibility';
    self.editRepositoryID = 'edit-applications-repository';
    self.editDescriptionID = 'edit-applications-description';
    self.editInstructionsID = 'edit-applications-instructions';
    self.editPointPersonID = 'edit-applications-pointperson';
    self.editProductionID = 'edit-applications-production';
    self.editTerminationID = 'edit-applications-termination';
    self.editCSRFID = 'applications-edit-csrf';

    //error fields
    self.editTypeErrorID = 'edit-applications-type-error';
    self.editAccessibilityErrorID = 'edit-applications-accessibility-error';

    self.pointPersonRowClass = 'edit-applications-pointperson-row';

    //buttons
    self.editButtonID = 'edit-applications-save-button';
    self.cancelButtonID = 'edit-applications-cancel-button';

    self.init = function()
    {
        $(self.editApplicationID).setStyle('display', 'block');
        $(self.editModalContainerID).grab($(self.typeModal.modalID), 'top');
        self.initDropdown();
        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN':   $(self.editCSRFID).value,
                'application_id':   data['application_id'],
                'project_id':       data['project_id'],
                'name':             $(self.editNameID).value,
                'type_name':        $(self.editTypeID).value,
                'accessibility':    $(self.editAccessibilityID).value,
                'repository_url':   $(self.editRepositoryID).value,
                'description':      $(self.editDescriptionID).value,
                'instructions':     $(self.editInstructionsID).value,
                'rd_point_person':  $(self.editPointPersonID).value,
                'production_date':  $(self.editProductionID).value,
                'termination_date': $(self.editTerminationID).value
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
                        $(self.editTypeErrorID).setStyle('display', 'none');
                        $(self.editAccessibilityErrorID).setStyle('display', 'none');
                        Array.each(response['data'].split(','), function(error, idx)
                        {
                            var msg = error.split(': ');
                            if (msg[0] == 'TYPE_ERROR') {
                                $(self.editTypeErrorID).set('html', msg[1]);
                                $(self.editTypeErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'ACCESSIBILITY_ERROR') {
                                $(self.editAccessibilityErrorID).set('html', msg[1]);
                                $(self.editAccessibilityErrorID).setStyle('display', 'block');
                            } else if (msg[0] == 'CSRF_ERROR') {
                                console.log(msg[1]);
                            }
                        });
                    } else if (response['type'] == 'success') {
                        data['type_id']             = ProjectsSite.appTypesObj.appTypes.get(params['type_name']);
                        data['name']                = params['name'];
                        data['description']         = params['description'];
                        data['accessibility']       = params['accessibility'];
                        data['repository_url']      = params['repository_url'];
                        data['instructions']        = params['instructions'];
                        data['rd_point_person']     = params['rd_point_person'];
                        data['production_date']     = params['production_date'];
                        data['termination_date']    = params['termination_date'];
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
        $(self.editNameID).value            = data['name'];
        $(self.editTypeID).value            = ProjectsSite.appTypesObj.appTypes.keyOf(data['type_id']);
        $(self.editAccessibilityID).value   = data['accessibility'];
        $(self.editRepositoryID).value      = data['repository_url'];
        $(self.editDescriptionID).value     = data['description'];
        $(self.editInstructionsID).value    = data['instructions'];
        $(self.editPointPersonID).value     = data['rd_point_person'];
        $(self.editProductionID).value      = data['production_date'];
        $(self.editTerminationID).value     = data['termination_date'];
    }

    self.addEvents = function()
    {
        // prevent focus on type field
        $(self.editTypeID).removeEvents();
        $(self.editTypeID).addEvent('focus', function(e)
        {
            e.preventDefault();
            $(this).blur();

            self.typeModal = new ApplicationTypesModal(
                function(app_type) {
                    $(self.editTypeID).value = app_type;
                }
            );
            self.typeModal.show();
        });

        // event for edit button
        $(self.editButtonID).removeEvents();
        $(self.editButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.postAjaxData();
        });
    
        // event for cancel button
        $(self.cancelButtonID).removeEvents();
        $(self.cancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.editApplicationID).setStyle('display', 'none');

            // clear form
            self.typeModal.closeModal();
            $(self.editNameID).value = '';
            $(self.editTypeID).value = '';
            $(self.editAccessibilityID).value = 'PUBLIC';
            $(self.editRepositoryID).value = '';
            $(self.editDescriptionID).value = '';
            $(self.editInstructionsID).value = '';
            $(self.editPointPersonID).set('html', '');
            $(self.editProductionID).value = '0000-00-00';
            $(self.editTerminationID).value = '0000-00-00';

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
        contentElem.inject($(self.editPointPersonID), 'bottom');

        hash = new Hash(ProjectsSite.ldapObj.ldapData['DEVELOPERS']);
        hash.each(function(val, idx) {
            contentElem = new Element('<option />',
            {
                'class' : self.pointPersonRowClass,
                'value' : idx,
                'html'  : val
            });
            contentElem.inject($(self.editPointPersonID), 'bottom');
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