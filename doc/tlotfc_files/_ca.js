(function () {
    function error(message, e) {
        if (typeof(_ca_enable_error_logs) != 'undefined' && _ca_enable_error_logs) {
            if (typeof(console) != 'undefined' && typeof(console.log) == 'function') {
                console.log("CA: " + message, e);
            }
        }
    }

    function getNdlNdrObject() {
        var ndl = "", ndr = "", result = {};
        try {
            if (typeof(_ca_ndl) != 'undefined' && _ca_ndl) {
                ndl = _ca_ndl;
            } else {
                ndl = encodeURIComponent(document.location.toString().substr(0, 1000));
            }
            if (typeof(_ca_ndr) != 'undefined' && _ca_ndr) {
                ndr = _ca_ndr;
            } else {
                ndr = encodeURIComponent(document.referrer.toString().substr(0, 1000));
            }
        } catch (e) {
            error("URL set error", e);
        }
        if (ndl) result.ndl = ndl;
        if (ndr) result.ndr = ndr;
        return result;
    }

    function getNdlNdrParams() {
        var ndlNdrObject = getNdlNdrObject();
        var result = "";
        if (ndlNdrObject.ndl) result += "&ndl=" + ndlNdrObject.ndl;
        if (ndlNdrObject.ndr) result += "&ndr=" + ndlNdrObject.ndr;
        return result;
    }

    try {
        if (typeof(_ca_id) == 'undefined') {
            error("Tag installation problem: no _ca_id");
            return;
        }
        var params = '';
        if (typeof(_ca_params) != 'undefined')
            for (p in _ca_params) {
                if (_ca_params.hasOwnProperty(p)) params = params + '&' + p + '=' + encodeURIComponent(_ca_params[p]);
            }
        var protocol = (document.location.protocol != "https:" ? "http://" : "https://");
        var ca_url = protocol + "p.raasnet.com/partners/universal/in?pid=" + _ca_id + getNdlNdrParams() + "&t=s&ts=" + new Date().getTime() + params;
        var iframe = document.createElement("iframe");
        iframe.src = "javascript:false";
        (iframe.frameElement || iframe).style.cssText = "width: 0; height: 0; border: 0; display: none;";
        iframe.frameborder = 0;
        var scripts = document.getElementsByTagName('script');
        var fdoc = scripts[scripts.length - 1].parentNode.appendChild(iframe).contentWindow.document;
        fdoc.open().c = function () {
            var s = this.createElement("script");
            s.async = true;
            s.src = ca_url;
            this.getElementsByTagName("head")[0].appendChild(s);
        };
        fdoc.write("<body onload=document.c();>");
        fdoc.close();
    } catch (e) {
        error("Unexpected error", e);
    }
})();