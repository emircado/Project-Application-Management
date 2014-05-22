// contains group => members dictionary
var LDAPGroupsData = function()
{
    var self = this;
    self.getDataURL = baseURL + '/ldap/getgroups';
    self._request = null;

    self.ldapGroupsData = new Hash();

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
                    self.ldapGroupsData = new Hash(response);
                    self.ldapGroupsData.each(function(val, idx)
                    {
                        self.ldapGroupsData.set(idx, new Hash(val));
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

// contains username => displayname dictionary
var LDAPUsersData = function()
{
    var self = this;
    self.getDataURL = baseURL + '/ldap/getusers';
    self._request = null;

    self.ldapUsersData = new Hash();

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
                    self.ldapUsersData = new Hash(response);
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

var AppTypesData = function()
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

var AppServersData = function()
{
    var self = this;
    self.getDataURL = baseURL + '/servers/data';
    self._request = null;

    self.appServers = null;

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
                    self.appServers = new Hash(response);
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