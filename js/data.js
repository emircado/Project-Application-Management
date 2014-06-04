// contains group => members dictionary
var LDAPGroupsData = function(csrf_token)
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
            var params = {
                'YII_CSRF_TOKEN'    : csrf_token,
            };

            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
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
var LDAPUsersData = function(csrf_token)
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
            var params = {
                'YII_CSRF_TOKEN'    : csrf_token,
            };

            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
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

var AppTypesData = function(csrf_token)
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
            var params = {
                'YII_CSRF_TOKEN'    : csrf_token,
            };

            self._request = new Request.JSON({
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
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

var AppServersData = function(csrf_token)
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
            var params = {
                'YII_CSRF_TOKEN'    : csrf_token,
            };

            self._request = new Request.JSON({
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
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

var DateFormatter = {
    dateFormat:     "%b %e, %Y",
    datetimeFormat: "%b %e, %Y %l:%M%p",

    formatDate: function(date_str)
    {
        var self = this;
        var date = new Date(date_str.replace(/-/g,'/'));
        return date.formatter(self.dateFormat);
    },

    formatDateTime: function(date_str)
    {
        var self = this;
        var date = new Date(date_str.replace(/-/g,'/'));

        return date.formatter(self.datetimeFormat);
    }
}

var ReadMore = function(containerID, text) {
    var self = this;

    self.fieldTextID = containerID+'-text';
    self.fieldMoreID = containerID+'-more';
    self.buttonID    = containerID+'-button';

    self.moreSeen = false;

    self.fieldTextHTML = '<span class="value" id="'+self.fieldTextID+'"></span>';
    self.fieldMoreHTML = '<span class="value" id="'+self.fieldMoreID+'"></span>';
    self.buttonHTML    = '<a href="#" id="'+self.buttonID+'"></a>';

    self.renderData = function()
    {
        $(containerID).set('html', self.fieldTextHTML+self.fieldMoreHTML+self.buttonHTML);

        var text_cut = '<pre>';
        var text_more = '';

        // if description needs to be cut
        if (text.length > 20) {
            text_cut += text.substr(0, 20);
            text_more = '<pre>'+text.substr(20, text.length);
            $(self.buttonID).set('html', 'Read more');
        } else {
            text_cut += text;
            $(self.buttonID).set('html', '');    
        }
        $(self.fieldMoreID).setStyle('display', 'none');
        self.moreSeen = false;

        $(self.fieldTextID).set('html', text_cut);
        $(self.fieldMoreID).set('html', text_more);

        self.addEvents();
    }

    self.addEvents = function()
    {
        $(self.buttonID).removeEvents();
        $(self.buttonID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (self.moreSeen) {
                $(self.fieldMoreID).setStyle('display', 'none');
                $(self.buttonID).set('html', 'Read more');
                self.moreSeen = false;
            } else {
                $(self.fieldMoreID).setStyle('display', 'block');
                $(self.buttonID).set('html', 'Read less');
                self.moreSeen = true;
            }
        });
    }
}