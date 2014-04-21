var ProjectsList = function()
{
    var self = this;
    
    self.getDataURL = baseURL + '/index.php/projects/indexdata';
    
    //for data gathering
    self.tableContainerID 		= 'projects-list';
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

    //parts of the table
    self.checkBoxClass    = 'data-checkbox';
    
    // self.overlayID          = 'overlay';
    // self.dialogWrapperID    = 'dialog-wrapper';
    // self.createUserModalID  = 'create-user-modal';
    
    // self.userModalCloseID   = 'close-modal';
    // self.buttonCancelID     = 'button-cancel-modal';
    // self.buttonCreateUserID = 'button-create-user';
    
    //details for creating users
    // self.modalUserNameID        = 'modal-username';
    // self.modalNameID            = 'modal-name';
    // self.modalUserRoleID        = 'user-role';
    // self.modalUserEmailID       = 'modal-email';
    // self.modalUserMobileID      = 'modal-mobile';
    // self.modalUserPasswordID    = 'modal-password';
    // self.modalUserRePasswordID  = 'modal-re-password';
    
    //required fields
    // self.requiredFields = {
    //     'modal-username' : 'modal-username-error'
    // };
    
    //for view part
    // self.userListId = 'user-lists';
    // self.editViewId = 'edit-view';
    
    // self.editId = 'a[id^=edit_]';
    
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
                // 'fields'    : ['name', 'code', 'description', 'status', 'production_date']

                'page'      : page,
                // 'name'      : '',
                // 'username'  : '',
                // 'user_level'    : '',
                // 'email'         : '',
                // 'msisdn'        : '',
                // 'status'        : ''
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
            // var contentHTML = '<td class="checkbox-col"><input id="checkbox_'+ val['user_id'] +'" class="id-checkbox" type="checkbox"></td>'
            //                 + '<td>' + val['name'] + '</td>'
            //                 + '<td>' + val['username'] + '</td>'
            //                 + '<td>' + val['user_level'] + '</td>'
            //                 + '<td>' + val['email'] + '</td>'
            //                 + '<td>' + val['msisdn'] + '</td>'
            //                 + '<td>' + val['status'] + '</td>'
            //                 + '<td class="actions-col three-column">'
            //                 + '<a id="edit_' + val['user_id'] + '" href="#" title="Edit User"><span class="">Edit</span></a>&nbsp'
            //                 + '</td>';
            
            // contentHTML = '';
            // Hash.each(val, function(value, field){
            //     contentHTML = contentHTML+'<td>'+value+'</td>';
            // });

            contentHTML = '<td>'+val['name']+'</td>'
                        + '<td>'+val['code']+'</td>'                        
                        + '<td>'+val['description']+'</td>'
                        + '<td>'+val['status']+'</td>'
                        + '<td>'+val['production_date']+'</td>'
                        + '<td class="actions-col three-column">'
                        + '<a id="view_' + val['user_id'] + '" href="#" title="View Project"><span class="">View</span></a>&nbsp'
                        + '<a id="edit_' + val['user_id'] + '" href="#" title="Edit Project"><span class="">Edit</span></a>&nbsp'
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
        
    //     $(self.CreateUserID).removeEvents();
    //     $(self.CreateUserID).addEvent('click', function(e)
    //     {
    //         e.preventDefault();
            
    //         $(self.overlayID).setStyle('display','block');
    //         $(self.dialogWrapperID).setStyle('display','block');
    //         $(self.createUserModalID).setStyle('display', 'block');
    //     });
        
    //     $(self.buttonCreateUserID).removeEvents();
    //     $(self.buttonCreateUserID).addEvent('click', function(e)
    //     {
    //         e.preventDefault();
            
    //         if(!Utils.showRequiredFieldErrors(UsersList, Utils.checkForm(self.requiredFields)))
    //             return false;
    //     });
        
    //     $$(self.editId).removeEvents();
    //     $$(self.editId).addEvent('click', function(e)
    //     {
    //         e.preventDefault();
            
    //         $(self.userListId).setStyle('display','none');
    //         console.log('here');
    //     });
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
