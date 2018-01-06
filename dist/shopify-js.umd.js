!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("localforage")):"function"==typeof define&&define.amd?define(["localforage"],t):"object"==typeof exports?exports.ShopifyJS=t(require("localforage")):e.ShopifyJS=t(e.localforage)}("undefined"!=typeof self?self:this,function(e){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=4)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SHOPIFY_TYPE_PRODUCT="product",t.SHOPIFY_TYPE_COLLECTION="collection",t.SHOPIFY_TYPE_PAGE="page",t.VALID_SHOPIFY_TYPES=[t.SHOPIFY_TYPE_PRODUCT,t.SHOPIFY_TYPE_PAGE,t.SHOPIFY_TYPE_COLLECTION]},function(e,t,r){"use strict";var n=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e};Object.defineProperty(t,"__esModule",{value:!0});var o=r(2),c=r(0);t.OBJ_CACHE_TS_KEY="__ts",t.OBJ_CACHE_DEFAULT_CACHE_EXPIRY=300,t.OBJ_CACHE_DEFAULT_DATA=(u={},u[c.SHOPIFY_TYPE_PRODUCT]={},u[c.SHOPIFY_TYPE_PAGE]={},u[c.SHOPIFY_TYPE_COLLECTION]={},u),t.OBJ_CACHE_DEFAULT_OPTS={cacheTimeout:t.OBJ_CACHE_DEFAULT_CACHE_EXPIRY};var i=function(){function e(e,r){var o=t.OBJ_CACHE_DEFAULT_OPTS;this.options=n({},o,e),this._cache=r||t.OBJ_CACHE_DEFAULT_DATA}return e.prototype.readCache=function(){return n({},this._cache)},e.prototype.writeCache=function(e){this._cache=n({},e)},e.prototype._try_remove_expired_entry=function(e,r){var n=null,i=this.options.cacheTimeout||t.OBJ_CACHE_DEFAULT_CACHE_EXPIRY;return e===c.SHOPIFY_TYPE_PRODUCT?n=this._cache.product:e===c.SHOPIFY_TYPE_PAGE?n=this._cache.page:e===c.SHOPIFY_TYPE_COLLECTION&&(n=this._cache.collection),!!(n&&r in n&&function(e){return(o.getCurrentEpoch()-e)/1e3>i}(n[r][t.OBJ_CACHE_TS_KEY]))&&(delete n[r],!0)},e.prototype.fetch=function(e,t){switch(this._try_remove_expired_entry(e,t),e){case c.SHOPIFY_TYPE_PRODUCT:return this._fetch_product(t);case c.SHOPIFY_TYPE_PAGE:return this._fetch_page(t);case c.SHOPIFY_TYPE_COLLECTION:return this._fetch_collection(t);default:return null}},e.prototype._fetch_product=function(e){return this._cache.product[e]},e.prototype._fetch_page=function(e){return this._cache.page[e]},e.prototype._fetch_collection=function(e){return this._cache.collection[e]},e.prototype.set=function(e,r,i){var u=null;switch(e){case c.SHOPIFY_TYPE_PRODUCT:u=this._cache.product;break;case c.SHOPIFY_TYPE_PAGE:u=this._cache.page;break;case c.SHOPIFY_TYPE_COLLECTION:u=this._cache.collection}u&&(u[r]=n({},i,(s={},s[t.OBJ_CACHE_TS_KEY]=o.getCurrentEpoch(),s)));var s},e}();t.Cache=i;var u},function(e,t,r){"use strict";function n(){return+new Date}function o(e){return e+"s"}Object.defineProperty(t,"__esModule",{value:!0}),t.getCurrentEpoch=n,t.pluralizeType=o},function(e,t,r){"use strict";function n(e,t){function r(e,t){var r={};return Object.keys(e).forEach(function(n){var o=e[n];if(o){var c=o.__ts,i=t.cacheTimeout;(Date.now()-c)/1e3<=i&&(r[n]=o)}}),r}var n=i.OBJ_CACHE_DEFAULT_DATA;return e?Object.assign({},e,{product:r(e.product,t),collection:r(e.collection,t),page:r(e.page,t)}):n}var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(t,"__esModule",{value:!0});var c=r(7),i=r(1),u=function(){function e(e){this.opts=e||i.OBJ_CACHE_DEFAULT_OPTS}return e.prototype.read=function(){return Promise.resolve(i.OBJ_CACHE_DEFAULT_DATA)},e.prototype.write=function(e){return Promise.resolve(!0)},e.DEFAULT_CACHE_KEY_NAME="shopify_js_cache",e}();t.StorageDriver=u;var s=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o(t,e),t.prototype.read=function(){var e=this,t=u.DEFAULT_CACHE_KEY_NAME;return console.log("READ"),c.getItem(t).then(function(t){return t?n(t,e.opts):void 0}).catch(function(e){return console.error(e)})},t.prototype.write=function(e){var t=u.DEFAULT_CACHE_KEY_NAME;return console.log("WRITE",e),c.setItem(t,e).then(function(e){return!0})},t}(u);t.ForageStorageDriver=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(5),o=r.n(n),c=r(1),i=r.n(c),u=r(3),s=(r.n(u),r(0)),a=(r.n(s),r(2));r.n(a);r.d(t,"Client",function(){return o.a}),r.d(t,"Cache",function(){return i.a}),r.d(t,"Storage",function(){return u}),r.d(t,"Types",function(){return s}),r.d(t,"Lib",function(){return a})},function(e,t,r){"use strict";function n(e){return console&&console.log&&(console.log("Failed to read Shopify response\n"),console.log(e)),null}var o=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e};Object.defineProperty(t,"__esModule",{value:!0});var c=r(6),i=r(1),u=r(2),s=r(0),a=r(0),_=r(3),p=function(){function e(e){var t=e.domain,r=e.cacheTimeout,n=void 0===r?i.OBJ_CACHE_DEFAULT_CACHE_EXPIRY:r,o={cacheTimeout:n},c=e.storage,u=void 0===c?new _.StorageDriver(o):c,s=e.cache,a=void 0===s?new i.Cache(o):s;if(!t||!t.length||!/[\w\d\-\.]+/.test(t))throw new Error('You must provide the Shopify store\'s domain name\n\texample: "my-store.myshopify.com"');this.cache=a,this.urlPrefix="https://"+t,this.storage=u||new _.StorageDriver}return e.prototype.read=function(){var e=this;return this.storage.read().then(function(t){return!!t&&(e.cache._cache=t,!0)})},e.prototype.write=function(){return this.storage.write(this.cache._cache)},e.prototype._resolve_path=function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];return"/"+[u.pluralizeType(e),t].concat(r).join("/")+".json"},e.prototype.getProducts=function(e){var t=this;return Promise.all(e.map(function(e){return t.getProduct(e)}))},e.prototype.getProduct=function(e){return this.get(a.SHOPIFY_TYPE_PRODUCT,e)},e.prototype.getCollections=function(e){var t=this;return Promise.all(e.map(function(e){return t.getCollection(e)}))},e.prototype.getCollection=function(e){return this.get(a.SHOPIFY_TYPE_COLLECTION,e)},e.prototype.getCollectionProducts=function(e){var t=this.urlPrefix+this._resolve_path(a.SHOPIFY_TYPE_COLLECTION,e,"products");return c(t).then(function(e){return e.json()}).then(function(e){return e.products}).catch(n)},e.prototype.getPages=function(e){var t=this;return Promise.all(e.map(function(e){return t.getPage(e)}))},e.prototype.getPage=function(e){return this.get(a.SHOPIFY_TYPE_PAGE,e)},e.prototype.get=function(e,t){var r=this;if(-1===s.VALID_SHOPIFY_TYPES.indexOf(e))throw new Error("Refusing to get unknown Shopify type '"+e+"'");var o=this.cache.fetch(e,t);return o?Promise.resolve(o):c(this.urlPrefix+this._resolve_path(e,t)).then(function(e){return e.json()}).then(function(n){return r._processResponse.call(r,e,t,n)}).catch(n)},e.prototype._processResponse=function(e,t,r){function n(r,n){var i=o({},c,{products:r});return n.cache.set(e,t,i),n.storage.write(n.cache._cache),i}var c,i=this;switch(e){case a.SHOPIFY_TYPE_PRODUCT:c=r.product;break;case a.SHOPIFY_TYPE_PAGE:c=r.page;break;case a.SHOPIFY_TYPE_COLLECTION:c=r.collection;break;default:c=null}if(!c)throw new Error("Unable to process Shopify response\n"+c);return this.cache.set(e,t,c),this.storage.write(this.cache._cache),this.getCollectionProducts(t).then(function(e){return n(e,i)})},e}();t.Client=p},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof fetch?fetch.bind():function(e,t){return t=t||{},new Promise(function(r,n){function o(){var e,t=[],r=[],n={};return c.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm,function(o,c,i){t.push(c=c.toLowerCase()),r.push([c,i]),e=n[c],n[c]=e?e+","+i:i}),{ok:1==(c.status/200|0),status:c.status,statusText:c.statusText,url:c.responseURL,clone:o,text:function(){return Promise.resolve(c.responseText)},json:function(){return Promise.resolve(c.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([c.response]))},headers:{keys:function(){return t},entries:function(){return r},get:function(e){return n[e.toLowerCase()]},has:function(e){return e.toLowerCase()in n}}}}var c=new XMLHttpRequest;c.open(t.method||"get",e);for(var i in t.headers)c.setRequestHeader(i,t.headers[i]);c.withCredentials="include"==t.credentials,c.onload=function(){r(o())},c.onerror=n,c.send(t.body)})};t.default=n},function(t,r){t.exports=e}])});