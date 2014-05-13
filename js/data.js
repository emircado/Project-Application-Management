var LDAPData = function()
{
    var self = this;
    self.getDataURL = baseURL + '/pointpersons/getldapdata';
    self._request = null;

    self.ldapData = new Hash();

    self.init = function()
    {
        self.getAjaxData();
    }

    self.getAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'onSuccess': function(response)
                {
                    self.ldapData = new Hash(response);
                    self.ldapData.each(function(val, idx)
                    {
                        self.ldapData.set(idx, new Hash(val));
                    });
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                }
            }).send();
        }
    }
}

var ApplicationTypesData = function()
{
    var self = this;
    self.getDataURL = baseURL + '/applicationtypes/list';
    self._request = null;

    self.appTypes = new Hash();

    self.init = function()
    {
        self.getAjaxData();
    }

    self.getAjaxData = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            self._request = new Request.JSON({
                'url' : self.getDataURL,
                'method' : 'get',
                'onSuccess': function(response)
                {
                    self.appTypes = new Hash(response);
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                }
            }).send();
        }
    }
}