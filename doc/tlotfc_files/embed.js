var DISQUS=function(a){"use strict";var b=a.DISQUS||{},c=[];return b.define=function(d,e){"function"==typeof d&&(e=d,d="");for(var f=d.split("."),g=f.shift(),h=b,i=(e||function(){return{}}).call({overwrites:function(a){return a.__overwrites__=!0,a}},a);g;)h=h[g]?h[g]:h[g]={},g=f.shift();for(var j in i)i.hasOwnProperty(j)&&(!i.__overwrites__&&null!==h[j]&&h.hasOwnProperty(j)&&b.logError&&b.logError("Unsafe attempt to redefine existing module: "+j),h[j]=i[j],c.push(function(a,b){return function(){delete a[b]}}(h,j)));return h},b.use=function(a){return b.define(a)},b.define("next"),b}(window);DISQUS.define(function(a,b){"use strict";var c=a.DISQUS,d=a.document,e=d.head||d.getElementsByTagName("head")[0]||d.body,f=0;c.getUid=function(a){var b=++f+"";return a?a+b:b},c.isOwn=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},c.isString=function(a){return"[object String]"===Object.prototype.toString.call(a)},c.each=function(a,b){var d=a.length,e=Array.prototype.forEach;if(isNaN(d))for(var f in a)c.isOwn(a,f)&&b(a[f],f,a);else if(e)e.call(a,b);else for(var g=0;d>g;g++)b(a[g],g,a)},c.extend=function(a){return c.each(Array.prototype.slice.call(arguments,1),function(b){for(var c in b)a[c]=b[c]}),a},c.serializeArgs=function(a){var d=[];return c.each(a,function(a,c){a!==b&&d.push(c+(null!==a?"="+encodeURIComponent(a):""))}),d.join("&")},c.serialize=function(a,b,d){if(b&&(a+=~a.indexOf("?")?"&"==a.charAt(a.length-1)?"":"&":"?",a+=c.serializeArgs(b)),d){var e={};return e[(new Date).getTime()]=null,c.serialize(a,e)}var f=a.length;return"&"==a.charAt(f-1)?a.slice(0,f-1):a};var g,h,i=2e4;"addEventListener"in a?(g=function(a,b,c){a.addEventListener(b,c,!1)},h=function(a,b,c){a.removeEventListener(b,c,!1)}):(g=function(a,b,c){a.attachEvent("on"+b,c)},h=function(a,b,c){a.detachEvent("on"+b,c)}),c.require=function(b,f,j,k,l){function m(b){b=b||a.event,b.target||(b.target=b.srcElement),("load"==b.type||/^(complete|loaded)$/.test(b.target.readyState))&&(k&&k(),p&&clearTimeout(p),h(b.target,o,m))}var n=d.createElement("script"),o=n.addEventListener?"load":"readystatechange",p=null;return n.src=c.serialize(b,f,j),n.async=!0,n.charset="UTF-8",(k||l)&&g(n,o,m),l&&(p=setTimeout(function(){l()},i)),e.appendChild(n),c}}),DISQUS.define(function(){"use strict";var a=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return!0;return!1},b={},c=function(c){var d=DISQUS.config&&DISQUS.config.switches;if(!d)return null;if(DISQUS.isOwn(b,c))return b[c];var e=b[c]=a(d,c);return e},d=function(){window.console&&c("next_logging")!==!1&&(window.console.log.apply?window.console.log.apply(window.console,arguments):window.console.log(Array.prototype.slice.call(arguments,0).join(" ")))};return{log:d,logError:d}}),DISQUS.define("Events",function(){"use strict";var a=function(a){var b,c=!1;return function(){return c?b:(c=!0,b=a.apply(this,arguments),a=null,b)}},b=DISQUS.isOwn,c=Object.keys||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[];for(var d in a)b(a,d)&&(c[c.length]=d);return c},d=[].slice,e={on:function(a,b,c){if(!g(this,"on",a,[b,c])||!b)return this;this._events=this._events||{};var d=this._events[a]||(this._events[a]=[]);return d.push({callback:b,context:c,ctx:c||this}),this},once:function(b,c,d){if(!g(this,"once",b,[c,d])||!c)return this;var e=this,f=a(function(){e.off(b,f),c.apply(this,arguments)});return f._callback=c,this.on(b,f,d)},off:function(a,b,d){var e,f,h,i,j,k,l,m;if(!this._events||!g(this,"off",a,[b,d]))return this;if(!a&&!b&&!d)return this._events={},this;for(i=a?[a]:c(this._events),j=0,k=i.length;k>j;j++)if(a=i[j],h=this._events[a]){if(this._events[a]=e=[],b||d)for(l=0,m=h.length;m>l;l++)f=h[l],(b&&b!==f.callback&&b!==f.callback._callback||d&&d!==f.context)&&e.push(f);e.length||delete this._events[a]}return this},trigger:function(a){if(!this._events)return this;var b=d.call(arguments,1);if(!g(this,"trigger",a,b))return this;var c=this._events[a],e=this._events.all;return c&&h(c,b),e&&h(e,arguments),this},stopListening:function(a,b,c){var d=this._listeners;if(!d)return this;var e=!b&&!c;"object"==typeof b&&(c=this),a&&((d={})[a._listenerId]=a);for(var f in d)d[f].off(b,c,this),e&&delete this._listeners[f];return this}},f=/\s+/,g=function(a,b,c,d){if(!c)return!0;if("object"==typeof c){for(var e in c)a[b].apply(a,[e,c[e]].concat(d));return!1}if(f.test(c)){for(var g=c.split(f),h=0,i=g.length;i>h;h++)a[b].apply(a,[g[h]].concat(d));return!1}return!0},h=function(a,b){var c,d=-1,e=a.length,f=b[0],g=b[1],h=b[2];switch(b.length){case 0:for(;++d<e;)(c=a[d]).callback.call(c.ctx);return;case 1:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f);return;case 2:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f,g);return;case 3:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f,g,h);return;default:for(;++d<e;)(c=a[d]).callback.apply(c.ctx,b)}},i={listenTo:"on",listenToOnce:"once"};return DISQUS.each(i,function(a,b){e[b]=function(b,c,d){var e=this._listeners||(this._listeners={}),f=b._listenerId||(b._listenerId=DISQUS.getUid("l"));return e[f]=b,"object"==typeof c&&(d=this),b[a](c,d,this),this}}),e.bind=e.on,e.unbind=e.off,e}),DISQUS.define(function(a){"use strict";function b(){throw Error(Array.prototype.join.call(arguments," "))}function c(a){return g.getElementById(a)||g.body||g.documentElement}function d(a,b,c){if(a.addEventListener)a.addEventListener(b,c,!1);else{if(!a.attachEvent)throw Error("No event support.");a.attachEvent("on"+b,c)}}function e(a,b,c){a.postMessage(b,c)}function f(a,b,c){c||(c=0);var d,e,f,g,h=0,i=function(){h=new Date,f=null,g=a.apply(d,e)};return function(){var j=new Date,k=b-(j-h);return d=this,e=arguments,0>=k?(clearTimeout(f),f=null,h=j,g=a.apply(d,e)):f||(f=setTimeout(i,k+c)),g}}var g=a.document,h="2",i={},j=DISQUS.use("JSON");if(!DISQUS.version||DISQUS.version()!==h){var k=DISQUS.isOwn;d(a,"message",function(a){var c;for(var d in i)if(k(i,d)&&a.origin==i[d].origin){c=!0;break}if(c){var e=j.parse(a.data),f=i[e.sender];switch(f||b("Message from our server but with invalid sender UID:",e.sender),e.scope){case"host":f.trigger(e.name,e.data);break;default:b("Message",e.scope,"not supported. Sender:",a.origin)}}},!1),d(a,"hashchange",function(){DISQUS.trigger("window.hashchange",{hash:a.location.hash})},!1),d(a,"resize",function(){DISQUS.trigger("window.resize")},!1);var l=function(){DISQUS.trigger("window.scroll")};d(a,"scroll",f(l,250,50)),d(g,"click",function(){DISQUS.trigger("window.click")});var m=function(a){a=a||{},this.state=m.INIT,this.uid=a.uid||DISQUS.getUid(),this.origin=a.origin,this.target=a.target,this.window=null,i[this.uid]=this,this.on("ready",function(){this.state=m.READY},this),this.on("die",function(){this.state=m.KILLED},this)};DISQUS.extend(m,{INIT:0,READY:1,KILLED:2}),DISQUS.extend(m.prototype,DISQUS.Events),m.prototype.sendMessage=function(a,b){var c=j.stringify({scope:"client",name:a,data:b}),d=function(a,b,c){return function(){DISQUS.postMessage(c.window,a,b)}}(c,this.origin,this);this.isReady()?d():this.on("ready",d)},m.prototype.hide=function(){},m.prototype.show=function(){},m.prototype.url=function(){return this.target+"#"+this.uid},m.prototype.destroy=function(){this.state=m.KILLED,this.off()},m.prototype.isReady=function(){return this.state===m.READY},m.prototype.isKilled=function(){return this.state===m.KILLED};var n=function(a){m.call(this,a),this.windowName=a.windowName};DISQUS.extend(n.prototype,m.prototype),n.prototype.load=function(){this.window=a.open("",this.windowName||"_blank"),this.window.location=this.url()},n.prototype.isKilled=function(){return m.prototype.isKilled()||this.window.closed};var o=function(a){m.call(this,a),this.styles=a.styles||{},this.role=a.role||"application",this.container=a.container,this.elem=null};DISQUS.extend(o.prototype,m.prototype),o.prototype.load=function(){var a=this.elem=g.createElement("iframe");a.setAttribute("id","dsq-"+this.uid),a.setAttribute("data-disqus-uid",this.uid),a.setAttribute("allowTransparency","true"),a.setAttribute("frameBorder","0"),this.role&&a.setAttribute("role",this.role),this.setInlineStyle(this.styles)},o.prototype.getOffset=function(a){a=a||g.documentElement;for(var b=this.elem,c=b,d=0,e=0;c&&c!==a;)d+=c.offsetLeft,e+=c.offsetTop,c=c.offsetParent;return{top:e,left:d,height:b.offsetHeight,width:b.offsetWidth}},o.prototype.setInlineStyle=function(a,b){var c={};DISQUS.isString(a)?c[a]=b:c=a;var d=this.elem.style;return"setProperty"in d?void DISQUS.each(c,function(a,b){d.setProperty(b,a,"important")}):this._setInlineStyleCompat(c)},o.prototype._setInlineStyleCompat=function(a){this._stylesCache=this._stylesCache||{},DISQUS.extend(this._stylesCache,a);var b=[];DISQUS.each(this._stylesCache,function(a,c){b.push(c+":"+a+" !important")}),this.elem.style.cssText=b.join(";")},o.prototype.removeInlineStyle=function(a){var b=this.elem.style;return"removeProperty"in b?void b.removeProperty(a):this._removeInlineStyleCompat(a)},o.prototype._removeInlineStyleCompat=function(a){this._stylesCache&&(delete this._stylesCache[a],this._setInlineStyleCompat({}))},o.prototype.hide=function(){this.setInlineStyle("display","none")},o.prototype.show=function(){this.removeInlineStyle("display")},o.prototype.destroy=function(){m.prototype.destroy.call(this),this.elem&&this.elem.parentNode&&this.elem.parentNode.removeChild(this.elem)};var p=function(a){var b=this;o.call(b,a),b.styles=DISQUS.extend({width:"100%",border:"none",overflow:"hidden",height:"0"},a.styles||{})};DISQUS.extend(p.prototype,o.prototype),p.prototype.load=function(a){var b=this;o.prototype.load.call(b);var e=b.elem;e.setAttribute("width","100%"),e.setAttribute("src",this.url()),d(e,"load",function(){b.window=e.contentWindow,a&&a()});var f=DISQUS.isString(this.container)?c(this.container):this.container;f.appendChild(e)};var q=function(a){o.call(this,a),this.contents=a.contents||"",this.styles=DISQUS.extend({width:"100%",border:"none",overflow:"hidden"},a.styles||{})};DISQUS.extend(q.prototype,o.prototype),q.prototype.load=function(){o.prototype.load.call(this);var a=this.elem;a.setAttribute("scrolling","no");var b=DISQUS.isString(this.container)?c(this.container):this.container;b.appendChild(a),this.window=a.contentWindow;try{this.window.document.open()}catch(d){a.src="javascript:var d=document.open();d.domain='"+g.domain+"';void(0);"}this.document=this.window.document,this.document.write(this.contents),this.document.close();var e,f=this.document.body;return f&&(e=f.offsetHeight+"px",this.setInlineStyle({height:e,minHeight:e,maxHeight:e})),this},q.prototype.show=function(){this.setInlineStyle("display","block")},q.prototype.click=function(a){var b=this,c=b.document.body;d(c,"click",function(c){a.call(b,c)})};var r=DISQUS.extend({},DISQUS.Events);return{version:function(){return h},on:r.on,off:r.off,trigger:r.trigger,throttle:f,addEvent:d,postMessage:e,WindowBase:m,Popup:n,Iframe:o,Channel:p,Sandbox:q}}}),DISQUS.define("JSON",function(a){"use strict";var b,c=new DISQUS.Sandbox({container:"disqus_thread",contents:"<!doctype html><html><head><script>window.JSON=JSON</script></head></html>",styles:{display:"none"}});try{b=c.load().window.JSON}catch(d){b=a.JSON}if(!b)throw Error("Cannot get JSON namespace from sandbox.");return{stringify:b.stringify,parse:b.parse}}),DISQUS.define("next.host.utils",function(a,b){"use strict";function c(a){if(!a||"embed.js"!==a.substring(a.length-8))return null;for(var b,c=[/(https?:)?\/\/(www\.)?disqus\.com\/forums\/([\w_\-]+)/i,/(https?:)?\/\/(www\.)?([\w_\-]+)\.disqus\.com/i,/(https?:)?\/\/(www\.)?dev\.disqus\.org\/forums\/([\w_\-]+)/i,/(https?:)?\/\/(www\.)?([\w_\-]+)\.dev\.disqus\.org/i],d=c.length,e=0;d>e;e++)if(b=a.match(c[e]),b&&b.length&&4===b.length)return b[3];return null}function d(a,b){var d,e,f,g=a.getElementsByTagName("script"),h=g.length;b=b||c;for(var i=h-1;i>=0;i--)if(d=g[i],e=d.getAttribute?d.getAttribute("src"):d.src,f=b(e),null!==f)return f.toLowerCase();return null}function e(a){return"https:"===a.toLowerCase()}function f(a,b){for(var c=0,d=Array(a.length),e=0;a.length>=e;e++){d[e]=Array(b.length);for(var f=0;b.length>=f;f++)d[e][f]=0}for(var g=0;a.length>g;g++)for(var h=0;b.length>h;h++)a[g]==b[h]&&(d[g+1][h+1]=d[g][h]+1,d[g+1][h+1]>c&&(c=d[g+1][h+1]));return c}function g(){for(var a=x.getElementsByTagName("h1"),c=x.title,d=c.length,e=c,g=.6,h=0;a.length>h;h++)!function(a){var h,i=a.textContent||a.innerText;null!==i&&i!==b&&(h=f(c,i)/d,h>g&&(g=h,e=i))}(a[h]);return e}function h(b,c,d){var e;return d=d||c,b===x?"":(a.getComputedStyle?e=x.defaultView.getComputedStyle(b,null).getPropertyValue(c):b.currentStyle&&(e=b.currentStyle[c]?b.currentStyle[c]:b.currentStyle[d]),"transparent"==e||""===e||"rgba(0, 0, 0, 0)"==e?h(b.parentNode,c,d):e||null)}function i(a){a.match("^rgb")&&(a=j(a).substr(1));var b=parseInt(a.substr(0,2),16),c=parseInt(a.substr(2,2),16),d=parseInt(a.substr(4,2),16),e=(299*b+587*c+114*d)/1e3;return e}function j(a){function b(a){return a=(+a).toString(16),1==a.length?"0"+a:a}if("#"===a.substr(0,1))return a;var c=/.*?rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(a);if(!c||4!==c.length)return"";var d=b(c[1]),e=b(c[2]),f=b(c[3]);return"#"+d+e+f}function k(a,b,c,d){DISQUS.isString(b)&&(b=x.createElement(b));var e=null;return b.style.visibility="hidden",a.appendChild(b),e=h(b,c,d),a.removeChild(b),e}function l(a){var b=x.createElement("a");return b.href=+new Date,k(a,b,"color")}function m(a){return a.toLowerCase().replace(/^\s+|\s+$/g,"").replace(/['"]/g,"")}function n(a){for(var b,c=k(a,"span","font-family","fontFamily"),d=c.split(","),e={courier:1,times:1,"times new roman":1,georgia:1,palatino:1,serif:1},f=0;d.length>f;f++)if(b=m(d[f]),e.hasOwnProperty(b))return!0;return!1}function o(a){return a.postMessage?a.JSON?0:"Microsoft Internet Explorer"===a.navigator.appName?2:1:1}function p(){var b=a.location.hash,c=b&&b.match(/(comment|reply)\-([0-9]+)/);return c&&c[2]}function q(a){var b=a.navigator.userAgent;return b.indexOf("Mobi")!==-1&&b.indexOf("iPad")===-1}function r(a){(new Image).src=DISQUS.serialize(w+"/stat.gif",{event:a})}function s(c,d,e){return a.getComputedStyle?x.defaultView.getComputedStyle(c,null).getPropertyValue(d):c.currentStyle?c.currentStyle[d]?c.currentStyle[d]:c.currentStyle[e]:b}function t(a,b){for(var c=0,d=a.length;d>c;c++)b^=b<<5,b^=a.charCodeAt(c);return b&~(1<<31)}function u(a,b){return t(a,87049)%100<b}function v(){for(var a=x.getElementsByTagName("meta"),b=0;a.length>b;b++)if("viewport"===a[b].getAttribute("name"))return!0;return!1}var w="//juggler.services.disqus.com",x=a.document;return{getShortnameFromUrl:c,getForum:d,isSSL:e,guessThreadTitle:g,getContrastYIQ:i,colorToHex:j,getElementStyle:k,getAnchorColor:l,normalizeFontValue:m,isSerif:n,getBrowserSupport:o,getPermalink:p,isMobile:q,logStat:r,getComputedStyle:s,djb2Hash:t,isInPercentile:u,isMobileLayout:v}}),DISQUS.define("next.host.app",function(a,b){"use strict";var c=DISQUS.isOwn,d=DISQUS.extend,e=DISQUS.use("next.host"),f=document.documentElement,g={getRegistry:function(){var a=this._registry;return a?a:this._registry={}},register:function(a){var b=this.getRegistry();b[a.uid]=a},unregister:function(a){var b=this.getRegistry();delete b[a.uid]},listByKey:function(){return this.getRegistry()},list:function(){var a=this.getRegistry(),b=[];for(var d in a)c(a,d)&&b.push(a[d]);return b},get:function(a){var b=this.getRegistry();return c(b,a)?b[a]:null}},h=function(a){var b=this.constructor;this.uid=DISQUS.getUid(),b.register&&b.register(this),this.settings=a||{};var c=[],d=this;do c.unshift(d),d=d.constructor.__super__;while(d);for(var e=0,f=c.length;f>e;e++)d=c[e],d.events&&this.on(d.events,this),d.onceEvents&&this.once(d.onceEvents,this)};d(h.prototype,DISQUS.Events),h.prototype.destroy=function(){var a=this.constructor;this.off(),this.stopListening(),a.unregister&&a.unregister(this)},h.extend=function(a,b){var e,f=this;e=a&&c(a,"constructor")?a.constructor:function(){return f.apply(this,arguments)},d(e,f,b);var g=function(){this.constructor=e};return g.prototype=f.prototype,e.prototype=new g,a&&d(e.prototype,a),e.__super__=f.prototype,e};var i=h.extend({frame:null,urls:null,state:null,origins:{insecure:"http://disqus.com",secure:"https://disqus.com"},getUrl:function(){var a=this.settings.useSSL?this.urls.secure:this.urls.insecure;return DISQUS.serialize(a,{disqus_version:i.DISQUS_VERSION,base:i.DISQUS_BASE})},getFrame:function(){var a,b=this.settings,c={target:this.getUrl(),origin:b.useSSL?this.origins.secure:this.origins.insecure,uid:this.uid};return b.windowName?c.windowName=b.windowName:c.container=this.settings.container||document.body,this.getFrameSettings&&(c=this.getFrameSettings(c)),a=c.windowName?DISQUS.Popup:DISQUS.Channel,new a(c)},setState:function(a){var c=this.constructor;return a in c.states?(this.state=c.states[a],b):!1},init:function(){var a,b=this;b.setState("INIT"),b.trigger("beforeInit"),b.frame=a=this.getFrame(),b.listenTo(a,"all",function(c,d){b.trigger("frame:"+c,d,a)}),b.trigger("change:frame",a),b.frame.load(function(){b.setState("LOADED"),b.trigger("frameLoaded",a)}),b.trigger("afterInit")},destroy:function(){var a=this.frame;a&&(this.stopListening(a),a.destroy()),this.setState("KILLED"),this.frame=null,h.prototype.destroy.call(this)},events:{"frame:ready":function(){this.setState("READY")}}},{states:{INIT:0,LOADED:1,READY:2,RUNNING:3,KILLED:4},DISQUS_VERSION:"1383952229",DISQUS_BASE:"default"});d(i,g);var j=i.extend({getUrl:function(){var b=this.settings,c=i.prototype.getUrl.call(this),d={f:b.forum,t_i:b.identifier,t_u:b.url||a.location.href,t_s:b.slug,t_e:b.title,t_d:b.documentTitle,t_t:b.title||b.documentTitle,t_c:b.category,s_o:b.sortOrder,l:b.language};return b.unsupported&&(d.n_s=b.unsupported),DISQUS.serialize(c,d)},getFrameSettings:function(a){return a.role="complementary",a},getUrlWithConfig:function(){return this.getUrl()+"#"+encodeURIComponent(JSON.stringify(this.getFrameInitParams()))},getFrameInitParams:function(b,c){var d=this.settings,f={permalink:d.permalink,anchorColor:d.anchorColor,referrer:a.location.href,colorScheme:d.colorScheme,typeface:d.typeface,remoteAuthS3:d.remoteAuthS3,apiKey:d.apiKey,sso:d.sso,parentWindowHash:a.location.hash,forceAutoStyles:d.forceAutoStyles,layout:d.layout,isMobileAndBetaParticipant:e.loader.isMobileAndBetaParticipant(a,d.forum)};return c&&c.elem&&a.navigator.userAgent.match(/(iPad|iPhone|iPod)/)&&(f.width=c.elem.offsetWidth),f.initialPosition=this.getViewportAndScrollStatus(),f},configureScrollEvent:function(){var a=this,b=this.scrollContainer=this.getScrollContainer();b===f?a.listenTo(DISQUS,"window.scroll",a.communicateViewportAndScrollStatus):DISQUS.addEvent(b,"scroll",a.throttledCommunicateViewportAndScrollStatus)},getScrollContainer:function(){if(!this.settings.enableScrollContainer)return f;for(var a=this.settings.container;a.parentNode&&a!==f;){a=a.parentNode;var b=e.utils.getComputedStyle(a,"overflow-y","overflowY");if("scroll"===b||"auto"===b)break}return a},getViewportCoords:function(){return this.scrollContainer===f?this.getWindowCoords():this.getScrollContainerCoords()},getWindowCoords:function(){if("number"==typeof a.pageYOffset)this.getWindowScroll=function(){return a.pageYOffset},this.getWindowHeight=function(){return a.innerHeight};else{var b=a.document;b=b.documentElement.clientHeight||b.documentElement.clientWidth?b.documentElement:b.body,this.getWindowScroll=function(){return b.scrollTop},this.getWindowHeight=function(){return b.clientHeight}}return this.getWindowCoords=function(){return{top:this.getWindowScroll(),height:this.getWindowHeight()}},this.getWindowCoords()},getScrollContainerCoords:function(){var a=this.scrollContainer;return{top:a.scrollTop,height:a.clientHeight}},getViewportAndScrollStatus:function(){var a=this.frame;if(!a||!a.getOffset)return null;var b=this.getViewportCoords();return{frameOffset:a.getOffset(this.scrollContainer),pageOffset:b.top,height:b.height}},throttledCommunicateViewportAndScrollStatus:DISQUS.throttle(function(){this.communicateViewportAndScrollStatus()},250,50),communicateViewportAndScrollStatus:function(){var a=this.getViewportAndScrollStatus();if(a){var b=a.frameOffset,c=b.top,d=c+b.height,e=a.pageOffset,f=a.height,g=e+f,h=!1,i=!1;g+f>=c&&(h=d>=e,i=h&&g>=c);var j=this.frame;h&&(j.sendMessage("window.scroll",a),this.wasNearViewport||j.sendMessage("window.nearViewport")),this.wasNearViewport=h,i!==this.wasInViewport&&(j.sendMessage(i?"window.inViewport":"window.scrollOffViewport"),this.wasInViewport=i)}},events:{beforeInit:function(){this.settings.unsupported||this.settings.windowName||(this.configureScrollEvent(),this.listenTo(DISQUS,"window.resize",this.throttledCommunicateViewportAndScrollStatus))},afterInit:function(){this.trigger("loading.start")},frameLoaded:function(a){var b=a.elem;this.settings.unsupported?(a.setInlineStyle("height","500px"),b.setAttribute("scrolling","yes"),b.setAttribute("horizontalscrolling","no"),b.setAttribute("verticalscrolling","yes"),a.show()):this.settings.windowName||(b.setAttribute("scrolling","no"),b.setAttribute("horizontalscrolling","no"),b.setAttribute("verticalscrolling","no"))},"frame:ready":function(a,b){var c=this.getFrameInitParams(a,b);b.sendMessage("init",c),this.trigger("loading.init")},"frame:resize":function(a,b){b.elem&&this.rendered&&(b.setInlineStyle("height",a.height+"px"),b.sendMessage("embed.resized")),this.communicateViewportAndScrollStatus()},"frame:mainViewRendered":function(a,b){this.rendered=!0,b.trigger("resize",a),b.sendMessage("embed.rendered"),this.trigger("loading.done")},"frame:fail":function(a,b){b.elem&&b.setInlineStyle("height","75px"),this.trigger("fail",a)},"frame:scrollTo":function(b,c){if(c.elem&&c.getOffset){var d=c.getOffset(),e="window"===b.relative?b.top:d.top+b.top,f=this.getViewportCoords();!b.force&&e>f.pageYOffset&&f.pageYOffset+f.innerHeight>e||(this.scrollContainer===document.documentElement?a.scrollTo(0,e):this.scrollContainer.scrollTop=e)}}}}),k=function(a,b,c){DISQUS.each(b,function(b){c[b]=function(){return a[b].apply(a,arguments)}})};return{expose:k,BaseApp:h,WindowedApp:i,ThreadBoundApp:j,PublicInterfaceMixin:g}}),DISQUS.define("next.host.profile",function(a,b){"use strict";var c=DISQUS.next.host.app.WindowedApp,d=c.extend({urls:{insecure:"http://disqus.com/embed/profile/",secure:"https://disqus.com/embed/profile/"},events:{beforeInit:function(){var a=this.settings;a.fullscreen=a.fullscreen!==!1},afterInit:function(){this.trigger("loading.start")},"frame:ready":function(b,c){var d=this.settings;c.sendMessage("init",{referrer:a.location.href,fullscreen:d.fullscreen,forumId:d.forumId,threadId:d.threadId,forumPk:d.forumPk}),this.trigger("loading.init")},"frame:close":function(b,c){c.hide(),a.focus()},"frame:renderProfile":function(a){this.trigger("renderProfile",a)}},getUrl:function(){var a=this.settings,b=c.prototype.getUrl.call(this);return DISQUS.serialize(b,{f:a.forum,l:a.language})},getFrameSettings:function(a){var b=this.settings.fullscreen;return a.role="dialog",a.styles=b?{height:"100%",position:"fixed",top:0,left:0,"z-index":2147483647}:{height:"100%",padding:0},a},show:function(a){DISQUS.isString(a)?a={user:{username:a}}:DISQUS.isString(a.user)&&(a.user={username:a.user});var c=this.frame;return c.isReady()?(c.sendMessage("showProfile",a),c.show(),b):void this.once("frame:ready",function(){this.show(a)},this)}});return{Profile:function(a){return new d(a)},_ProfileApp:d}}),DISQUS.define("next.host.backplane",function(){"use strict";var a;try{localStorage.setItem("disqus.localStorageTest","disqus"),localStorage.removeItem("disqus.localStorageTest"),a=!0}catch(b){a=!1}var c=function(b){this.frame=b,this.credentials="unset";var c=this;"function"==typeof Backplane&&"string"==typeof Backplane.version&&"function"==typeof Backplane.subscribe&&a&&Backplane(function(){c.initialize()})},d="disqus.backplane.channel",e="disqus.backplane.messageUrl";return DISQUS.extend(c.prototype,{frameEvents:{invalidate:"clearCredentials"},initialize:function(){var a=this;DISQUS.each(this.frameEvents,function(b,c){a.frame.on("backplane."+c,"function"==typeof b?b:a[b],a)}),this.credentialsFromLocalStorage()&&this.frame.sendMessage("login",{backplane:this.credentials}),this.subscribe()},subscribe:function(){var a=this;Backplane.subscribe(function(b){var c=a.handlers[b.type];c&&c.call(a,b)})},handlers:{"identity/login":function(a){var b=a.messageURL,c=a.channel;("unset"===this.credentials||null===this.credentials||this.credentials.channel!==c||this.credentials.messageUrl!==b)&&(this.setCredentials(c,b),this.frame.sendMessage("login",{backplane:this.getCredentials()}))}},credentialsFromLocalStorage:function(){var a=localStorage.getItem(d),b=localStorage.getItem(e);return this.setCredentials(a,b,!0),this.credentials},setCredentials:function(a,b,c){return a&&b?(c||(localStorage.setItem(d,a),localStorage.setItem(e,b)),this.credentials={channel:a,messageUrl:b},void 0):void this.clearCredentials()},getCredentials:function(){return"unset"!==this.credentials?this.credentials:this.credentialsFromLocalStorage()},clearCredentials:function(a){a=a||{},this.credentials=null,localStorage.removeItem(d),localStorage.removeItem(e),a.redirectUrl&&(window.location=a.redirectUrl)}}),{BackplaneIntegration:c}}),DISQUS.define("next.host.lounge",function(a,b){"use strict";var c=a.document,d=".disqus-loader{animation:disqus-embed-spinner .7s infinite linear;-webkit-animation:disqus-embed-spinner .7s infinite linear}@keyframes disqus-embed-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@-webkit-keyframes disqus-embed-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}",e="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAABmCAMAAACA210sAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAlhQTFRFMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtMzY63+TtWDj2BwAAAMh0Uk5TAAABAQICAwMEBAUFBgYHBwgICQkKCgsLDAwNDQ4ODw8QEBEREhITExQUFRUWFhcXGBgZGRoaGxscHB0dHh4fHyAgISEjIyQkJSUmJigoKSkqKisrLCwtLS4uLy8wMDExMjIzMzQ0NTU2Njc3ODg5OTo6Ozs8PD09Pj4/P0BAQUFCQkNDRERFRUZGR0dISElJS0tMTE1NTk5PT1BQUVFSUlNTVFRVVVZWV1dYWFlZWlpbW1xcXV1eXl9fYGBhYWJiY2NkZGVlZmaMInkiAAAFVklEQVRo3u2Yf0hbVxTHP/flmYYQxFoXghMJzkpXQmszCd0ma7eKKyKuSOlKGaV0RaRzsIHIGDK2MqSsXVvKcKWIG6V0ItI5Z1tXZBsiIkWciC0iYsMIIbisC1mWhpDG/RFjfpvr4O2vnH+Se+/J575z3z3n5n4F2Uy12aotpUY1HFp1OecXo+S00vo6q9kYXF2ZnfLG+0QWYH2jw5jcEZi6P50dW33qoBL//sl4TqbpyPHSzB97bo2GMjr1bcfUjcbcWXIwlZb24uxBenvH0sM+b0s0om2PAJPBC+hS3KxfvrUtx8IZD+z9LZDcUfL1zqTWj98DtLVP/JP2nIc74+vonplfWQ2EDcZya22deb3T1zOZtOq9saf0jMy6vSarywdU3tAvdIRTmGdOxz5Dd8cWkqeyNzXG1i16ZWijs+MEQPjaUCTh+EU9DFxNZna2AhAZvPUkPXDLqebY++3rj7/xfhXwfTyX5LX/EhA9tZxYz/bjACx0/vQ0YzEDk9O27QD2vx/Gej6oBiKdcylub24DsWN8g9ncAcDAp39mfUV/jJp3Aux//Big9CMF+Go8xcfveR14/k6cuatHB0Qvf5MrZ55NiH0Ajl/8wKEDgOezNOeVV8tAca8z9Zd3AFy4nTsLmRX7AP2Ld9bgxAvA4Ey6S9HLwNP11HrHCnBjmM2sbwTA1gJUAWQgmQKwxpiWkwAz19ncriwBtJugDMCZ4eAOAeYY84QeCPZE8zBDn0eA4qOgAvgzPQKASQEobQbo85DPlgcBjhkIA2SpNSVAQAFoMADeYfLbzSBQ8hpPACwZw2YV8CoATQCDIQmmbwTgMCsA9oxhO4BTASw1QGQMGRsBqDPNADSr6aPNADNKnD7rlWI6lwG1bioCVDSlDb5iB6ITClAL8AA5mwbY9eTXjaRPWs1ugEmvEt/AjySZjwCs9EcAQ3tK8bpUAkT7UYBKgGVJphOgAucAwI2kgfq+KoChJVRQTYA/IMl0AZTB9Vob9+cBSn1RxeJorAVg6RqoYIwngJRFQgYwQqSr19ILUH6LkCl+Iru6QglmEGkosdT0nXWsApzVo4+PLXZ5Y6NBWAdLmbrOxXcfoO6NxHk81BsmiVksjTSkRKV0bBAnvl3amDXiLwZTsV+OWQmQyA/9UF2V2Rj0OmcnvMmROPcAVXNbYLoS5W90NMNFAX4HsEnGvjt7NU5nLgA4JJn78yedEj9XasukkDXVQGQ2L9O9DKhNUswmgJlAXiZjAEdUCWRJC8Bd8jP9AOGIBPOkAfBNSjBbAW7LrOZRgIFQfubuXUBI4uwwdKuAL9/sCnAE4GeJPIrV9WuB/MziBgCJk7i9BWB+VKLKHDYAiwuo5RUW9/QmyJMAgXNRCWYrgP5qhVmBQHeus87Y1QhAjztvPDocbwNsLzcJQN+oPsy6p2wXXgLg4j0kmO9Zk9ui9tBfzrV0r/L3P9wOwPXvJHacKLudkT/O4fHkW4Jib2pYv3dclPlPhTh9Jl6nPW7vQcP698W5RddqMGQyVpbb7fHqEjg3KVUTxLA56Ha7XB63OwKV3ZuU0QfnPXLlUOxxpcTZ0laS4755dVz2yMq4Fxtbj2WppO6bd8P8Zyao9Q0OU8q9Z3p8Koq8CZF1h9lqaixlRn0w5HWtLCytsSVTc8y0rahIpxNFz3S6Ip1Y26J2ITTQLoQG2oXQQLsQGmgXQgPtQmigXQgNtAuhgXYhNNAuhAbahShoFwXtoqBdFLSLgnZR0C4K2kVBuyhoFwXtIofOIDTQLoQG2sVzGmgX72qgXfyggXaxVwPtQmigXYj/S7tQU7WLrQCBfwFnft8xK3413wAAAABJRU5ErkJggg==",f=DISQUS.next.host,g=f.app.ThreadBoundApp,h=g.extend({indicators:null,wasInViewport:!1,wasNearViewport:!1,triggeredSlowEvent:!1,urls:{insecure:"http://disqus.com/embed/comments/",secure:"https://disqus.com/embed/comments/"},events:{beforeInit:function(){var a=this.settings,b=!a.windowName;a.unsupported||(this.indicators={},b&&this.addLoadingAnim(),this.bindPublisherCallbacks(),this.forwardGlobalEvents())},"frame:reload":function(){a.location.reload()},"frame:reset":function(){DISQUS.reset({reload:!0})},"frame:session.identify":function(a){this.trigger("session.identify",a)},"frame:posts.paginate":function(){this.trigger("posts.paginate")},"frame:posts.create":function(a){this.trigger("posts.create",{id:a.id,text:a.raw_message})},"frame:profile.show":function(a){this.showProfile(a)},"frame:indicator:init":function(a,b){if(b.getOffset){for(var c,d,e=["north","south"],f=this.indicators,g=b.getOffset().width+"px",h={width:g,minWidth:g,maxWidth:g,position:"fixed"},i={north:{top:"0"},south:{bottom:"0"}},j=0;e.length>j;j++){d=e[j],c=new DISQUS.Sandbox({uid:"indicator-"+d,container:this.settings.container,contents:a[d].contents,styles:DISQUS.extend(i[d],h),role:"alert",type:d});try{c.load()}catch(k){continue}c.hide(),c.click(function(){b.sendMessage("indicator:click",this.uid.split("-")[1])}),f[d]=c}this.on({"frame:indicator:show":function(a){var b=f[a.type];b&&(b.document.getElementById("message").innerHTML=a.content,b.show())},"frame:indicator:hide":function(a){var b=a&&a.type,c=b&&f[b];if(c)c.hide();else if(!b)for(var d=0;e.length>d;d++)c=f[b],c&&c.hide()}})}},"fail loading.done":function(){this.removeLoadingAnim()},fail:function(a){f.utils.logStat("failed_embed.server."+a.code)},"loading.done":function(){this.setState("RUNNING"),this.triggeredSlowEvent&&f.utils.logStat("rendered_embed.slow")}},onceEvents:{"frame:loadLinkAffiliator":function(b,c){var d=function(){for(var b in a)if(0===b.indexOf("skimlinks")||0===b.indexOf("skimwords"))return!0;return!1};if(!(a.vglnk_self||a.vglnk||d())){var e=b.apiUrl,f=b.key,g=b.id+"";null!=b.clientUrl&&null!=e&&null!=f&&null!=b.id&&(this.listenForAffiliationRequests(e,f,g),DISQUS.define("vglnk",function(){return{api_url:e,key:f,sub_id:g,onlibready:function(){c.sendMessage("affiliationOptions",{timeout:DISQUS.vglnk.opt("click_timeout")})}}}),a.vglnk_self="DISQUS.vglnk",DISQUS.require(b.clientUrl))}},"frame:loadBackplane":function(a,b){this.backplane=new DISQUS.next.host.backplane.BackplaneIntegration(b)}},showProfile:function(a){var b=this.settings,c=this.profile;c&&(c.frame.windowName||c.frame.isKilled())&&(c.destroy(),c=null),c||(c=this.profile=f.profile.Profile({windowName:a.windowName,language:b.language,useSSL:b.useSSL,forum:b.forum,forumId:a.forumId,threadId:a.threadId,forumPk:a.forumPk}),c.init()),c.show({user:{id:a.userId},defaultSection:a.defaultSection})},listenForAffiliationRequests:function(a,c,d){var e=this.frame;this.on("frame:affiliateLink",function(f){function g(a){return function(b){var c={token:a};b&&(c.url=b),e.sendMessage("affiliateLink",c)}}var h=DISQUS.vglnk.$;return h?(h.request(a+"/click",{format:"jsonp",out:f.url,key:c,loc:e.target,subId:d},{fn:g(f.token),timeout:DISQUS.vglnk.opt("click_timeout")}),b):void e.sendMessage("affiliateLink")})},forwardGlobalEvents:function(){var a=this;a.settings.windowName||(a.listenTo(DISQUS,"window.resize",function(){a.frame.sendMessage("window.resize")
}),a.listenTo(DISQUS,"window.click",function(){a.frame.sendMessage("window.click")})),a.listenTo(DISQUS,"window.hashchange",function(b){a.frame.sendMessage("window.hashchange",b.hash)})},bindPublisherCallbacks:function(){var a=this,b=a.settings,c=h.LEGACY_EVENTS_MAPPING,d=b.callbacks;d&&DISQUS.each(d,function(b,d){c[d]&&DISQUS.each(b,function(b){a.on(c[d],b)})})},addLoadingAnim:function(){var a,b,g,h=this,i=h.settings.container;if(!h.loadingElem){var j=c.createElement("style");j.type="text/css",j.styleSheet?j.styleSheet.cssText=d:j.appendChild(c.createTextNode(d)),a=c.createElement("div"),b=c.createElement("div"),g=c.createElement("div"),b.appendChild(j),b.appendChild(g),a.appendChild(b),a.dir="ltr",a.style.overflow="hidden",b.style.height=b.style.width="54px",b.style.margin="0 auto",b.style.overflow="hidden",g.style.height=g.style.width="29px",g.style.margin="11px 14px",g.className="disqus-loader",g.style.backgroundImage=b.style.backgroundImage="url("+e+")",g.style.backgroundRepeat=b.style.backgroundRepeat="no-repeat",g.style.backgroundPosition="-54px 0","dark"===h.settings.colorScheme&&(b.style.backgroundPosition="0 -51px",g.style.backgroundPosition="-54px -51px"),i.appendChild(a),h.loadingElem=a,h.timeout=setTimeout(function(){a&&(h.triggeredSlowEvent=!0,h.state===h.constructor.states.READY?f.utils.logStat("slow_embed.got_ready"):h.state===h.constructor.states.LOADED?f.utils.logStat("slow_embed.loaded"):f.utils.logStat("slow_embed.no_ready"),b.insertAdjacentHTML("afterend",'<p align="center">Disqus seems to be taking longer than usual. '+'<a href="#" onclick="DISQUS.reset({reload: true}); return false;">Reload</a>?</p>'))},15e3)}},removeLoadingAnim:function(){var a=this.loadingElem,b=this.settings.container;this.timeout&&(clearTimeout(this.timeout),this.timeout=null),a&&a.parentNode===b&&(b.removeChild(a),this.loadingElem=null)},destroy:function(){var a=this.indicators;this.removeLoadingAnim(),this.profile&&this.profile.destroy(),a&&a.north&&(a.north.destroy(),a.north=null),a&&a.south&&(a.south.destroy(),a.south=null),g.prototype.destroy.call(this)}},{LEGACY_EVENTS_MAPPING:{onReady:"loading.done",onNewComment:"posts.create",onPaginate:"posts.paginate",onIdentify:"session.identify"}}),i=function(a){return new h(a)};return f.app.expose(h,["list","listByKey","get"],i),{Lounge:i}}),DISQUS.define("next.host.ignition",function(){"use strict";var a=DISQUS.next.host,b=a.app.ThreadBoundApp,c=a.lounge.Lounge,d=b.extend({urls:{insecure:"http://disqus.com/embed/ignition/",secure:"https://disqus.com/embed/ignition/"},events:{afterInit:function(){var b=this,c=b.overlay=document.createElement("a"),d=a.lounge.Lounge(this.settings);c.setAttribute("href",d.getUrlWithConfig()),c.setAttribute("target","_blank"),c.style.cssText=["display: block !important","float: left !important","position: relative !important","padding: 0 !important","margin; 0 !important","width: 100% !important","opacity: 0 !important","height: 0 !important","z-index: 1 !important","cursor: pointer !important"].join(";"),b.on("frame:resize",function(a){var c=b.overlay,d=a.button;c.style.setProperty("height",d.height+"px","important"),c.style.setProperty("margin-top","-"+(a.height-d.top)+"px","important")},b),b.frame.elem.parentNode.appendChild(c)},"frame:ignite":function(a){var b=this.lounge;b&&!b.frame.isKilled()&&b.destroy();var d=DISQUS.extend({windowName:a.windowName},this.settings);this.lounge=b=c(d),b.init()}}}),e=function(a){return new d(a)};return{Ignition:e}}),DISQUS.define("next.host.config",function(a,b){"use strict";var c=DISQUS.use("next.host.utils"),d=function(a,c){this.win=a,this.configurator=c,this.config={page:{url:b,title:b,slug:b,category_id:b,identifier:b,language:b,api_key:b,remote_auth_s3:b,author_s3:b},experiment:{enable_scroll_container:b,force_auto_styles:b},strings:b,sso:{},callbacks:{preData:[],preInit:[],onInit:[],afterRender:[],onReady:[],onNewComment:[],preReset:[],onPaginate:[],onIdentify:[]}}};d.DISQUS_GLOBALS=["shortname","identifier","url","title","category_id","slug"];var e=d.prototype;return e.getContainer=function(){var a=this.win;return a.document.getElementById(a.disqus_container_id||"disqus_thread")},e.runConfigurator=function(){var a=this.configurator||this.win.disqus_config;if("function"==typeof a)try{a.call(this.config)}catch(b){}},e.getValuesFromGlobals=function(){var a,e=this.win,f=this.config,g=f.page;DISQUS.each(d.DISQUS_GLOBALS,function(a){var c=e["disqus_"+a];b!==c&&(g[a]=c)}),this.runConfigurator(),f.forum||(a=g.shortname,f.forum=a?a.toLowerCase():c.getForum(e.document))},e.toJSON=function(){var a=this.win,b=this.config,d=b.page,e=this.getContainer();return this.getValuesFromGlobals(),{container:e,forum:b.forum,sortOrder:"default",permalink:c.getPermalink(),useSSL:c.isSSL(a.location.protocol),language:b.language,typeface:c.isSerif(e)?"serif":"sans-serif",anchorColor:c.getAnchorColor(e),colorScheme:128<c.getContrastYIQ(c.getElementStyle(e,"span","color"))?"dark":"light",url:d.url||a.location.href.replace(/#.*$/,""),title:d.title,documentTitle:c.guessThreadTitle(),slug:d.slug,category:d.category_id,identifier:d.identifier,apiKey:d.api_key,remoteAuthS3:d.remote_auth_s3,sso:b.sso,unsupported:c.getBrowserSupport(a),callbacks:b.callbacks,enableScrollContainer:b.experiment.enable_scroll_container,forceAutoStyles:b.experiment.force_auto_styles,layout:c.isMobileLayout()?"mobile":"desktop"}},{HostConfig:d}}),DISQUS.define("next.host.loader",function(a){"use strict";var b,c=DISQUS.use("next.host.loader"),d=DISQUS.use("next.host"),e=new d.config.HostConfig(a),f=!1,g=function(a,b){return b.unsupported||a.disqus_disable_mobile?!1:a.disqus_ignition?!0:"1"?h(a,b.forum)&&!d.utils.isMobileLayout():!1},h=function(a,b){return d.utils.isInPercentile(b,20)&&d.utils.isMobile(a)},i=function(){var b=a.document;if(b.getElementsByClassName){if("complete"!==b.readyState)return DISQUS.addEvent(a,"load",i);var c=b.getElementsByClassName("dsq-brlink"),d=c&&c.length&&c[0];d&&d.parentNode.removeChild(d)}},j=function(g){e.configurator=g;var h=e.toJSON();return f||(h.container.innerHTML="",f=!0),b=c.shouldUseIgnition(a,h)?d.ignition.Ignition(h):d.lounge.Lounge(h),b.init(),c.removeDisqusLink(),b},k=function(a){a=a||{},b&&(b.triggeredSlowEvent&&b.state!==b.constructor.states.RUNNING&&d.utils.logStat("reset_embed.slow"),b.destroy(),b=null),a.reload&&c.loadEmbed(a.config)};return{configAdapter:e,shouldUseIgnition:g,removeDisqusLink:i,loadEmbed:j,reset:k,isMobileAndBetaParticipant:h}}),function(){"use strict";DISQUS.reset=DISQUS.next.host.loader.reset,DISQUS.request={get:function(a,b,c){DISQUS.require(a,b,c)}}}(),DISQUS.next.host.loader.loadEmbed();