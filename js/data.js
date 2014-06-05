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

    self.textID = containerID+'-text';
    self.buttonID    = containerID+'-button';

    self.moreSeen = false;

    self.textHTML = '<div class="value" id="'+self.textID+'"></div>';
    self.buttonHTML    = '<a href="#" id="'+self.buttonID+'"></a>';

    self.renderData = function()
    {
        $(containerID).set('html', self.textHTML+self.buttonHTML);
        $(self.textID).addClass('collapsible');

        self.moreSeen = false;
        $(self.textID).set('html', '<pre>'+text);

        //if overflow
        if ($(self.textID).scrollHeight > $(self.textID).clientHeight) {
            $(self.buttonID).set('html', 'Read more');
        //if not
        } else {
            $(self.buttonID).set('html', '');    
        }

        self.addEvents();
    }

    self.addEvents = function()
    {
        $(self.buttonID).removeEvents();
        $(self.buttonID).addEvent('click', function(e)
        {
            e.preventDefault();
            if (self.moreSeen) {
                $(self.textID).removeClass('expand');
                $(self.buttonID).set('html', 'Read more');
                self.moreSeen = false;
            } else {
                $(self.textID).addClass('expand');
                $(self.buttonID).set('html', 'Read less');
                self.moreSeen = true;
            }
        });
    }
}