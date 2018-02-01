"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var fetch = require('unfetch')["default"];
var index_1 = require("./cache/index");
var lib_1 = require("./lib");
var types_1 = require("./types");
var types_2 = require("./types");
var storage_1 = require("./storage");
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
     *  - cache         A pre-existing `Cache` instance
     *  - storage       The storage driver to automatically read/write with
     *
     * @param {ClientOptions} options   The configurable options for the
     *                                  Shopify-JS client.
     */
    function Client(options) {
        // Ensure that a domain name is given and (mostly) valid
        if (!options || Object.keys(options).indexOf('domain') === -1 ||
            !options.domain.length || !/[\w\d\-\.]+/.test(options.domain)) {
            throw new Error("You must provide the Shopify store's domain name\n" +
                "\texample: \"my-store.myshopify.com\"");
        }
        // Unpack the given configuration options (if any)
        var domain = options.domain, _a = options.cacheTimeout, cacheTimeout = _a === void 0 ? index_1.CACHE_DEFAULT_CACHE_EXPIRY : _a;
        var cacheOptions = { cacheTimeout: cacheTimeout };
        var _b = options.storage, storage = _b === void 0 ? new storage_1.StorageDriver(cacheOptions) : _b;
        var _c = options.cache, cache = _c === void 0 ? new index_1.Cache(cacheOptions) : _c;
        // If a pre-warmed cache was given, always use it
        this.cache = cache;
        // Create the prefix URL from the domain
        this.urlPrefix = "https://" + domain;
        // Register the storage driver
        this.storage = storage || new storage_1.StorageDriver();
    }
    Client.prototype.read = function () {
        var _this = this;
        return this.storage.read().then(function (cacheData) {
            if (!cacheData)
                return null;
            _this.cache._cache = index_1.generateEmptyCacheData();
            cacheData.forEach(function (cacheItem) {
                if (!cacheItem)
                    return;
                _this.cache.set(cacheItem.__type, cacheItem);
            });
            // Do *not* return by reference
            return _this.cache._cache.data.slice();
        });
    };
    Client.prototype.write = function () {
        return this.storage.write(this.cache._cache.data);
    };
    /**
     * Generates a URL to a JSON Shopify object, most commonly used like so:
     *
     *      _resolve_path('product', 'example-product');
     *      => "https://example.com/products/example-product.json"
     *
     * Additional parameters can also be given, in the case for irregular
     * types with varying URL patterns (i.e., blogs and collections).
     *
     * @param {ShopifyTypeEnum} type    The Shopify type to resolve
     * @param {string}          handle  The item handle to target
     * @param {string[]}        extra   Additional parameters to include in the URL
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
        return this.get(types_2.SHOPIFY_TYPE_PRODUCT, handle);
    };
    /**
     * Given an array of `handle`s, will return the result of a
     * `Promise.all()` call, FIFO order.
     *
     * @param {T[]} handles     The array of item handles to resolve.
     *
     * @return {Promise<Collection<T>>}    Returns a Promise with the result of
     *                                  each Shopify item.
     */
    Client.prototype.getCollections = function (handles) {
        var _this = this;
        return Promise.all(handles.map(function (handle) { return _this.getCollection(handle); }));
    };
    /**
     * Given the `handle` of a `Collection`, will return a Promise
     * that will resolve to the requested Collection.
     *
     * When using TypeScript, this function will automatically type
     * the `Collection` with it's string `handle` as the generic.
     *
     *   Code:                                  Resulting Type:
     *   -------                                -------
     *   >   client.getCollection('example')    >   Collection<"example">
     *
     * @param   {T} handle      The handle of the `Collection` to resolve
     *
     * @return  {Promise<Collection<T>>} A promise that returns either
     *                                   the Shopify collection, or null.
     */
    Client.prototype.getCollection = function (handle) {
        return this.get(types_2.SHOPIFY_TYPE_COLLECTION, handle);
    };
    /**
     * Retrieves the array of products belonging to a collection
     * with Shopify's JSON API. The actual collection object response
     * only provides the number of products in the collection, and
     * not even the handles of the belonging items. Thus, we have
     * to make a secondary request to retrieve the product list.
     *
     * @param {string} handle   The handle of the `Collection` to
     *                          resolve products for.
     *
     * @return {Promise<Product<string>[]>} Returns a Promise that
     *                          resolves to a list of Product items.
     */
    Client.prototype.getCollectionProducts = function (handle) {
        // The collection type must also retrieve the list of products,
        // which is a separate HTTP request.
        var url = this.urlPrefix +
            this._resolve_path(types_2.SHOPIFY_TYPE_COLLECTION, handle, 'products');
        return fetch(url)
            .then(function (res) { return (res.json()); })
            .then(function (products) {
            return products.products;
        })["catch"](defaultErrorHandler);
    };
    /**
     * Given an array of `handle`s, will return the result of a
     * `Promise.all()` call, FIFO order.
     *
     * @param {T[]} handles     The array of item handles to resolve.
     *
     * @return {Promise<Page<T>>}    Returns a Promise with the result of
     *                                  each Shopify item.
     */
    Client.prototype.getPages = function (handles) {
        var _this = this;
        return Promise.all(handles.map(function (handle) { return _this.getPage(handle); }));
    };
    /**
     * Given the `handle` of a `Page`, will return a Promise
     * that will resolve to the requested Page.
     *
     * When using TypeScript, this function will automatically type
     * the `Page` with it's string `handle` as the generic.
     *
     *   Code:                                  Resulting Type:
     *   -------                                -------
     *   >   client.getPage('example')          >   Page<"example">
     *
     * @param   {T} handle         The handle of the `Page` to resolve
     *
     * @return  {Promise<Page<T>>} A promise that returns either
     *                             the Shopify page, or null.
     */
    Client.prototype.getPage = function (handle) {
        return this.get(types_2.SHOPIFY_TYPE_PAGE, handle);
    };
    /**
     * The primary method for retrieving Shopify items from
     * either the JSON API or our local cache
     *
     * @param   {ShopifyTypeEnum}   type    The Shopify type to target (product, collection, page)
     * @param   {string}            handle  The handle of the Shopify item to resolve
     */
    Client.prototype.get = function (type, handle) {
        var _this = this;
        // Check that the type is known
        if (!Object.values(types_1.ShopifyTypeEnum).includes(type)) {
            throw new Error("Refusing to get unknown Shopify type '" + type + "'");
        }
        // Attempt to retrieve the item from the cache
        var cacheResult;
        switch (type) {
            case types_1.ShopifyTypeEnum.Collection:
                cacheResult = this.cache.getCollection(handle);
                break;
            case types_1.ShopifyTypeEnum.Page:
                cacheResult = this.cache.getPage(handle);
                break;
            case types_1.ShopifyTypeEnum.Product:
                cacheResult = this.cache.getProduct(handle);
                break;
            default:
                cacheResult = null;
        }
        // Return immediately if we hit the cache
        if (cacheResult) {
            return Promise.resolve(cacheResult);
        }
        // Otherwise, request it from Shopify
        return fetch(this.urlPrefix + this._resolve_path(type, handle))
            .then(function (res) { return (res.json()); })
            .then(function (json) {
            return _this._processResponse.call(_this, type, handle, json);
        })["catch"](defaultErrorHandler);
    };
    /**
     * The callback handler for the common Shopify lookup Promise. This
     * will automatically write the new value to the cache, or do
     * additional processing on specific types.
     */
    Client.prototype._processResponse = function (type, handle, json) {
        var _this = this;
        var data;
        switch (type) {
            case types_2.SHOPIFY_TYPE_PRODUCT:
                data = json.product;
                break;
            case types_2.SHOPIFY_TYPE_PAGE:
                data = json.page;
                break;
            case types_2.SHOPIFY_TYPE_COLLECTION:
                data = json.collection;
                break;
            default:
                data = null;
                break;
        }
        if (!data) {
            throw new Error('Unable to process Shopify response\n' + data);
        }
        // Set the value and flush the storage driver
        this.cache.set(type, data);
        this.storage.write(this.cache._cache.data);
        /**
         * This function is a callback handler for the 2nd collection
         * request, and merges the original response with the fully
         * populated product list.
         *
         * @param {Product<string>[]} products  The array of products
         *                            belonging to the collection.
         */
        function mergeCollectionItems(products, client) {
            var finalResult = __assign({}, data, { products: products });
            // We should also cache all of the products we just
            // grabbed! A great opportunity.
            products.forEach(function (product) {
                client.cache.set(types_1.ShopifyTypeEnum.Product, product);
            });
            // Write the merged collection item
            client.cache.set(types_1.ShopifyTypeEnum.Collection, finalResult);
            client.storage.write(client.cache._cache.data);
            return finalResult;
        }
        return this.getCollectionProducts(handle).then(function (products) { return mergeCollectionItems(products, _this); });
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQU8sQ0FBQSxDQUFDO0FBRXpDLHVDQUEwRztBQUMxRyw2QkFBb0M7QUFDcEMsaUNBQStGO0FBQy9GLGlDQUF5RjtBQUN6RixxQ0FBd0M7QUFFeEM7Ozs7Ozs7R0FPRztBQUNILDZCQUE2QixHQUFVO0lBQ3JDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUF1Q0Q7Ozs7OztHQU1HO0FBQ0g7SUFXRTs7Ozs7Ozs7Ozs7T0FXRztJQUNILGdCQUFZLE9BQXNCO1FBQ2hDLHdEQUF3RDtRQUN4RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRSxNQUFNLElBQUksS0FBSyxDQUNYLG9EQUFvRDtnQkFDcEQsdUNBQXFDLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsa0RBQWtEO1FBQzNDLElBQUEsdUJBQU0sRUFBRSx5QkFBeUMsRUFBekMsc0VBQXlDLENBQVk7UUFDcEUsSUFBTSxZQUFZLEdBQUcsRUFBQyxZQUFZLGNB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