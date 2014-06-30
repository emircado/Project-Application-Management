var UsersList = function()
{
    var self = this;
    self._request           = null;
    self.postDataURL        = baseURL + '/ldap/sync';

    self.syncButton         = 'users-sync-button';
    self.fieldUpdated       = 'users-updated';
    self.groupContainers    = 'users-lists-container';
    self.csrfID             = 'users-csrf', 

    self.init = function()
    {
        self.addEvents();
    }

    self.postAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            var params = {
                'YII_CSRF_TOKEN'    : $(self.csrfID).value,
            };

            self._request = new Request.JSON(
            {
                'url' : self.postDataURL,
                'method' : 'post',
                'data' : params,
                'onSuccess': function(response)
                {
                    if (response['type'] == 'error') {
                        console.log('something went wrong');
                    }
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong.');
                }
            }).send();
        }
    }

    self.addEvents = function()
    {
        $(self.syncButton).removeEvents();
        $(self.syncButton).addEvent('click', function(e){
            e.preventDefault();
            self.postAjaxData();
        });
    }
}

var UsersSite = {
    mainObj : new UsersList(),

    init: function()
    {
        var self = this;
        self.mainObj.init();
    }
}

window.addEvent('domready', function()
{
    UsersSite.init();
});