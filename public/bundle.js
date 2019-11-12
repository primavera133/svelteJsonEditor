var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function r(e){e.forEach(t)}function o(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function c(e,t,n){e.$$.on_destroy.push(function(e,t){const n=e.subscribe(t);return n.unsubscribe?()=>n.unsubscribe():n}(t,n))}function i(e,t,n=t){return e.set(n),t}function s(e,t){e.appendChild(t)}function l(e,t,n){e.insertBefore(t,n||null)}function u(e){e.parentNode.removeChild(e)}function f(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function d(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function h(){return p(" ")}function m(){return p("")}function y(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function g(e,t,n){null==n?e.removeAttribute(t):e.setAttribute(t,n)}function $(e,t){t=""+t,e.data!==t&&(e.data=t)}function k(e,t){(null!=t||e.value)&&(e.value=t)}function _(e,t){for(let n=0;n<e.options.length;n+=1){const r=e.options[n];if(r.__value===t)return void(r.selected=!0)}}function v(e){const t=e.querySelector(":checked")||e.options[0];return t&&t.__value}let b;function j(e){b=e}function x(){if(!b)throw new Error("Function called outside component initialization");return b}function w(e,t){x().$$.context.set(e,t)}function S(e){return x().$$.context.get(e)}const C=[],F=[],E=[],N=[],O=Promise.resolve();let A=!1;function R(e){E.push(e)}function L(){const e=new Set;do{for(;C.length;){const e=C.shift();j(e),T(e.$$)}for(;F.length;)F.pop()();for(let t=0;t<E.length;t+=1){const n=E[t];e.has(n)||(n(),e.add(n))}E.length=0}while(C.length);for(;N.length;)N.pop()();A=!1}function T(e){e.fragment&&(e.update(e.dirty),r(e.before_update),e.fragment.p(e.dirty,e.ctx),e.dirty=null,e.after_update.forEach(R))}const q=new Set;let U;function B(e,t){e&&e.i&&(q.delete(e),e.i(t))}function P(e,t,n,r){if(e&&e.o){if(q.has(e))return;q.add(e),U.c.push(()=>{q.delete(e),r&&(n&&e.d(1),r())}),e.o(t)}}const D="undefined"!=typeof window?window:global;function V(e,n,a){const{fragment:c,on_mount:i,on_destroy:s,after_update:l}=e.$$;c.m(n,a),R(()=>{const n=i.map(t).filter(o);s?s.push(...n):r(n),e.$$.on_mount=[]}),l.forEach(R)}function I(e,t){e.$$.fragment&&(r(e.$$.on_destroy),e.$$.fragment.d(t),e.$$.on_destroy=e.$$.fragment=null,e.$$.ctx={})}function z(e,t){e.$$.dirty||(C.push(e),A||(A=!0,O.then(L)),e.$$.dirty=n()),e.$$.dirty[t]=!0}function H(t,o,a,c,i,s){const l=b;j(t);const u=o.props||{},f=t.$$={fragment:null,ctx:null,props:s,update:e,not_equal:i,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(l?l.$$.context:[]),callbacks:n(),dirty:null};let d=!1;f.ctx=a?a(t,u,(e,n,r=n)=>(f.ctx&&i(f.ctx[e],f.ctx[e]=r)&&(f.bound[e]&&f.bound[e](r),d&&z(t,e)),n)):u,f.update(),d=!0,r(f.before_update),f.fragment=c(f.ctx),o.target&&(o.hydrate?f.fragment.l(function(e){return Array.from(e.childNodes)}(o.target)):f.fragment.c(),o.intro&&B(t.$$.fragment),V(t,o.target,o.anchor),L()),j(l)}class J{$destroy(){I(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}var M={baseUrl:"https://raw.githubusercontent.com/primavera133/dragonsGraphQLAPI/master/api/data/",dataTree:{aeshnidae:["aeshna-affinis","aeshna-caerulea","aeshna-crenata","aeshna-cyanea","aeshna-grandis","aeshna-isoceles","aeshna-juncea","aeshna-mixta","aeshna-serrata","aeshna-subarctica","aeshna-viridis","anax-ephippiger","anax-imaculifrons","anax-imperator","anax-junius","anax-parthenope","boyeria-cretensis","boyeria-irene","brachytron-pratense","caliaeschna-microstigma"],calopterygidae:["calopteryx-haemorrhoidalis","calopteryx-splendens","calopteryx-virgo","calopteryx-xanthostoma"],coenagrionidae:["ceriagrion-georgifreyi","ceriagrion-tenellum","coenagrion-armatum","coenagrion-caerulescens","coenagrion-ecornutum","coenagrion-glaciale","coenagrion-hastulatum","coenagrion-hylas","coenagrion-intermedium","coenagrion-johanssonii","coenagrion-lunulatum","coenagrion-mercuriale","coenagrion-ornatum","coenagrion-puella","coenagrion-pulchellum","coenagrion-scitulum","enallagma-cyathigerum","erythromma-lindenii","erythromma-najas","erythromma-viridulum"]}},X=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}},G=Object.prototype.toString;function K(e){return"[object Array]"===G.call(e)}function Q(e){return null!==e&&"object"==typeof e}function Y(e){return"[object Function]"===G.call(e)}function W(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),K(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}var Z={isArray:K,isArrayBuffer:function(e){return"[object ArrayBuffer]"===G.call(e)},isBuffer:function(e){return null!=e&&null!=e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:Q,isUndefined:function(e){return void 0===e},isDate:function(e){return"[object Date]"===G.call(e)},isFile:function(e){return"[object File]"===G.call(e)},isBlob:function(e){return"[object Blob]"===G.call(e)},isFunction:Y,isStream:function(e){return Q(e)&&Y(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:W,merge:function e(){var t={};function n(n,r){"object"==typeof t[r]&&"object"==typeof n?t[r]=e(t[r],n):t[r]=n}for(var r=0,o=arguments.length;r<o;r++)W(arguments[r],n);return t},deepMerge:function e(){var t={};function n(n,r){"object"==typeof t[r]&&"object"==typeof n?t[r]=e(t[r],n):t[r]="object"==typeof n?e({},n):n}for(var r=0,o=arguments.length;r<o;r++)W(arguments[r],n);return t},extend:function(e,t,n){return W(t,(function(t,r){e[r]=n&&"function"==typeof t?X(t,n):t})),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}};function ee(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var te=function(e,t,n){if(!t)return e;var r;if(n)r=n(t);else if(Z.isURLSearchParams(t))r=t.toString();else{var o=[];Z.forEach(t,(function(e,t){null!=e&&(Z.isArray(e)?t+="[]":e=[e],Z.forEach(e,(function(e){Z.isDate(e)?e=e.toISOString():Z.isObject(e)&&(e=JSON.stringify(e)),o.push(ee(t)+"="+ee(e))})))})),r=o.join("&")}if(r){var a=e.indexOf("#");-1!==a&&(e=e.slice(0,a)),e+=(-1===e.indexOf("?")?"?":"&")+r}return e};function ne(){this.handlers=[]}ne.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},ne.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},ne.prototype.forEach=function(e){Z.forEach(this.handlers,(function(t){null!==t&&e(t)}))};var re=ne,oe=function(e,t,n){return Z.forEach(n,(function(n){e=n(e,t)})),e},ae=function(e){return!(!e||!e.__CANCEL__)},ce=function(e,t){Z.forEach(e,(function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])}))},ie=function(e,t,n,r,o){return function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}(new Error(e),t,n,r,o)},se=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],le=Z.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function r(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=r(window.location.href),function(t){var n=Z.isString(t)?r(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return!0},ue=Z.isStandardBrowserEnv()?{write:function(e,t,n,r,o,a){var c=[];c.push(e+"="+encodeURIComponent(t)),Z.isNumber(n)&&c.push("expires="+new Date(n).toGMTString()),Z.isString(r)&&c.push("path="+r),Z.isString(o)&&c.push("domain="+o),!0===a&&c.push("secure"),document.cookie=c.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}},fe=function(e){return new Promise((function(t,n){var r=e.data,o=e.headers;Z.isFormData(r)&&delete o["Content-Type"];var a=new XMLHttpRequest;if(e.auth){var c=e.auth.username||"",i=e.auth.password||"";o.Authorization="Basic "+btoa(c+":"+i)}if(a.open(e.method.toUpperCase(),te(e.url,e.params,e.paramsSerializer),!0),a.timeout=e.timeout,a.onreadystatechange=function(){if(a&&4===a.readyState&&(0!==a.status||a.responseURL&&0===a.responseURL.indexOf("file:"))){var r,o,c,i,s,l="getAllResponseHeaders"in a?(r=a.getAllResponseHeaders(),s={},r?(Z.forEach(r.split("\n"),(function(e){if(i=e.indexOf(":"),o=Z.trim(e.substr(0,i)).toLowerCase(),c=Z.trim(e.substr(i+1)),o){if(s[o]&&se.indexOf(o)>=0)return;s[o]="set-cookie"===o?(s[o]?s[o]:[]).concat([c]):s[o]?s[o]+", "+c:c}})),s):s):null,u={data:e.responseType&&"text"!==e.responseType?a.response:a.responseText,status:a.status,statusText:a.statusText,headers:l,config:e,request:a};!function(e,t,n){var r=n.config.validateStatus;!r||r(n.status)?e(n):t(ie("Request failed with status code "+n.status,n.config,null,n.request,n))}(t,n,u),a=null}},a.onabort=function(){a&&(n(ie("Request aborted",e,"ECONNABORTED",a)),a=null)},a.onerror=function(){n(ie("Network Error",e,null,a)),a=null},a.ontimeout=function(){n(ie("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",a)),a=null},Z.isStandardBrowserEnv()){var s=ue,l=(e.withCredentials||le(e.url))&&e.xsrfCookieName?s.read(e.xsrfCookieName):void 0;l&&(o[e.xsrfHeaderName]=l)}if("setRequestHeader"in a&&Z.forEach(o,(function(e,t){void 0===r&&"content-type"===t.toLowerCase()?delete o[t]:a.setRequestHeader(t,e)})),e.withCredentials&&(a.withCredentials=!0),e.responseType)try{a.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&a.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&a.upload&&a.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){a&&(a.abort(),n(e),a=null)})),void 0===r&&(r=null),a.send(r)}))},de={"Content-Type":"application/x-www-form-urlencoded"};function pe(e,t){!Z.isUndefined(e)&&Z.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var he,me={adapter:("undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process)?he=fe:"undefined"!=typeof XMLHttpRequest&&(he=fe),he),transformRequest:[function(e,t){return ce(t,"Accept"),ce(t,"Content-Type"),Z.isFormData(e)||Z.isArrayBuffer(e)||Z.isBuffer(e)||Z.isStream(e)||Z.isFile(e)||Z.isBlob(e)?e:Z.isArrayBufferView(e)?e.buffer:Z.isURLSearchParams(e)?(pe(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):Z.isObject(e)?(pe(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};me.headers={common:{Accept:"application/json, text/plain, */*"}},Z.forEach(["delete","get","head"],(function(e){me.headers[e]={}})),Z.forEach(["post","put","patch"],(function(e){me.headers[e]=Z.merge(de)}));var ye=me;function ge(e){e.cancelToken&&e.cancelToken.throwIfRequested()}var $e=function(e){var t,n,r;return ge(e),e.baseURL&&(r=e.url,!/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(r))&&(e.url=(t=e.baseURL,(n=e.url)?t.replace(/\/+$/,"")+"/"+n.replace(/^\/+/,""):t)),e.headers=e.headers||{},e.data=oe(e.data,e.headers,e.transformRequest),e.headers=Z.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),Z.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||ye.adapter)(e).then((function(t){return ge(e),t.data=oe(t.data,t.headers,e.transformResponse),t}),(function(t){return ae(t)||(ge(e),t&&t.response&&(t.response.data=oe(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))},ke=function(e,t){t=t||{};var n={};return Z.forEach(["url","method","params","data"],(function(e){void 0!==t[e]&&(n[e]=t[e])})),Z.forEach(["headers","auth","proxy"],(function(r){Z.isObject(t[r])?n[r]=Z.deepMerge(e[r],t[r]):void 0!==t[r]?n[r]=t[r]:Z.isObject(e[r])?n[r]=Z.deepMerge(e[r]):void 0!==e[r]&&(n[r]=e[r])})),Z.forEach(["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","maxContentLength","validateStatus","maxRedirects","httpAgent","httpsAgent","cancelToken","socketPath"],(function(r){void 0!==t[r]?n[r]=t[r]:void 0!==e[r]&&(n[r]=e[r])})),n};function _e(e){this.defaults=e,this.interceptors={request:new re,response:new re}}_e.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=ke(this.defaults,e)).method=e.method?e.method.toLowerCase():"get";var t=[$e,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach((function(e){t.unshift(e.fulfilled,e.rejected)})),this.interceptors.response.forEach((function(e){t.push(e.fulfilled,e.rejected)}));t.length;)n=n.then(t.shift(),t.shift());return n},_e.prototype.getUri=function(e){return e=ke(this.defaults,e),te(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},Z.forEach(["delete","get","head","options"],(function(e){_e.prototype[e]=function(t,n){return this.request(Z.merge(n||{},{method:e,url:t}))}})),Z.forEach(["post","put","patch"],(function(e){_e.prototype[e]=function(t,n,r){return this.request(Z.merge(r||{},{method:e,url:t,data:n}))}}));var ve=_e;function be(e){this.message=e}be.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},be.prototype.__CANCEL__=!0;var je=be;function xe(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var n=this;e((function(e){n.reason||(n.reason=new je(e),t(n.reason))}))}xe.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},xe.source=function(){var e;return{token:new xe((function(t){e=t})),cancel:e}};var we=xe;function Se(e){var t=new ve(e),n=X(ve.prototype.request,t);return Z.extend(n,ve.prototype,t),Z.extend(n,t),n}var Ce=Se(ye);Ce.Axios=ve,Ce.create=function(e){return Se(ke(Ce.defaults,e))},Ce.Cancel=je,Ce.CancelToken=we,Ce.isCancel=ae,Ce.all=function(e){return Promise.all(e)},Ce.spread=function(e){return function(t){return e.apply(null,t)}};var Fe=Ce,Ee=Ce;Fe.default=Ee;var Ne=Fe;const Oe=({family:e,species:t})=>new Promise((n,r)=>{const o=`${M.baseUrl}${e}/${t}.json`;Ne.get(o).then(e=>{n(e.data)}).catch(r)}),{Object:Ae}=D;function Re(e,t,n){const r=Ae.create(e);return r.family=t[n],r}function Le(t){var n,r,o=t.family+"";return{c(){n=d("option"),r=p(o),n.__value=t.family,n.value=n.__value},m(e,t){l(e,n,t),s(n,r)},p:e,d(e){e&&u(n)}}}function Te(t){var n,o,a,c;let i=t.families,p=[];for(let e=0;e<i.length;e+=1)p[e]=Le(Re(t,i,e));return{c(){n=d("div"),o=d("select"),(a=d("option")).textContent="Välj en familj";for(let e=0;e<p.length;e+=1)p[e].c();a.__value="Välj en familj",a.value=a.__value,void 0===t.selected&&R(()=>t.select_change_handler.call(o)),g(o,"id","family"),g(n,"class","select"),c=[y(o,"change",t.select_change_handler),y(o,"change",t.handleChange)]},m(e,r){l(e,n,r),s(n,o),s(o,a);for(let e=0;e<p.length;e+=1)p[e].m(o,null);_(o,t.selected)},p(e,t){if(e.families){let n;for(i=t.families,n=0;n<i.length;n+=1){const r=Re(t,i,n);p[n]?p[n].p(e,r):(p[n]=Le(r),p[n].c(),p[n].m(o,null))}for(;n<p.length;n+=1)p[n].d(1);p.length=i.length}e.selected&&_(o,t.selected)},i:e,o:e,d(e){e&&u(n),f(p,e),r(c)}}}function qe(e,t,n){const r=Object.keys(M.dataTree);let o;const{setFamily:a}=S("family");return{families:r,selected:o,handleChange:function(){a(o)},select_change_handler:function(){o=v(this),n("selected",o),n("families",r)}}}class Ue extends J{constructor(e){super(),H(this,e,qe,Te,a,[])}}function Be(e,t,n){const r=Object.create(e);return r.specie=t[n],r}function Pe(e){var t,n,o,a,c,i,h;let m=e.species,k=[];for(let t=0;t<m.length;t+=1)k[t]=De(Be(e,m,t));return{c(){t=d("div"),n=d("select"),o=d("option"),a=p("Välj en art inom "),c=p(e.selectedFamily);for(let e=0;e<k.length;e+=1)k[e].c();o.__value=i="Välj en art inom "+e.selectedFamily,o.value=o.__value,void 0===e.selected&&R(()=>e.select_change_handler.call(n)),g(n,"id","species"),g(t,"class","select select-specie svelte-130s37p"),h=[y(n,"change",e.select_change_handler),y(n,"change",e.handleChange)]},m(r,i){l(r,t,i),s(t,n),s(n,o),s(o,a),s(o,c);for(let e=0;e<k.length;e+=1)k[e].m(n,null);_(n,e.selected)},p(e,t){if(e.selectedFamily&&$(c,t.selectedFamily),e.selectedFamily&&i!==(i="Välj en art inom "+t.selectedFamily)&&(o.__value=i),o.value=o.__value,e.species||e.selectedSpecie){let r;for(m=t.species,r=0;r<m.length;r+=1){const o=Be(t,m,r);k[r]?k[r].p(e,o):(k[r]=De(o),k[r].c(),k[r].m(n,null))}for(;r<k.length;r+=1)k[r].d(1);k.length=m.length}e.selected&&_(n,t.selected)},d(e){e&&u(t),f(k,e),r(h)}}}function De(e){var t,n,r,o,a=e.specie+"";return{c(){t=d("option"),n=p(a),t.selected=r=e.specie===e.selectedSpecie,t.__value=o=e.specie,t.value=t.__value},m(e,r){l(e,t,r),s(t,n)},p(e,c){e.species&&a!==(a=c.specie+"")&&$(n,a),(e.species||e.selectedSpecie)&&r!==(r=c.specie===c.selectedSpecie)&&(t.selected=r),e.species&&o!==(o=c.specie)&&(t.__value=o),t.value=t.__value},d(e){e&&u(t)}}}function Ve(t){var n,r=t.selectedFamily&&Pe(t);return{c(){r&&r.c(),n=m()},m(e,t){r&&r.m(e,t),l(e,n,t)},p(e,t){t.selectedFamily?r?r.p(e,t):((r=Pe(t)).c(),r.m(n.parentNode,n)):r&&(r.d(1),r=null)},i:e,o:e,d(e){r&&r.d(e),e&&u(n)}}}function Ie(e,t,n){let r,{selectedFamily:o,selectedSpecie:a}=t,c=[];const{setSpecie:i}=S("specie");return e.$set=e=>{"selectedFamily"in e&&n("selectedFamily",o=e.selectedFamily),"selectedSpecie"in e&&n("selectedSpecie",a=e.selectedSpecie)},e.$$.update=(e={selectedFamily:1})=>{e.selectedFamily&&o&&n("species",c=M.dataTree[o])},{selectedFamily:o,selectedSpecie:a,selected:r,species:c,handleChange:function(){i(r)},select_change_handler:function(){r=v(this),n("selected",r),n("species",c),n("selectedFamily",o),n("selectedFamily",o)}}}class ze extends J{constructor(e){super(),H(this,e,Ie,Ve,a,["selectedFamily","selectedSpecie"])}}const He=[];function Je(t,n=e){let r;const o=[];function c(e){if(a(t,e)&&(t=e,r)){const e=!He.length;for(let e=0;e<o.length;e+=1){const n=o[e];n[1](),He.push(n,t)}if(e){for(let e=0;e<He.length;e+=2)He[e][0](He[e+1]);He.length=0}}}return{set:c,update:function(e){c(e(t))},subscribe:function(a,i=e){const s=[a,i];return o.push(s),1===o.length&&(r=n(c)||e),a(t),()=>{const e=o.indexOf(s);-1!==e&&o.splice(e,1),0===o.length&&(r(),r=null)}}}}const Me=Je({}),Xe=Je(null);function Ge(e){var t,n,o,a,c,i,f,m,k,_,v,b;return{c(){t=d("fieldset"),n=d("button"),o=d("label"),a=p(e.key),i=h(),f=d("textarea"),_=h(),(v=d("button")).textContent="Close",g(o,"for",c=`input_text_${e.key}`),g(n,"class","truncate button-primary-text svelte-1sm3mev"),g(f,"id",m=`input_text_${e.key}`),g(f,"name",e.key),g(f,"class",""),g(f,"rows",12),f.value=k="\n      "+e.$json[e.key]+"\n    ",g(v,"class","close button-primary-text svelte-1sm3mev"),b=[y(n,"click",e.click_handler_1),y(v,"click",e.click_handler_2)]},m(e,r){l(e,t,r),s(t,n),s(n,o),s(o,a),s(t,i),s(t,f),s(t,_),s(t,v)},p(e,t){e.key&&$(a,t.key),e.key&&c!==(c=`input_text_${t.key}`)&&g(o,"for",c),e.key&&m!==(m=`input_text_${t.key}`)&&g(f,"id",m),e.key&&g(f,"name",t.key),(e.$json||e.key)&&k!==(k="\n      "+t.$json[t.key]+"\n    ")&&(f.value=k)},d(e){e&&u(t),r(b)}}}function Ke(e){var t,n,r,o,a,c,i=e.getLabel()+"",f=e.$json[e.key]+"";return{c(){t=d("button"),n=d("label"),r=p(i),o=p("\n    : "),a=p(f),g(t,"class","truncate button-primary-text svelte-1sm3mev"),c=y(t,"click",e.click_handler)},m(e,c){l(e,t,c),s(t,n),s(n,r),s(t,o),s(t,a)},p(e,t){(e.$json||e.key)&&f!==(f=t.$json[t.key]+"")&&$(a,f)},d(e){e&&u(t),c()}}}function Qe(t){var n;function r(e,t){return t.open?Ge:Ke}var o=r(0,t),a=o(t);return{c(){a.c(),n=m()},m(e,t){a.m(e,t),l(e,n,t)},p(e,t){o===(o=r(0,t))&&a?a.p(e,t):(a.d(1),(a=o(t))&&(a.c(),a.m(n.parentNode,n)))},i:e,o:e,d(e){a.d(e),e&&u(n)}}}function Ye(e,t,n){let r,o;c(e,Xe,e=>{n("$openField",r=e)}),c(e,Me,e=>{n("$json",o=e)});let{key:a,open:s=!1}=t;function l(e){i(Xe,r=e)}return e.$set=e=>{"key"in e&&n("key",a=e.key),"open"in e&&n("open",s=e.open)},e.$$.update=(e={$openField:1,key:1})=>{(e.$openField||e.key)&&n("open",s=r===a)},{key:a,open:s,getLabel:function(){return a.replace("_"," ")},handleChange:l,$openField:r,$json:o,click_handler:()=>l(a),click_handler_1:()=>i(Xe,r=null),click_handler_2:()=>i(Xe,r=null)}}class We extends J{constructor(e){super(),H(this,e,Ye,Qe,a,["key","open"])}}function Ze(e){var t,n,o,a,c,i,f,m,_,v,b;return{c(){t=d("fieldset"),n=d("button"),o=d("label"),a=p(e.key),i=h(),f=d("input"),_=h(),(v=d("button")).textContent="Close",g(o,"for",c=`input_text_${e.key}`),g(n,"class","truncate button-primary-text svelte-rqkxgg"),g(f,"type","text"),g(f,"id",m=`input_text_${e.key}`),g(f,"name",e.key),g(f,"class"," svelte-rqkxgg"),g(v,"class","close button-primary-text svelte-rqkxgg"),b=[y(n,"click",e.click_handler_1),y(f,"input",e.input_input_handler),y(v,"click",e.click_handler_2)]},m(r,c){l(r,t,c),s(t,n),s(n,o),s(o,a),s(t,i),s(t,f),k(f,e.$json[e.key]),s(t,_),s(t,v)},p(e,t){e.key&&$(a,t.key),e.key&&c!==(c=`input_text_${t.key}`)&&g(o,"for",c),(e.$json||e.key)&&f.value!==t.$json[t.key]&&k(f,t.$json[t.key]),e.key&&m!==(m=`input_text_${t.key}`)&&g(f,"id",m),e.key&&g(f,"name",t.key)},d(e){e&&u(t),r(b)}}}function et(e){var t,n,r,o,a,c,i=e.getLabel()+"",f=e.$json[e.key]+"";return{c(){t=d("button"),n=d("label"),r=p(i),o=p("\n    : "),a=p(f),g(t,"class","truncate button-primary-text svelte-rqkxgg"),c=y(t,"click",e.click_handler)},m(e,c){l(e,t,c),s(t,n),s(n,r),s(t,o),s(t,a)},p(e,t){(e.$json||e.key)&&f!==(f=t.$json[t.key]+"")&&$(a,f)},d(e){e&&u(t),c()}}}function tt(t){var n;function r(e,t){return t.open?Ze:et}var o=r(0,t),a=o(t);return{c(){a.c(),n=m()},m(e,t){a.m(e,t),l(e,n,t)},p(e,t){o===(o=r(0,t))&&a?a.p(e,t):(a.d(1),(a=o(t))&&(a.c(),a.m(n.parentNode,n)))},i:e,o:e,d(e){a.d(e),e&&u(n)}}}function nt(e,t,n){let r,o;c(e,Xe,e=>{n("$openField",r=e)}),c(e,Me,e=>{n("$json",o=e)});let{key:a,open:s=!1}=t;function l(e){i(Xe,r=e)}return e.$set=e=>{"key"in e&&n("key",a=e.key),"open"in e&&n("open",s=e.open)},e.$$.update=(e={$openField:1,key:1})=>{(e.$openField||e.key)&&n("open",s=r===a)},{key:a,open:s,getLabel:function(){return a.replace("_"," ")},handleChange:l,$openField:r,$json:o,click_handler:()=>l(a),click_handler_1:()=>i(Xe,r=null),input_input_handler:function(){Me.update(e=>(e[a]=this.value,e)),n("key",a)},click_handler_2:()=>i(Xe,r=null)}}class rt extends J{constructor(e){super(),H(this,e,nt,tt,a,["key","open"])}}function ot(e,t,n){const r=Object.create(e);return r.name=t[n],r.each_value=t,r.i=n,r}function at(e){var t,n,o,a,c,i,m,k,_,v,b,j;let x=e.$json[e.key],w=[];for(let t=0;t<x.length;t+=1)w[t]=it(ot(e,x,t));return{c(){t=d("fieldset"),n=d("button"),o=d("label"),a=p(e.key),i=h(),m=d("ul");for(let e=0;e<w.length;e+=1)w[e].c();k=h(),(_=d("button")).textContent="+ Add name",v=h(),(b=d("button")).textContent="Close",g(o,"for",c=`input_text_${e.key}`),g(n,"class","truncate button-primary-text svelte-1kkmgem"),g(m,"class","svelte-1kkmgem"),g(_,"type","button"),g(b,"class","close button-primary-text svelte-1kkmgem"),j=[y(n,"click",e.click_handler_1),y(_,"click",e.handleAdd),y(b,"click",e.click_handler_3)]},m(e,r){l(e,t,r),s(t,n),s(n,o),s(o,a),s(t,i),s(t,m);for(let e=0;e<w.length;e+=1)w[e].m(m,null);s(t,k),s(t,_),s(t,v),s(t,b)},p(e,t){if(e.key&&$(a,t.key),e.key&&c!==(c=`input_text_${t.key}`)&&g(o,"for",c),e.$json||e.key){let n;for(x=t.$json[t.key],n=0;n<x.length;n+=1){const r=ot(t,x,n);w[n]?w[n].p(e,r):(w[n]=it(r),w[n].c(),w[n].m(m,null))}for(;n<w.length;n+=1)w[n].d(1);w.length=x.length}},d(e){e&&u(t),f(w,e),r(j)}}}function ct(e){var t,n,r,o,a,c,i=e.getLabel()+"",f=e.$json[e.key]+"";return{c(){t=d("button"),n=d("label"),r=p(i),o=p("\n    : "),a=p(f),g(t,"class","truncate button-primary-text svelte-1kkmgem"),c=y(t,"click",e.click_handler)},m(e,c){l(e,t,c),s(t,n),s(n,r),s(t,o),s(t,a)},p(e,t){(e.$json||e.key)&&f!==(f=t.$json[t.key]+"")&&$(a,f)},d(e){e&&u(t),c()}}}function it(e){var t,n,o,a,c,i,f;function p(){e.input_input_handler.call(n,e)}function m(){return e.click_handler_2(e)}return{c(){t=d("li"),n=d("input"),a=h(),(c=d("button")).textContent="-",i=h(),g(n,"type","text"),g(n,"id",o=`input_text_${e.name}`),g(n,"class"," svelte-1kkmgem"),g(c,"type","button"),g(c,"class","button-primary-text svelte-1kkmgem"),g(t,"class","svelte-1kkmgem"),f=[y(n,"input",p),y(c,"click",m)]},m(r,o){l(r,t,o),s(t,n),k(n,e.name),s(t,a),s(t,c),s(t,i)},p(t,r){e=r,(t.$json||t.key)&&n.value!==e.name&&k(n,e.name),(t.$json||t.key)&&o!==(o=`input_text_${e.name}`)&&g(n,"id",o)},d(e){e&&u(t),r(f)}}}function st(t){var n;function r(e,t){return t.open?at:ct}var o=r(0,t),a=o(t);return{c(){a.c(),n=m()},m(e,t){a.m(e,t),l(e,n,t)},p(e,t){o===(o=r(0,t))&&a?a.p(e,t):(a.d(1),(a=o(t))&&(a.c(),a.m(n.parentNode,n)))},i:e,o:e,d(e){a.d(e),e&&u(n)}}}function lt(e,t,n){let r,o;c(e,Xe,e=>{n("$openField",r=e)}),c(e,Me,e=>{n("$json",o=e)});let{key:a,open:s=!1}=t;function l(e){i(Me,o[a]=o[a].slice(0,e).concat(o[a].slice(e+1)),o)}function u(e){i(Xe,r=e)}return e.$set=e=>{"key"in e&&n("key",a=e.key),"open"in e&&n("open",s=e.open)},e.$$.update=(e={$openField:1,key:1})=>{(e.$openField||e.key)&&n("open",s=r===a)},{key:a,open:s,getLabel:function(){return a.replace("_"," ")},handleDelete:l,handleChange:u,handleAdd:function(){i(Me,o[a]=[...o[a],""],o)},$openField:r,$json:o,click_handler:()=>u(a),click_handler_1:()=>i(Xe,r=null),input_input_handler:function({name:e,each_value:t,i:r}){t[r]=this.value,n("key",a)},click_handler_2:({i:e})=>l(e),click_handler_3:()=>i(Xe,r=null)}}class ut extends J{constructor(e){super(),H(this,e,lt,st,a,["key","open"])}}function ft(e,t,n){const r=Object.create(e);return r.selectable=t[n],r}function dt(e,t,n){const r=Object.create(e);return r._key=t[n],r.i=n,r}function pt(e){var t,n,o,a,c,i,m,k,_;let v=Object.keys(e.$json[e.key]),b=[];for(let t=0;t<v.length;t+=1)b[t]=$t(dt(e,v,t));return{c(){t=d("fieldset"),n=d("button"),o=d("label"),a=p(e.key),c=h(),i=d("ul");for(let e=0;e<b.length;e+=1)b[e].c();m=h(),(k=d("button")).textContent="Close",g(n,"class","truncate button-primary-text svelte-a3jvw"),g(i,"class","svelte-a3jvw"),g(k,"class","close button-primary-text svelte-a3jvw"),_=[y(n,"click",e.click_handler_1),y(k,"click",e.click_handler_2)]},m(e,r){l(e,t,r),s(t,n),s(n,o),s(o,a),s(t,c),s(t,i);for(let e=0;e<b.length;e+=1)b[e].m(i,null);s(t,m),s(t,k)},p(e,t){if(e.key&&$(a,t.key),e.selectors||e.selectedValue||e.$json||e.key){let n;for(v=Object.keys(t.$json[t.key]),n=0;n<v.length;n+=1){const r=dt(t,v,n);b[n]?b[n].p(e,r):(b[n]=$t(r),b[n].c(),b[n].m(i,null))}for(;n<b.length;n+=1)b[n].d(1);b.length=v.length}},d(e){e&&u(t),f(b,e),r(_)}}}function ht(t){var n,r,o,a,c,i,f=t.getLabel()+"",h=t.getTruncatedValue()+"";return{c(){n=d("button"),r=d("label"),o=p(f),a=p("\n    : "),c=p(h),g(n,"class","truncate button-primary-text svelte-a3jvw"),i=y(n,"click",t.click_handler)},m(e,t){l(e,n,t),s(n,r),s(r,o),s(n,a),s(n,c)},p:e,d(e){e&&u(n),i()}}}function mt(e){var t,n,r;function o(){e.input_input_handler.call(t,e)}return{c(){g(t=d("input"),"type","text"),g(t,"id",n=`input_text_${e._key}`),g(t,"class"," svelte-a3jvw"),r=y(t,"input",o)},m(n,r){l(n,t,r),k(t,e.$json[e.key][e._key])},p(r,o){e=o,(r.$json||r.key)&&t.value!==e.$json[e.key][e._key]&&k(t,e.$json[e.key][e._key]),(r.$json||r.key)&&n!==(n=`input_text_${e._key}`)&&g(t,"id",n)},d(e){e&&u(t),r()}}}function yt(e){var t,n;let o=e.selectors[e._key],a=[];for(let t=0;t<o.length;t+=1)a[t]=gt(ft(e,o,t));function c(){e.select_change_handler.call(t,e)}function i(){return e.change_handler(e)}return{c(){t=d("select");for(let e=0;e<a.length;e+=1)a[e].c();void 0===e.selectedValue[e._key]&&R(c),n=[y(t,"change",c),y(t,"change",i)]},m(n,r){l(n,t,r);for(let e=0;e<a.length;e+=1)a[e].m(t,null);_(t,e.selectedValue[e._key])},p(n,r){if(e=r,n.selectors||n.$json||n.key){let r;for(o=e.selectors[e._key],r=0;r<o.length;r+=1){const c=ft(e,o,r);a[r]?a[r].p(n,c):(a[r]=gt(c),a[r].c(),a[r].m(t,null))}for(;r<a.length;r+=1)a[r].d(1);a.length=o.length}(n.selectedValue||n.$json||n.key)&&_(t,e.selectedValue[e._key])},d(e){e&&u(t),f(a,e),r(n)}}}function gt(e){var t,n,r,o,a,c=e.selectable+"";return{c(){t=d("option"),n=p(c),r=h(),t.selected=o=e.selectable===e.$json[e.key][e._key],t.__value=a=e.selectable,t.value=t.__value},m(e,o){l(e,t,o),s(t,n),s(t,r)},p(e,r){(e.selectors||e.$json||e.key)&&c!==(c=r.selectable+"")&&$(n,c),(e.selectors||e.$json||e.key)&&o!==(o=r.selectable===r.$json[r.key][r._key])&&(t.selected=o),(e.selectors||e.$json||e.key)&&a!==(a=r.selectable)&&(t.__value=a),t.value=t.__value},d(e){e&&u(t)}}}function $t(e){var t,n,r,o,a,c,i=e._key+"";function f(e,t){return t.selectors?yt:mt}var m=f(0,e),y=m(e);return{c(){t=d("li"),n=d("label"),r=p(i),a=h(),y.c(),c=h(),g(n,"for",o=`input_text_${e._key}`)},m(e,o){l(e,t,o),s(t,n),s(n,r),s(t,a),y.m(t,null),s(t,c)},p(e,a){(e.$json||e.key)&&i!==(i=a._key+"")&&$(r,i),(e.$json||e.key)&&o!==(o=`input_text_${a._key}`)&&g(n,"for",o),m===(m=f(0,a))&&y?y.p(e,a):(y.d(1),(y=m(a))&&(y.c(),y.m(t,c)))},d(e){e&&u(t),y.d()}}}function kt(t){var n;function r(e,t){return t.open?pt:ht}var o=r(0,t),a=o(t);return{c(){a.c(),n=m()},m(e,t){a.m(e,t),l(e,n,t)},p(e,t){o===(o=r(0,t))&&a?a.p(e,t):(a.d(1),(a=o(t))&&(a.c(),a.m(n.parentNode,n)))},i:e,o:e,d(e){a.d(e),e&&u(n)}}}function _t(e,t,n){let r,o;c(e,Xe,e=>{n("$openField",r=e)}),c(e,Me,e=>{n("$json",o=e)});let{key:a,open:s=!1,selectors:l}=t,u={};function f(e){i(Xe,r=e)}function d(e){i(Me,o[a][e]=u[e],o)}return e.$set=e=>{"key"in e&&n("key",a=e.key),"open"in e&&n("open",s=e.open),"selectors"in e&&n("selectors",l=e.selectors)},e.$$.update=(e={$openField:1,key:1})=>{(e.$openField||e.key)&&n("open",s=r===a)},{key:a,open:s,selectors:l,selectedValue:u,getLabel:function(){return a.replace("_"," ")},getTruncatedValue:function(){return JSON.stringify(o[a]).replace(/[{}"]/g,"")},handleChange:f,handleSelect:d,$openField:r,$json:o,click_handler:()=>f(a),click_handler_1:()=>i(Xe,r=null),select_change_handler:function({_key:e}){u[e]=v(this),n("selectedValue",u),n("key",a),n("selectors",l)},change_handler:({_key:e})=>d(e),input_input_handler:function({_key:e}){Me.update(t=>(t[a][e]=this.value,t)),n("key",a),n("selectors",l)},click_handler_2:()=>i(Xe,r=null)}}class vt extends J{constructor(e){super(),H(this,e,_t,kt,a,["key","open","selectors"])}}function bt(t){var n,r,o,a,c,i,f,p,m,y,$=new rt({props:{key:"scientific_name"}}),k=new ut({props:{key:"local_names"}}),_=new We({props:{key:"description"}}),v=new We({props:{key:"behaviour"}}),b=new We({props:{key:"habitat"}}),j=new vt({props:{key:"size",selectors:null}}),x=new ut({props:{key:"similar_species"}}),w=new rt({props:{key:"flight_period"}}),S=new vt({props:{key:"red_list",selectors:t.redListSelectors}});return{c(){n=d("div"),$.$$.fragment.c(),r=h(),k.$$.fragment.c(),o=h(),_.$$.fragment.c(),a=h(),v.$$.fragment.c(),c=h(),b.$$.fragment.c(),i=h(),j.$$.fragment.c(),f=h(),x.$$.fragment.c(),p=h(),w.$$.fragment.c(),m=h(),S.$$.fragment.c(),g(n,"class","editors svelte-1s0lx9d")},m(e,t){l(e,n,t),V($,n,null),s(n,r),V(k,n,null),s(n,o),V(_,n,null),s(n,a),V(v,n,null),s(n,c),V(b,n,null),s(n,i),V(j,n,null),s(n,f),V(x,n,null),s(n,p),V(w,n,null),s(n,m),V(S,n,null),y=!0},p:e,i(e){y||(B($.$$.fragment,e),B(k.$$.fragment,e),B(_.$$.fragment,e),B(v.$$.fragment,e),B(b.$$.fragment,e),B(j.$$.fragment,e),B(x.$$.fragment,e),B(w.$$.fragment,e),B(S.$$.fragment,e),y=!0)},o(e){P($.$$.fragment,e),P(k.$$.fragment,e),P(_.$$.fragment,e),P(v.$$.fragment,e),P(b.$$.fragment,e),P(j.$$.fragment,e),P(x.$$.fragment,e),P(w.$$.fragment,e),P(S.$$.fragment,e),y=!1},d(e){e&&u(n),I($),I(k),I(_),I(v),I(b),I(j),I(x),I(w),I(S)}}}function jt(e){var t,n,o=e.$json.scientific_name&&bt(e);return{c(){o&&o.c(),t=m()},m(e,r){o&&o.m(e,r),l(e,t,r),n=!0},p(e,n){n.$json.scientific_name?o?(o.p(e,n),B(o,1)):((o=bt(n)).c(),B(o,1),o.m(t.parentNode,t)):o&&(U={r:0,c:[],p:U},P(o,1,1,()=>{o=null}),U.r||r(U.c),U=U.p)},i(e){n||(B(o),n=!0)},o(e){P(o),n=!1},d(e){o&&o.d(e),e&&u(t)}}}function xt(e,t,n){let r;c(e,Me,e=>{n("$json",r=e)});const o=["Not evaluated","Data deficient","Least Concern","Near threatened","Vulnerable","Endangered","Critically endangered","Extinct in the wild","Extinct"],a=["Yes","No"];return{redListSelectors:{habitats_directive:["No","IV"],red_list_EU27:o,red_list_europe:o,red_list_mediterranean:o,EU27_endemic:a,red_list_europe_endemic:a,trend_europe:["Increasing","Stable","Decreasing"]},$json:r}}class wt extends J{constructor(e){super(),H(this,e,xt,jt,a,[])}}function St(e){var t,n,r;return{c(){t=d("div"),(n=d("button")).textContent="Get JSON",g(n,"class","button-success"),g(t,"class","svelte-lam660"),r=y(n,"click",e.handleClick)},m(e,r){l(e,t,r),s(t,n)},d(e){e&&u(t),r()}}}function Ct(t){var n,r=t.$json.scientific_name&&St(t);return{c(){r&&r.c(),n=m()},m(e,t){r&&r.m(e,t),l(e,n,t)},p(e,t){t.$json.scientific_name?r||((r=St(t)).c(),r.m(n.parentNode,n)):r&&(r.d(1),r=null)},i:e,o:e,d(e){r&&r.d(e),e&&u(n)}}}function Ft(e,t,n){let r;c(e,Me,e=>{n("$json",r=e)});return{handleClick:function(){navigator.permissions.query({name:"clipboard-write"}).then(e=>{"granted"!=e.state&&"prompt"!=e.state||function(e){navigator.clipboard.writeText(e).then((function(){alert("JSON was copied to your clipboard")}),(function(){alert("FAILED")}))}(JSON.stringify(r))})},$json:r}}class Et extends J{constructor(e){super(),H(this,e,Ft,Ct,a,[])}}function Nt(e){var t,n,r=e.$json.scientific_name+"";return{c(){t=d("h2"),n=p(r),g(t,"class","h4 svelte-thdmcf")},m(e,r){l(e,t,r),s(t,n)},p(e,t){e.$json&&r!==(r=t.$json.scientific_name+"")&&$(n,r)},d(e){e&&u(t)}}}function Ot(e){var t,n,r,o,a,c,i,f,p,m,y,$,k,_,v,b=new Ue({}),j=new ze({props:{selectedFamily:e.selectedFamily,selectedSpecie:e.selectedSpecie}}),x=e.$json.scientific_name&&Nt(e),w=new wt({}),S=new Et({});return{c(){t=d("main"),n=d("section"),(r=d("h1")).textContent="Dragonfly API JSON Editor",o=h(),a=d("div"),c=d("div"),b.$$.fragment.c(),i=h(),j.$$.fragment.c(),f=h(),p=d("div"),x&&x.c(),m=h(),y=d("section"),$=d("div"),k=d("div"),w.$$.fragment.c(),_=h(),S.$$.fragment.c(),g(r,"class","h4 svelte-thdmcf"),g(c,"class","col-sm-4"),g(p,"class","col-sm-8"),g(a,"class","row hero svelte-thdmcf"),g(n,"class","container svelte-thdmcf"),g(k,"class","col-sm-12"),g($,"class","row"),g(y,"class","container svelte-thdmcf")},m(e,u){l(e,t,u),s(t,n),s(n,r),s(n,o),s(n,a),s(a,c),V(b,c,null),s(c,i),V(j,c,null),s(a,f),s(a,p),x&&x.m(p,null),s(t,m),s(t,y),s(y,$),s($,k),V(w,k,null),s(k,_),V(S,k,null),v=!0},p(e,t){var n={};e.selectedFamily&&(n.selectedFamily=t.selectedFamily),e.selectedSpecie&&(n.selectedSpecie=t.selectedSpecie),j.$set(n),t.$json.scientific_name?x?x.p(e,t):((x=Nt(t)).c(),x.m(p,null)):x&&(x.d(1),x=null)},i(e){v||(B(b.$$.fragment,e),B(j.$$.fragment,e),B(w.$$.fragment,e),B(S.$$.fragment,e),v=!0)},o(e){P(b.$$.fragment,e),P(j.$$.fragment,e),P(w.$$.fragment,e),P(S.$$.fragment,e),v=!1},d(e){e&&u(t),I(b),I(j),x&&x.d(),I(w),I(S)}}}function At(e,t,n){let r;c(e,Me,e=>{n("$json",r=e)});let o="",a="";return w("family",{setFamily:e=>{n("selectedFamily",o=e),n("selectedSpecie",a=""),Me.set({})}}),w("specie",{setSpecie:e=>{n("selectedSpecie",a=e),Me.set({})}}),e.$$.update=(e={selectedFamily:1,selectedSpecie:1})=>{(e.selectedFamily||e.selectedSpecie)&&o&&a&&Oe({family:o,species:a}).then(e=>Me.set(e))},{selectedFamily:o,selectedSpecie:a,$json:r}}return new class extends J{constructor(e){super(),H(this,e,At,Ot,a,[])}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
