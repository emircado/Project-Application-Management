var RequestList = function()
{
    var self = this;
    
    self.getDataURL = baseURL + 'requests/get_list';
    
    self.init = function()
    {
        if(!self._request || !self._request.isRunning())
        {
            self._request = new Request.JSON(
            {
                'url' : self.getDataURL,
                'method' : 'post',
                'data' : 'page=' +1,
                'onSuccess' : function(data)
                {
                    console.log(data);
                },
                'onError' : function(data)
                {
                    console.log('Something went wrong!');
                }
            });
        }
    }
};
window.addEvent('domready', function()
{
    var requestList = new RequestList();
	requestList.init();
});
