Request.filler = function(pUrl, pOptions) {
    var options = {
        parameters:null,
        method:'get',
        selectorsPath:'content',
        classToRemove:null,
    };
    for(let i in options){
        if(pOptions.hasOwnProperty(i)&&options.hasOwnProperty(i)){
            options[i] = pOptions[i];
        }
    }
    let req = new Request(pUrl, options.parameters, options.method);
    req.onComplete((e)=>{
        let p = options.selectorsPath.split('.');
        let c = e.currentTarget.responseJSON;
        for(let j = 0, maxj = p.length; j<maxj; j++){
            if(!c.hasOwnProperty(p[j])){
                console.warn("Request.filler : no path for '"+p[j]+"'");
                return;
            }
            c = c[p[j]];
        }
        for(let i in c){
            if(!c.hasOwnProperty(i)){
                continue;
            }
            if(!document.querySelector(i)){
                let toCreate = [];
                let parts = i.split(' ');
                toCreate.unshift(parts.pop());
                while(parts.length>0 && !document.querySelector(parts.join(' '))){
                    toCreate.unshift(parts.pop());
                }
                if(parts.length===0){
                    continue;
                }
                for(let j = 0, maxj = toCreate.length; j<maxj; j++){
                    let selector = toCreate[j];
                    let infos = selector.split('.');
                    let element = document.createElement(infos.shift());
                    element.className = infos.join(' ');
                    document.querySelector(parts.join(' ')).appendChild(element);
                    parts.push(selector);
                }
            }
            document.querySelector(i).innerHTML = c[i];
            if(options.classToRemove){
                document.querySelector(i).classList.remove(options.classToRemove);
            }
        }
    });
    return req;
};