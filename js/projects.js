var ProjectsList = function()
{
    var self = this;
    
    self.getDataURL = baseURL + '/projects/list';
    self.postDataURL = baseURL + '/projects/update';
    
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
    self.searchClearID    = 'a[id^=clear-search]';
    self.searchParams     = {
        'project_id': '',
        'name'      : '',
        'code'      : '',
        'status'    : ''
    };
    
    //actions
    self.createButtonID = 'create-project';
    self.editID = 'a[id^=edit_]';
    self.viewID = 'a[id^=view_]';
    
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

    //for create project

    self.init = function()
    {
        $$('.'+self.tableRowClass).dispose();
        
        self.getAjaxData(
            self.currentPage,
            //callbacks array
            [
                // self.renderData,
                self.addEvents
            ]
        );
    }
    
    self.getAjaxData = function(page, callbacks)
    {
    	if(!self._request || !self._request.isRunning())
        {
            var params = {
                'page'      : page,
                'project_id': self.searchParams['project_id'],
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
                    //FOR THE TABLE
                    if (data.view == 'table')
                    {
                        //check pagination
                        callbacks.push(self.paginationChecker);

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
                    }
                    //FOR INDIVIDUAL
                    else
                    {
                        self.resultData = data.resultData[0];
                        self.renderData(self.resultData, data.view);
                    }

                    if(callbacks)
                    {
                        Array.each(callbacks, function(callback)
                        {
                            callback();
                        });
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

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'project_id'		: '',
                'name'				: $(self.editNameID).value,
                'code'      		: $(self.editCodeID).value,
                'description'		: $(self.editDescriptionID).value, 
                'status'    		: $(self.editStatusID).value,
                'production_date'	: $(self.editProductionID).value,
                'termination_date'	: $(self.editTerminationID).value
            };

            if (self.searchParams['project_id'] != '')
            {
            	params['project_id'] = parseInt(self.searchParams['project_id'].split('_')[1]);
            }

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'get',
                'data' : params,
                'onSuccess' : function(data)
                {
                	console.log('success');
                },
                'onError' : function(data)
                {
                    self._request.stop;
                    console.log('Something went wrong!');
                },
                'onComplete': function(data)
                {
                	$(self.editCancelButtonID).click();
                }
            }).send();
        }
    };

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
        if (view == 'table')
        {
            // console.log('in table');
            Array.each(data, function(val, idx)
            {
                contentHTML = '<td>'+val['name']+'</td>'
                            + '<td>'+val['code']+'</td>'                        
                            + '<td>'+val['description']+'</td>'
                            + '<td>'+val['status']+'</td>'
                            + '<td>'+val['production_date']+'</td>'
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
        }
        else if (view == 'edit')
        {
            $(self.editNameID).value = data['name'];
            $(self.editCodeID).value = data['code'];
            $(self.editDescriptionID).value = data['description'];
            $(self.editStatusID).value = data['status'];
            $(self.editProductionID).value = data['production_date'];
            $(self.editTerminationID).value = data['termination_date'];
        }
        else if (view == 'view')
        {
            contentHTML = '<a id="edit_' + data['project_id'] + '" href="#" title="Edit Project"><span class="">[Edit]</span></a>&nbsp';

            $(self.viewContentID).set('html', contentHTML);

            $(self.viewNameID).set('html', data['name']);
            $(self.viewCodeID).set('html', data['code']);
            $(self.viewDescriptionID).set('html', data['description']);
            $(self.viewStatusID).set('html', data['status']);
            $(self.viewProductionID).set('html', data['production_date']);
            $(self.viewTerminationID).set('html', data['termination_date']);
            $(self.viewCreatedID).set('html', data['date_created']);
            $(self.viewUpdatedID).set('html', data['date_updated']);
        }
    };

    self.clearSearch = function()
    {
        self.currentPage = 1;
        self.searchParams['project_id'] = '';
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
            self.searchParams['name'] = $(self.searchNameID).value;
            self.searchParams['code'] = $(self.searchCodeID).value;
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

        //EVENT FOR EDITING A PROJECT
        $$(self.editID).removeEvents();
        $$(self.editID).addEvent('click', function(e)
        {
            e.preventDefault();            
            self.clearSearch();
            self.searchParams['project_id'] = 'edit_'+$(this).get('id').split('_')[1];

            $(self.viewProjectViewID).setStyle('display', 'none');
            $(self.editProjectViewID).setStyle('display', 'block');
            self.init();
        });

        //EVENT FOR VIEWING A PROJECT
        $$(self.viewID).removeEvents();
        $$(self.viewID).addEvent('click',function(e)
        {
            e.preventDefault();
            self.clearSearch();
            self.searchParams['project_id'] = 'view_'+$(this).get('id').split('_')[1];

            $(self.projectListID).setStyle('display', 'none');
            $(self.viewProjectViewID).setStyle('display', 'block');
            self.init();
        });

        //EVENT FOR GOING BACK TO MAIN FROM VIEW
        $(self.viewToMainID).removeEvents();
        $(self.viewToMainID).addEvent('click', function(e)
        {
            e.preventDefault();
            self.clearSearch();

            $(self.viewProjectViewID).setStyle('display', 'none');
            $(self.projectListID).setStyle('display', 'block');
            self.init();
        });

        //EVENT FOR SAVING CHANGES BUTTON IN EDIT/CREATE PROJECT
        $(self.editSaveButtonID).removeEvents();
        $(self.editSaveButtonID).addEvent('click', function(e)
        {
            e.preventDefault();

            self.postAjaxData();
        });

        //EVENT FOR CANCEL BUTTON IN EDIT/CREATE PROJECT
        $(self.editCancelButtonID).removeEvents();
        $(self.editCancelButtonID).addEvent('click', function(e)
        {
            e.preventDefault();

            //if create
            if (self.searchParams['project_id'] == '') {
            	self.clearSearch();
            	$(self.editProjectViewID).setStyle('display', 'none');
            	$(self.projectListID).setStyle('display', 'block');
            	self.init();

            //if edit
            } else {
	            var id = self.searchParams['project_id'].split('_')[1];
	            self.clearSearch();
	            self.searchParams['project_id'] = 'view_'+id;

	            $(self.editProjectViewID).setStyle('display', 'none');
	            $(self.viewProjectViewID).setStyle('display', 'block');
	            self.init();
            }

            //clear form
            $(self.editNameID).value = '';
            $(self.editCodeID).value = '';
            $(self.editDescriptionID).value = '';
            $(self.editStatusID).value = 'ACTIVE';
            $(self.editProductionID).value = '0000-00-00';
            $(self.editTerminationID).value = '0000-00-00';
        });

        //EVENT FOR CREATING A NEW PROJECT
        $(self.createButtonID).removeEvents();
        $(self.createButtonID).addEvent('click', function(e)
        {
            e.preventDefault();

            $(self.projectListID).setStyle('display', 'none');
            $(self.editProjectViewID).setStyle('display', 'block');
        });
    };
    
};

window.addEvent('domready', function()
{
    var projectsList = new ProjectsList();
    projectsList.init();
});
