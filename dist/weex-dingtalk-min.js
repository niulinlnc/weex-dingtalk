"use strict";function initEnv(){var n={};return"undefined"!=typeof weex?(n.platform=weex.config.env.platform,"Web"!==n.platform&&(n.appName=weex.config.env.appName)):"function"==typeof callNative?(n.platform=navigator.platform,n.appName=navigator.appName):n.platform="Web","Web"===n.platform?n.isDingtalk=/DingTalk/.test(navigator.userAgent):n.isDingtalk="DingTalk"===n.appName,n}function initRequireModule(){var n=function(n){var e="@weex-module/"+n;return __weex_require__(e)};return"undefined"!=typeof weex&&(n=weex.requireModule),n}function polyfills(){return{env:initEnv(),requireModule:initRequireModule()}}function android_exec(n,e){var i=e.body,t=e.onSuccess,r=e.onFail,a=e.context;n&&"function"==typeof n?n(i,function(n){if(void 0!==n&&n.__status__){var e=n.__status__,i=n.__message__;STATUS_OK===e?t&&t.call(a,i):STATUS_ERROR===e&&r&&r.call(a,i)}else r&&r.call("-1","")}):r&&r.call("-1","")}function ios_exec(n,e){var i=e.body,t=e.onSuccess,r=e.onFail,a=e.context;n&&"function"==typeof n?n(i,function(n){void 0!==n?"0"===n.errorCode?t&&t.call(a,n.result):r&&r.call(a,n.result):r&&r.call("-1","")}):r&&r.call("-1","")}function ios_exec$1(n){var e=window._WebViewJavascriptBridge;if(!e)throw"runtime and bridge are not ready";var i=n.body,t=n.onSuccess,r=n.onFail,a=n.context;e.callHandler("exec",i,function(n){void 0!==n&&("0"===n.errorCode?"function"==typeof t&&t.call(a,n.result):"function"==typeof r&&r.call(a,n.result)),"function"==typeof r&&r.call("-1","")})}function android_exec$1(n){var e=n.body,i=n.onSuccess,t=n.onFail,r=n.context,a=e.plugin,o=e.action,c=e.args;(0,window.WebViewJavascriptBridgeAndroid)(a,o,c,i,t,r)}function runAndroid(){window.WebViewJavascriptBridgeAndroid=window.nuva.require()}function web_exec(n){if(isIOS)window._WebViewJavascriptBridge?ios_exec$1(n):document.addEventListener("_WebViewJavascriptBridgeReady",function(){ios_exec$1(n)},!1);else if(isAndroid){var e=window;e.nuva&&(void 0===e.nuva.isReady||e.nuva.isReady)?(bridgeReady||runAndroid(),android_exec$1(n)):document.addEventListener("runtimeready",function(){bridgeReady||runAndroid(),android_exec$1(n)},!1)}}function exec(n){var e=nativeExec||function(){};"iOS"===platform$2?ios_exec(e,n):"android"===platform$2?android_exec(e,n):web_exec(n)}function toArray(n,e){for(var i=e||0,t=n.length-i,r=new Array(t);t--;)r[t]=n[t+i];return r}function createApi(n,e){return function(i){i||(i={});var t=i.onSuccess,r=i.onFail;delete i.onSuccess,delete i.onFail,delete i.onCancel,exec({body:{plugin:n,action:e,args:i},onSuccess:t,onFail:r})}}function createFuns(n,e){var i=Object.create(null);return e.forEach(function(e){i[e]=createApi(n,e)}),i}function parseJsApis(n){var e=Object.create(null);for(var i in n)for(var t=i.split("."),r=n[i],a=null,o=0,c=t.length;;)if(a){if(c-1===o){a[t[o]]=createFuns(i,r);break}if(a[t[o]])o++;else if(a[t[o]]={},a=a[t[o]],++o>c)break}else{if(1===c){var u=!1,l=e[t[o]],s=createFuns(i,r);for(var f in l)if(l.hasOwnProperty(f)){u=!0;break}if(u)for(var d in s)l[d]=s[d];else e[t[o]]=createFuns(i,r);break}if(e[t[o]]){a=e[t[o]],o++;continue}e[t[o]]={},a=e[t[o]],o++}return e}function rtFunc(n){return function(e){exec({body:{plugin:"runtime",action:n,args:{}},onSuccess:function(n){"function"==typeof e&&e(n)},onFail:function(){},context:null})}}function initDingtalkRequire(n){rtFunc("getModules")(n)}function checkConfigVars(n){var e=Object.keys(n);checks.map(function(n){0===e.filter(function(e){return n===e}).length&&logger.warn("configure : "+n+"is empty")})}function permissionJsApis(n,e,i){if(!e)return void ship.ready(function(){n(null)});ship.ready(function(){var t=ship.apis.runtime.permission,r=e||{},a=i||null;r.onSuccess=function(e){n(null,e)},r.onFail=function(e){"function"==typeof a?a(e):n(e,null)},t.requestJsApis(r)})}function performQueue(){dingtalkQueue&&dingtalkQueue.length>0&&(dingtalkQueue.forEach(function(n){n()}),dingtalkQueue.length=0)}function initDingtalkSDK(){var n={apis:{},config:function(n){function e(e){return n.apply(this,arguments)}return e.toString=function(){return n.toString()},e}(function(n){if(!n)return void logger.warn("config is undefined,you must configure Dingtalk parameters");"production"!==process.env.NODE_ENV&&checkConfigVars(n),dingtalkJsApisConfig=n}),init:function(){dingtalkQueue=[],ship.init(),ship.ready(function(){isReady=ship.isReady,n.apis=ship.apis?ship.apis:{},performQueue()})},ready:function(n){if(!n||"function"!=typeof n)return void logger.warn("callback is undefined");if(isReady)permissionJsApis(n,dingtalkJsApisConfig,dingtalkErrorCb);else{dingtalkQueue&&dingtalkQueue.push(function(n){return function(){permissionJsApis(n,dingtalkJsApisConfig,dingtalkErrorCb)}}(n))}},error:function(n){"function"==typeof n&&(dingtalkErrorCb=n)},EventEmitter:ship.EventEmitter};return n}function installNativeEvent(n){n.on=function(n,e,i){document.addEventListener(n,e,i)},n.off=function(n,e,i){document.removeEventListener(n,e,i)}}function initWebDingtalkSDK(){var n=initDingtalkSDK();return installNativeEvent(n),n}function installNativeEvent$2(n){n.on=ship.on,n.off=ship.off}function initWeexDingtalkSDK(){var n=initDingtalkSDK();return installNativeEvent$2(n),n}var weexInstanceVar=void 0;weexInstanceVar||(weexInstanceVar=polyfills());var weexInstanceVar$1=weexInstanceVar,STATUS_OK="1",STATUS_ERROR="2",platform$3=weexInstanceVar$1.env.platform,isAndroid=null,isIOS=null,bridgeReady=!1;if("Web"===platform$3){var UA=window.navigator.userAgent.toLowerCase();isAndroid=UA&&UA.indexOf("android")>-1,isIOS=UA&&/iphone|ipad|ipod|ios/.test(UA)}var platform$2=weexInstanceVar$1.env.platform,nativeExec=null;"Web"!==platform$2&&(nativeExec=weexInstanceVar$1.requireModule("nuvajs-exec").exec);var cat={},EventEmitter={on:function(n,e){var i=cat[n];i?i.push(e):cat[n]=[],i||cat[n].push(e)},off:function(n,e){var i=cat[n];if(!i)return!1;if(!n&&!e)return cat={},!0;if(n&&!e)return cat[n]=null,!0;for(var t=void 0,r=i.length;r--;)if((t=i[r])===e||t.fun===e){i.splice(r,1);break}return!0},once:function(n,e){function i(){EventEmitter.off(n,i),e.apply(this,arguments)}i.fun=e,EventEmitter.on(n,i)},emit:function(n){if("string"==typeof n){var e=cat[n],i=toArray(arguments,1);if(e)for(var t=0,r=e.length;t<r;t++){var a=e[t];a.apply(this,i)}}}},platform$1=weexInstanceVar$1.env.platform,globalEvent={};"Web"!==platform$1&&(globalEvent=weexInstanceVar$1.requireModule("globalEvent"));var ship={getModules:null,isReady:!1,runtime:{info:rtFunc("info"),_interceptBackButton:rtFunc("interceptBackButton"),_interceptNavTitle:rtFunc("interceptNavTitle"),_recoverNavTitle:rtFunc("recoverNavTitle"),_getModules:rtFunc("getModules")},init:function(){initDingtalkRequire(function(n){n&&(ship.isReady=!0,ship.apis=parseJsApis(n),EventEmitter.emit("__ship_ready__"))})},ready:function(n){ship.isReady?"function"==typeof n&&n():"function"==typeof n&&EventEmitter.once("__ship_ready__",function(){n()})},on:function(n,e){globalEvent.addEventListener(n,function(n){var i={preventDefault:function(){console.warn("当前环境不支持 preventDefault")},detail:n};e.call(this,i)})},off:globalEvent.removeEventListener,EventEmitter:EventEmitter},logger={warn:function(n,e){if(console.warn("[DINGTALK JS SDK Warning]:",n),e)throw e;var i=new Error("WARNING STACK TRACE");console.warn(i.stack)},info:function(n){console.info("[DINGTALK JS SDK INFO]:",n)},error:function(n){console.error("[DINGTALK JS SDK ERROR]:",n)}},checks=["agentId","corpId","timeStamp","nonceStr","signature","jsApiList"],dingtalkJsApisConfig=null,dingtalkQueue=null,dingtalkErrorCb=null,isReady=!1,dingtalkInit=!0,platform=weexInstanceVar$1.env.platform,isDingtalk=weexInstanceVar$1.env.isDingtalk,dingtalkSDK={};if(isDingtalk||logger.warn("can only open the page be Dingtalk Container"),dingtalkInit){switch(dingtalkInit=!1,platform){case"Web":dingtalkSDK=initWebDingtalkSDK();break;default:dingtalkSDK=initWeexDingtalkSDK()}dingtalkSDK.init()}var dingtalkSDK$1=dingtalkSDK;module.exports=dingtalkSDK$1;
//# sourceMappingURL=weex-dingtalk-min.js.map
