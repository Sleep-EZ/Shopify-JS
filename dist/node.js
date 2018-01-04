/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
/**
 * This will be the key that will be suffixed to every
 * complete Shopify cache entry that is saved in the cache.
 *
 * The current UNIX (epoch) timestamp is stored to allow
 * for cached items to expire after a short period of time,
 * ensuring accuracy.
 */
exports.OBJ_CACHE_TS_KEY = '__ts';
exports.OBJ_CACHE_DEFAULT_CACHE_EXPIRY = 300; // 5 minutes
var ObjectCache = /** @class */ (function () {
    function ObjectCache(options, cache) {
        this.options = __assign({ cacheTimeout: exports.OBJ_CACHE_DEFAULT_CACHE_EXPIRY }, options);
        this._cache = cache || (_a = {},
            _a[types_1.SHOPIFY_TYPE_PRODUCT] = {},
            _a[types_1.SHOPIFY_TYPE_PAGE] = {},
            _a[types_1.SHOPIFY_TYPE_COLLECTION] = {},
            _a);
        var _a;
    }
    ObjectCache.prototype._try_remove_expired_entry = function (type, handle) {
        var now = lib_1.getCurrentEpoch();
        var entry = this._cache[type][handle];
        // There is no entry, thus it is not valid / is invalidated
        if (!entry)
            return true;
        if ((now - entry['__ts']) / 1000 > this.options.cacheTimeout) {
            // Delete the entry
            delete this._cache[type][handle];
            console.error([now - entry['__ts']]);
            return true;
        }
        // The cached entry is still valid
        return false;
    };
    /**
     * Search the Shopify cache for a specific item.
     *
     * @param {ShopifyTypeStr}  type    The Shopify type to find
     * @param {string}          handle  The handle of the item we're searching for
     *
     * @return {ShopifyType | null}     Returns the result of the lookup (if it's in the cache)
     */
    ObjectCache.prototype.fetch = function (type, handle) {
        /**
         * Looks up an item to see if it has expired in our cache.
         * In the case it has, we delete the data from the cache
         * before we attempt to access it.
         */
        this._try_remove_expired_entry(type, handle);
        var resolveFn = (_a = {},
            _a[types_1.SHOPIFY_TYPE_PRODUCT] = '_fetch_product',
            _a[types_1.SHOPIFY_TYPE_COLLECTION] = '_fetch_collection',
            _a[types_1.SHOPIFY_TYPE_PAGE] = '_fetch_page',
            _a.default = function () { return (null); },
            _a)[type];
        return this[resolveFn](handle);
        var _a;
    };
    ObjectCache.prototype._fetch_product = function (handle) {
        return this._cache[types_1.SHOPIFY_TYPE_PRODUCT][handle];
    };
    ObjectCache.prototype._fetch_page = function (handle) {
        return this._cache[types_1.SHOPIFY_TYPE_PAGE][handle];
    };
    ObjectCache.prototype._fetch_collection = function (handle) {
        return this._cache[types_1.SHOPIFY_TYPE_COLLECTION][handle];
    };
    /**
     * Add a new item to the object cache, accepts an item type,
     * the handle of the item, and the item's content as an object.
     *
     * @param {ShopifyTypeStr}  type    The Shopify type to add
     * @param {string}          handle  The handle of the item we're searching for
     * @param {ShopifyType}     value   The contents of the Shopify item
     *
     * @return {void}
     */
    ObjectCache.prototype.set = function (type, handle, value) {
        // Replace the value in our cache with the given object, and
        // also suffix our timestamp to the object.
        this._cache[type][handle] = __assign({}, value, (_a = {}, _a[exports.OBJ_CACHE_TS_KEY] = lib_1.getCurrentEpoch(), _a));
        var _a;
    };
    return ObjectCache;
}());
exports.ObjectCache = ObjectCache;
exports.default = ObjectCache;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Return the current unix time (time since epoch)
 *
 * We only need data resolution to the second.
 */
function getCurrentEpoch() {
    return +new Date();
}
exports.getCurrentEpoch = getCurrentEpoch;
function pluralizeType(type) {
    return type + "s";
}
exports.pluralizeType = pluralizeType;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SHOPIFY_TYPE_PRODUCT = 'product';
exports.SHOPIFY_TYPE_COLLECTION = 'collection';
exports.SHOPIFY_TYPE_PAGE = 'page';


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var unfetch_1 = __webpack_require__(4);
var object_cache_1 = __webpack_require__(0);
var lib_1 = __webpack_require__(1);
var object_cache_2 = __webpack_require__(0);
var types_1 = __webpack_require__(2);
/**
 * TODO: Improve error handling, this is just a placeholder
 *
 * This function is the default handler for catching errors
 * thrown in our request Promise chains.
 *
 * @param {Error} err   The error that was thrown
 */
function defaultErrorHandler(err) {
    if (console && console.log) {
        console.log('Failed to read Shopify response\n');
        console.log(err);
    }
    return null;
}
;
/**
 * ..:: Client ::..
 *
 * The `Client` class is a basic interface between JavaScript
 * and interacting with Shopify's JSON API. By providing a simple
 * cache you can easily access most Shopify objects easily in JS.
 */
var Client = /** @class */ (function () {
    /**
     * Construct a new Shopify client for a particular store.
     *
     * Parameters:
     *  - domain        The Shopify domain name
     *  - cacheTimeout  The timeout of cached objects (in seconds)
     *  - cache         A pre-existing `ObjectCache` instance
     *
     * @param {ClientOptions} options   The configurable options for the
     *                                  Shopify-JS client.
     */
    function Client(options) {
        // Unpack the given configuration options (if any)
        var domain = options.domain, _a = options.cacheTimeout, cacheTimeout = _a === void 0 ? object_cache_2.OBJ_CACHE_DEFAULT_CACHE_EXPIRY : _a, _b = options.cache, cache = _b === void 0 ? null : _b;
        // Ensure that a domain name is given and (mostly) valid
        if (!domain || !domain.length || !/[\w\d\-\.]+/.test(domain))
            throw new Error("You must provide the Shopify store's domain name\n" +
                "\texample: \"my-store.myshopify.com\"");
        // Set the pre-existing cache if given, otherwise create a cold cache
        this.cache = cache || new object_cache_1.default({ cacheTimeout: cacheTimeout });
        // Create the prefix URL from the domain
        this.url_prefix = "https://" + domain;
    }
    /**
     * Generates a URL to a JSON Shopify object, most commonly used like so:
     *
     *      _resolve_path('product', 'example-product');
     *      => "https://example.com/products/example-product.json"
     *
     * Additional parameters can also be given, in the case for irregular
     * types with varying URL patterns (i.e., blogs and collections).
     *
     * @param {ShopifyTypeStr}  type    The Shopify type to resolve
     * @param {string}          handle  The item handle to target
     * @param {any[]}           extra   Additional parameters to include in the URL
     *
     * @return {string}         The resolved URL of the JSON Shopify object
     */
    Client.prototype._resolve_path = function (type, handle) {
        var extra = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            extra[_i - 2] = arguments[_i];
        }
        // Pluralize the Shopify type string (product => products)
        var pluralType = lib_1.pluralizeType(type);
        // Construct and return the URL
        return '/' + [pluralType, handle].concat(extra).join('/') + '.json';
    };
    /**
     * Given an array of `handle`s, will return the result of a
     * `Promise.all()` call, FIFO order.
     *
     * @param {T[]} handles     The array of item handles to resolve.
     *
     * @return {Promise<Product<T>>}    Returns a Promise with the result of
     *                                  each Shopify item.
     */
    Client.prototype.getProducts = function (handles) {
        var _this = this;
        return Promise.all(handles.map(function (handle) { return _this.getProduct(handle); }));
    };
    /**
     * Given the `handle` of a `Product`, will return a Promise
     * that will resolve to the requested Product.
     *
     * When using TypeScript, this function will automatically type
     * the `Product` with it's string `handle` as the generic.
     *
     *   Code:                                  Resulting Type:
     *   -------                                -------
     *   >   client.getProduct('example')       >   Product<"example">
     *
     * @param   {T}         handle    The handle of the `Product` to resolve
     *
     * @return  {Promise<Product<T>>} A promise that returns either
     *                                the Shopify product, or null.
     */
    Client.prototype.getProduct = function (handle) {
        return this.get(types_1.SHOPIFY_TYPE_PRODUCT, handle);
    };
    Client.prototype.getCollections = function (handles) {
        var _this = this;
        return Promise.all(handles.map(function (handle) { return _this.getCollection(handle); }));
    };
    Client.prototype.getCollection = function (handle) {
        return this.get(types_1.SHOPIFY_TYPE_COLLECTION, handle);
    };
    Client.prototype.getCollectionProducts = function (handle) {
        // The collection type must also retrieve the list of products,
        // which is a separate HTTP request.
        var url = this.url_prefix + this._resolve_path(types_1.SHOPIFY_TYPE_COLLECTION, handle, 'products');
        return unfetch_1.default(url).then(function (res) { return (res.json()); })
            .then(function (products) {
            return products.products;
        }).catch(defaultErrorHandler);
    };
    Client.prototype.getPages = function (handles) {
        var _this = this;
        return Promise.all(handles.map(function (handle) { return _this.getPage(handle); }));
    };
    Client.prototype.getPage = function (handle) {
        return this.get(types_1.SHOPIFY_TYPE_PAGE, handle);
    };
    Client.prototype.get = function (type, handle) {
        var _this = this;
        var url = this.url_prefix + this._resolve_path(type, handle);
        var cache_result = this.cache.fetch(type, handle);
        console.error(this.cache, [type, handle]);
        if (cache_result) {
            console.warn('CACHE HIT');
            return new Promise(function (res) { return (res(cache_result)); });
        }
        return unfetch_1.default(url)
            .then(function (res) { return (res.json()); })
            .then(function (json) {
            if (type === types_1.SHOPIFY_TYPE_COLLECTION) {
                return _this.getCollectionProducts(handle)
                    .then(function (products) {
                    var finalResult = __assign({}, json[type], { products: products });
                    _this.cache.set(type, handle, finalResult);
                    return finalResult;
                });
            }
            _this.cache.set(type, handle, json[type]);
            return json[type];
        }).catch(defaultErrorHandler);
    };
    return Client;
}());
exports.default = Client;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var index = typeof fetch=='function' ? fetch.bind() : function(url, options) {
	options = options || {};
	return new Promise( function (resolve, reject) {
		var request = new XMLHttpRequest();

		request.open(options.method || 'get', url);

		for (var i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.withCredentials = options.credentials=='include';

		request.onload = function () {
			resolve(response());
		};

		request.onerror = reject;

		request.send(options.body);

		function response() {
			var keys = [],
				all = [],
				headers = {},
				header;

			request.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm, function (m, key, value) {
				keys.push(key = key.toLowerCase());
				all.push([key, value]);
				header = headers[key];
				headers[key] = header ? (header + "," + value) : value;
			});

			return {
				ok: (request.status/200|0) == 1,		// 200-299
				status: request.status,
				statusText: request.statusText,
				url: request.responseURL,
				clone: response,
				text: function () { return Promise.resolve(request.responseText); },
				json: function () { return Promise.resolve(request.responseText).then(JSON.parse); },
				blob: function () { return Promise.resolve(new Blob([request.response])); },
				headers: {
					keys: function () { return keys; },
					entries: function () { return all; },
					get: function (n) { return headers[n.toLowerCase()]; },
					has: function (n) { return n.toLowerCase() in headers; }
				}
			};
		}
	});
};

/* harmony default export */ __webpack_exports__["default"] = (index);


/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __webpack_require__(3);
var object_cache_1 = __webpack_require__(0);
var Types = __webpack_require__(2);
var Lib = __webpack_require__(1);
exports.default = {
    Client: client_1.default,
    ObjectCache: object_cache_1.default,
    Types: Types,
    Lib: Lib
};


/***/ })
/******/ ]);
//# sourceMappingURL=node.js.map