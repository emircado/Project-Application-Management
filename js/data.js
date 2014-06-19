var ProjectsData = {
    getDataURL  : baseURL + '/projects/list',
    _request    : null,

    getAjaxData: function(params, onRetrieve, onFail)
    {
        var self = this;
        if(!self._request || !self._request.isRunning())
        {
            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
                'onSuccess' : function(data)
                {
                    if (params['project_id'] != null) {
                        if (data.totalData == 0) {
                            console.log('data not available');
                            onFail();
                        } else {
                            console.log('displaying individual');
                            onRetrieve(data.resultData[0]);
                        }
                    } else {
                        console.log('displaying list');
                        onRetrieve(data);
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
}

var AppMainData = {
    getDataURL  : baseURL + '/applications/list',
    _request    : null,

    getAjaxData: function(params, onRetrieve, onFail)
    {
        var self = this;
        if(!self._request || !self._request.isRunning())
        {
            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'get',
                'data' : params,
                'onSuccess' : function(data)
                {
                    onRetrieve(data);
                },
                'onError' : function(data)
                {
                    self._request.stop;
                    console.log('Something went wrong!');
                }
            }).send();
        }
    }
}

// contains group => members dictionary
var LDAPGroupsData = {
    getDataURL  : baseURL + '/ldap/getgroups',
    _request    : null,
    resultData  : null,

    init: function(csrf_token)
    {
        var self = this;
        self.getAjaxData(csrf_token)
    },

    getAjaxData: function(csrf_token)
    {
        var self = this;
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
                    self.resultData = new Hash(response);
                    self.resultData.each(function(val, idx)
                    {
                        self.resultData.set(idx, new Hash(val));
                    });
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                }
            }).send();
        }
    },

    get: function(key)
    {
        var self = this;
        return self.resultData.get(key);
    }
}


// contains username => displayname dictionary
var LDAPUsersData = {
    getDataURL  : baseURL + '/ldap/getusers',
    _request    : null,
    resultData  : null,

    init: function(csrf_token)
    {
        var self = this;
        self.getAjaxData(csrf_token)
    },

    getAjaxData: function(csrf_token)
    {
        var self = this;
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
                    self.resultData = new Hash(response);
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                },
            }).send();
        }
    },

    get: function(key)
    {
        var self = this;
        return self.resultData.get(key);
    }
}

var AppTypesData = {
    getDataURL  : baseURL + '/applicationtypes/list',
    _request    : null,
    resultData  : null,

    init: function(csrf_token)
    {
        var self = this;
        self.getAjaxData(csrf_token)
    },

    getAjaxData: function(csrf_token)
    {
        var self = this;
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
                    self.resultData = new Hash(response);
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                }
            }).send();
        }
    },

    get: function(key)
    {
        var self = this;
        return self.resultData.get(key);
    }
}

var AppServersData = {
    getDataURL  : baseURL + '/servers/data',
    _request    : null,
    resultData  : null,

    init: function(csrf_token)
    {
        var self = this;
        self.getAjaxData(csrf_token)
    },

    getAjaxData: function(csrf_token)
    {
        var self = this;
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
                    self.resultData = new Hash(response);
                },
                'onError' : function(errors)
                {
                    self._request.stop;
                    console.log('something went wrong');
                }
            }).send();
        }
    },

    get: function(key)
    {
        var self = this;
        return self.resultData.get(key);
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

    self.textHTML = '<div class="value" id="'+self.textID+'"></div>';
    self.buttonHTML    = '<a href="#" id="'+self.buttonID+'" class="small-text"></a>';

    self.renderData = function()
    {
        $(containerID).set('html', self.textHTML+self.buttonHTML);
        $(self.textID).addClass('collapsible');

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
            if ($(self.textID).hasClass('expand')) {
                $(self.textID).removeClass('expand');
                $(self.buttonID).set('html', 'Read more');
            } else {
                $(self.textID).addClass('expand');
                $(self.buttonID).set('html', 'Read less');
            }
        });
    }
}