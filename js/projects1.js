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
    self.lookupData		  = [];

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
    self.searchClearID    = 'a[id^=clear-search]';
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
        self.getAjaxData(self.currentPage);
    }
    
    self.getAjaxData = function(page)
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'page'      : page,
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
                    if(data.resultData.length)
                    {
                        self.currentPage  = data.page;
                        self.totalPage    = data.totalPage;
                        self.resultData = data.resultData;
                        self.pageLimit    = data.limit;
                        $$('#' + self.totalDataID).set('html', ' of '+data.totalData);
                        
                        self.renderData(self.resultData, data.view);
                    }
                    else
                       $$('#' + self.totalDataID).set('html', 'No projects');

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
    
    self.renderData = function(data, view)
    {
        self.lookupData = [];
        Array.each(data, function(val, idx)
        {
           	self.lookupData.push(val['project_id']);
            contentHTML = '<td>'+val['name']+'</td>'
                        + '<td>'+val['code']+'</td>'                        
                        + '<td>'+val['description']+'</td>'
                        + '<td>'+val['status']+'</td>'
                        + '<td>'+val['production_date_formatted']+'</td>'
                        + '<td class="actions-col three-column">'
                        + '<a id="view_' + val['project_id'] + '" href="#" title="View Project"><span class="">View</span></a>&nbsp'
                        + '</td>';

            contentElem = new Element('<tr />',
            {
                'class' : self.tableRowClass,
                'html' : contentHTML
            });
            
            contentElem.inject($(self.tableContainerID), 'bottom');
        });
    };

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

        //EVENT FOR CLEAR SEARCH FIELDS
        $$(self.searchClearID).removeEvents();
        $$(self.searchClearID).addEvent('click', function(e)
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
            var proj_id = $(this).get('id').split('_')[1];
            ProjectsSite.initView(self.resultData[self.lookupData.indexOf(proj_id)]);
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
    self.postDataURL = baseURL + '/projects/update';
    self._request = null;

    //display
    self.createProjectViewID = 'edit-projects-view';

    //buttons
    self.createSaveButtonID = 'edit-button-create-project';
    self.createCancelButtonID = 'edit-button-cancel';

    //fields
    self.createNameID = 'edit-name';
    self.createCodeID = 'edit-code';
    self.createDescriptionID = 'edit-description';
    self.createStatusID = 'edit-status';
    self.createProductionID = 'edit-production';
    self.createTerminationID = 'edit-termination';

    self.init = function()
    {
        $(self.createProjectViewID).setStyle('display', 'block');
        //hide status input
        $('status-div').setStyle('display', 'none');

        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'project_id'        : '',
                'name'              : $(self.createNameID).value,
                'code'              : $(self.createCodeID).value,
                'description'       : $(self.createDescriptionID).value, 
                'status'            : $(self.createStatusID).value,
                'production_date'   : $(self.createProductionID).value,
                'termination_date'  : $(self.createTerminationID).value
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'get',
                'data' : params,
                'onError' : function(data)
                {
                    self._request.stop;
                    console.log(data);
                    console.log('Something went wrong!');
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
            $(self.createStatusID).value = 'ACTIVE';
            $(self.createProductionID).value = '0000-00-00';
            $(self.createTerminationID).value = '0000-00-00';
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

    //for view project
    self.viewProjectViewID = 'view-projects-view';
    self.viewToMainID  = 'view-to-main';
    self.viewContentID = 'view-content';

    self.viewNameID = 'view-name';
    self.viewCodeID = 'view-code';
    self.viewDescriptionID = 'view-description';
    self.viewStatusID = 'view-status';
    self.viewProductionID = 'view-production';
    self.viewTerminationID = 'view-termination';
    self.viewCreatedID = 'view-created';
    self.viewUpdatedID = 'view-updated';

    self.editID = 'a[id^=edit_]';

    self.init = function()
    {
        $(self.viewProjectViewID).setStyle('display', 'block');

        self.renderData(data);
        self.addEvents();
    }

    self.renderData = function()
    {
        contentHTML = '<a id="edit_' + data['project_id'] + '" href="#" title="Edit Project"><span class="">[Edit]</span></a>&nbsp';

        $(self.viewContentID).set('html', contentHTML);

        $(self.viewNameID).set('html', data['name']);
        $(self.viewCodeID).set('html', data['code']);
        $(self.viewDescriptionID).set('html', data['description']);
        $(self.viewStatusID).set('html', data['status']);
        $(self.viewProductionID).set('html', data['production_date_formatted']);
        $(self.viewTerminationID).set('html', data['termination_date_formatted']);
        $(self.viewCreatedID).set('html', data['date_created_formatted']);
        $(self.viewUpdatedID).set('html', data['date_updated_formatted']);
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
        $$(self.editID).removeEvents();
        $$(self.editID).addEvent('click', function(e)
        {
            e.preventDefault();            
            ProjectsSite.mainObj.clearSearch();

            $(self.viewProjectViewID).setStyle('display', 'none');
            ProjectsSite.initEdit(data);
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
    self.editSaveButtonID = 'edit-button-create-project';
    self.editCancelButtonID = 'edit-button-cancel';

    self.editNameID = 'edit-name';
    self.editCodeID = 'edit-code';
    self.editDescriptionID = 'edit-description';
    self.editStatusID = 'edit-status';
    self.editProductionID = 'edit-production';
    self.editTerminationID = 'edit-termination';

    self.init = function()
    {
        $(self.editProjectViewID).setStyle('display', 'block');
        $('status-div').setStyle('display', 'block');

        self.renderData();
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'project_id'        : data['project_id'],
                'name'              : $(self.editNameID).value,
                'code'              : $(self.editCodeID).value,
                'description'       : $(self.editDescriptionID).value, 
                'status'            : $(self.editStatusID).value,
                'production_date'   : $(self.editProductionID).value,
                'termination_date'  : $(self.editTerminationID).value,
                'date_created'		: data['date_created'],
                'date_updated'		: data['date_updated']
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'get',
                'data' : params,
                'onError' : function(d)
                {
                    self._request.stop;
                    console.log('Something went wrong!');
                },
                'onComplete': function(d)
                {
                	data = d;
                    $(self.editCancelButtonID).click();
                }
            }).send();
        }
    };

    self.renderData = function()
    {
        $(self.editNameID).value = data['name'];
        $(self.editCodeID).value = data['code'];
        $(self.editDescriptionID).value = data['description'];
        $(self.editStatusID).value = data['status'];
        $(self.editProductionID).value = data['production_date'];
        $(self.editTerminationID).value = data['termination_date'];
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
            $(self.editStatusID).value = 'ACTIVE';
            $(self.editProductionID).value = '0000-00-00';
            $(self.editTerminationID).value = '0000-00-00';
        });
    }
}

var ProjectsSite = {
    mainObj         : null,
    createObj       : null,
    editObj         : null,
    viewObj         : null,

    init: function()
    {
        var self = this;
        self.initObj();
    },

    initObj: function()
    {
        var self = this;

        if (self.mainObj == null)
        {
            self.mainObj = new ProjectsList();
        }
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

        if (self.editObj == null)
        {
            self.editObj = new ProjectsEdit(data);
        }
        self.editObj.init();
    },

    initView: function(data)
    {
        var self = this;

        if (self.viewOjb == null)
        {
            self.viewObj = new ProjectsView(data);
        }
        self.viewObj.init();
    }
}

window.addEvent('domready', function()
{
    ProjectsSite.init();
});
