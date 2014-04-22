var ProjectsList = function()
{
    var self = this;
    
    self.getDataURL = baseURL + '/projects/list';
    
    //for data gathering
    self.tableContainerID 		= 'data-result';
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


    //events
    // self.CreateUserID     = 'create-user';
    self.backToMainId       = 'back-to-view';

    //parts of the table
    self.checkBoxClass    = 'data-checkbox';
    
    // self.overlayID          = 'overlay';
    // self.dialogWrapperID    = 'dialog-wrapper';
    // self.createUserModalID  = 'create-user-modal';

    //view for modals
    self.projectModalId        = 'projects-modal';

    //for view part
    self.projectListId = 'project-lists';
    self.editProjectViewId = 'edit-project-view';
    
    self.editId = 'a[id^=edit_]';
    self.viewId = 'a[id^=view_]';
    
    self.init = function()
    {
        $$('.'+self.checkBoxClass).dispose();
        
        self.getAjaxData(
            self.currentPage,
            //callbacks array
            [
                self.renderData,
                self.addEvents
            ]
        );
    }
    
    self.getAjaxData = function(page, callbacks)
    {
        if(!self._request || !self._request.isRunning())
        {
            //check pagination
            callbacks.push(self.paginationChecker);
            
            var params = {
                'page'      : page,
                'name'      : '',
                'username'  : '',
                'user_level'    : '',
                'email'         : '',
                'msisdn'        : '',
                'status'        : ''
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
                        
                        self.renderData(self.resultData);
                    }
                    else
                       $$('#' + self.totalDataID).set('html', '');

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

        // //below will be the calcutaion and displaying for the total data results
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
    
    self.renderData = function(data)
    {
        // $(self.tableContainerID).set('html', '');
        Array.each(data, function(val, idx)
        {
            contentHTML = '<td>'+val['name']+'</td>'
                        + '<td>'+val['code']+'</td>'                        
                        + '<td>'+val['description']+'</td>'
                        + '<td>'+val['status']+'</td>'
                        + '<td>'+val['production_date']+'</td>'
                        + '<td class="actions-col three-column">'
                        + '<a id="view_' + val['project_id'] + '" href="#" title="View Project"><span class="">View</span></a>&nbsp'
                        + '<a id="edit_' + val['project_id'] + '" href="#" title="Edit Project"><span class="">Edit</span></a>&nbsp'
                        + '</td>';

            contentElem = new Element('<tr />',
            {
                'class' : self.checkBoxClass,
                'html' : contentHTML
            });
            
            contentElem.inject($(self.tableContainerID), 'bottom');
        });
    };

    self.addEvents = function()
    {   
    //     window.removeEvents();
    //     window.addEvent('keyup', function(e)
    //     {
    //         if(e.key == 'esc')
    //             self.closeModal();
    //     });
        
    //     $$('#'+self.userModalCloseID, '#'+self.buttonCancelID).removeEvents();
    //     $$('#'+self.userModalCloseID, '#'+self.buttonCancelID).addEvent('click', function(e)
    //     {
    //         e.preventDefault();
            
    //         self.closeModal();
    //     });
        
        //list of events
        $(self.nextID).removeEvents();
        $(self.nextID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != self.totalPage) {
                self.currentPage++;
                self.init();
            }
        });
        
        $(self.prevID).removeEvents();
        $(self.prevID).addEvent('click', function(e)
        {
            e.preventDefault();
            
            if (self.currentPage != 1) {
                self.currentPage--;
                self.init();
            }
        });
        
        $$(self.editId).removeEvents();
        $$(self.editId).addEvent('click', function(e)
        {
            e.preventDefault();
            
            id = $(this).get('id').split('_')[1];
            $(self.projectListId).setStyle('display', 'none');
            $(self.editProjectViewId).setStyle('display', 'block');

        });

        $$(self.viewID).removeEvents();
        $$(self.viewId).addEvent('click',function(e)
        {
            e.preventDefault();

            console.log($(self.projectModalId));//.setStyle('display','block');
        });

        $(self.backToMainId).removeEvents();
        $(self.backToMainId).addEvent('click', function(e)
        {
            e.preventDefault();

            $(self.projectListId).setStyle('display', 'block');
            $(self.editProjectViewId).setStyle('display', 'none');
            // clear search input
        });
    };
    
    // self.closeModal = function()
    // {
    //         $(self.overlayID).setStyle('display','none');
    //         $(self.dialogWrapperID).setStyle('display','none');
    //         $(self.createUserModalID).setStyle('display', 'none');
    // };
    
};

window.addEvent('domready', function()
{
    var projectsList = new ProjectsList();
	projectsList.init();
});
