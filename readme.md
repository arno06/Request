Request
===========

Dependencies
------------
* Class
* EventDispatcher
* Event

Example
------------
```
function completeHandler(pRequest)
{
  console.log('completeHandler', pRequest);
}
var url = "http://domain/myUrl/";
var params = {};
var method = 'get';//or post
var req = new Request(url, params, method);
req.addEventListener(Event.COMPLETE, completeHandler, false);
```
