var ApplicationsList = function(project_id)
{
    var self = this;

    self.applicationsListID = 'applications-list';
    self.createButtonID = 'applications-button-add';

    self.init = function()
    {
        $(self.applicationsListID).setStyle('display', 'block');
        self.addEvents();
    }

    self.addEvents = function()
    {
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();
            $(self.applicationsListID).setStyle('display', 'none');
            ApplicationsSite.initCreate(project_id);
        });
    }
}

var ApplicationsCreate = function(project_id)
{
    var self = this;
    self.postDataURL = baseURL + '/applications/create';
    self._request = null;
    self.typeModal = new ApplicationTypesModal();

    self.createApplicationID = 'applications-create';

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
            console.log(params);

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    console.log(response);
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

            self.typeModal = new ApplicationTypesModal(self.setApplicationType);
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

            ApplicationsSite.initObj();
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

    self.setApplicationType = function(app_type)
    {
        $(self.createTypeID).value = app_type;
    }
}

// var ContactPersonsView = function(data)
// {
//     var self = this;
// }

// var ContactPersonsEdit = function(data)
// {
//     var self = this;
// }

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
    }//,

    // initEdit: function(data)
    // {
    //     new ContactPersonsEdit(data).init();
    // },

    // initView: function(data)
    // {
    //     new ContactPersonsView(data).init();
    // }
}