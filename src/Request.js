function Request(pTarget, pParams, pMethod)
{
    this.removeAllEventListener();
    pMethod = (pMethod||"get").toUpperCase();
    this.xhr_object = null;
    if (window.XMLHttpRequest)
        this.xhr_object = new XMLHttpRequest();
    else if (window.ActiveXObject)
    {
        var t = ['Msxml2.XMLHTTP','Microsoft.XMLHTTP'],i = 0;
        while(!this.xhr_object&&t[i++])
            try {this.xhr_object = new ActiveXObject(t[i]);}catch(e){}
    }
    if(!this.xhr_object)
        return;
    var ref = this, v = "", j = 0;
    for(i in pParams)
        v += (j++>0?"&":"")+i+"="+pParams[i];
    this.xhr_object.open(pMethod, pTarget, true);
    this.xhr_object.onprogress = this.dispatchEvent.proxy(this);
    this.xhr_object.onreadystatechange=function()
    {
        if(ref.xhr_object.readyState==4)
        {
            var ct = ref.xhr_object.getResponseHeader("Content-type");
            if(ct && ct.indexOf("json")>-1)
                ref.xhr_object.responseJSON = JSON.parse(ref.xhr_object.responseText);
            switch(ref.xhr_object.status)
            {
                case 200:
                case 201:
                case 304:
                    ref.dispatchEvent(new RequestEvent(Event.COMPLETE, ref.xhr_object.responseText, ref.xhr_object.responseJSON));
                    break;
                case 400:
                case 401:
                case 402:
                case 403:
                case 404:
                case 405:
                case 500:
                case 503:
                    ref.dispatchEvent(new RequestEvent(RequestEvent.ERROR, ref.xhr_object.responseText, ref.xhr_object.responseJSON));
                    break;
            }
        }
    };
    this.xhr_object.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset:'+Request.CHARSET);
    this.xhr_object.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    try
    {
        this.xhr_object.send(v);
    }
    catch(e)
    {
        console.log(e);
    }
}
Class.define(Request, [EventDispatcher],
{
    onComplete:function(pFunction)
    {
        this.addEventListener(Event.COMPLETE, pFunction, false);
        return this;
    },
    onProgress:function(pFunction)
    {
        this.addEventListener(RequestEvent.PROGRESS, pFunction, false);
        return this;
    },
    onError:function(pFunction)
    {
        this.addEventListener(RequestEvent.ERROR, pFunction, false);
        return this;
    },
    cancel:function()
    {
        this.dispatchEvent(new RequestEvent(RequestEvent.CANCEL));
        this.xhr_object.abort();
    }
});
Request.CHARSET = "UTF-8";
Request.load = function (pUrl, pParams, pMethod){return new Request(pUrl, pParams, pMethod);};
Request.update = function(pId, pUrl, pParams){return Request.load(pUrl, pParams).onComplete(function(pResponse){document.getElementById(pId).innerHTML = pResponse.responseText;});};

function RequestEvent(pType, pResponseText, pResponseJSON, pBubble)
{
    this.super("constructor", pType, pBubble);
    this.responseText = pResponseText||"";
    this.responseJSON = pResponseJSON||{};
}

Class.define(RequestEvent, [Event], {});
RequestEvent.ERROR = "error";
RequestEvent.CANCEL = "cancel";
RequestEvent.PROGRESS = "progress";