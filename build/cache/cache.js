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
var lib_1 = require("../lib");
var types_1 = require("../types");
var data_1 = require("./data");
var index_1 = require("./index");
/**
 * This will be the key that will be suffixed to every
 * complete Shopify cache entry that is saved in the cache.
 *
 * The current UNIX (epoch) timestamp is stored to allow
 * for cached items to expire after a short period of time,
 * ensuring accuracy.
 */
exports.CACHE_TS_KEY = '__expires';
/**
 * `OBJ_CACHE_DEFAULT_CACHE_EXPIRY` describes the time
 * in seconds until a record in the cache will be declared
 * out of date, and be removed during access-time.
 */
exports.CACHE_DEFAULT_CACHE_EXPIRY = 300; // 5 minutes
/**
 * Options for the Cache object
 */
exports.CACHE_DEFAULT_OPTS = {
    cacheTimeout: exports.CACHE_DEFAULT_CACHE_EXPIRY
};
/**
 * The cache object is the foundation of Shopify-JS. It is a simple
 * object store, with items indexed by their Shopify handles (due to
 * their uniqueness on the Shopify platform).
 *
 * Operations done inside the `Cache` object to it's data store is
 * done directly on the data, and does **not** create and return a
 * new Object for every transformation.
 *
 */
var Cache = /** @class */ (function () {
    /**
     * Creates a new Cache instance. Both parameters
     * are optional and will fall back to defaults.
     *
     * @param {CacheOptions}        options?  Optional: Configurable options
     *                                        for the Cache instance.
     *
     * @param {CacheData|undefined} cache?    A pre-existing cache object to use,
     *                                        if provided it will be loaded
     * immediately.
     */
    function Cache(options, cache) {
        var defaultOpts = exports.CACHE_DEFAULT_OPTS;
        this.options = __assign({}, defaultOpts, options);
        this._cache = cache || index_1.generateEmptyCacheData();
    }
    /**
     * Returns a copied instance of the current internal
     * raw cache object. This function is primarily intended
     * to be used by the given `StorageInterface` class.
     *
     * @return {CacheData$Values} A copy of the current cache
     */
    Cache.prototype.readCache = function () {
        return this._cache.data.slice();
    };
    /**
     * Replaces the current cache data instance with a provided
     * one. This function is primarily intended to be used for
     * loading existing cache objects (pre-warmed).
     *
     * @param {CacheData$Values} cache   The object cache to apply
     * @return {void}
     */
    Cache.prototype.writeCache = function (cache) {
        this._cache = data_1.rebuildCache(cache);
    };
    Cache.prototype.getProduct = function (handle) {
        return this._fetchHandle(types_1.ShopifyTypeEnum.Product, handle);
    };
    Cache.prototype.getCollection = function (handle) {
        return this._fetchHandle(types_1.ShopifyTypeEnum.Collection, handle);
    };
    Cache.prototype.getPage = function (handle) {
        return this._fetchHandle(types_1.ShopifyTypeEnum.Page, handle);
    };
    Cache.prototype._fetchHandle = function (type, handle) {
        if (!(handle in this._cache.handles[type]))
            return null;
        var pos = this._cache.handles[type][handle];
        this._delete_if_expired(pos);
        return this._cache.data[pos];
    };
    Cache.prototype._fetchId = function (id) {
        if (!(id in this._cache.ids))
            return null;
        var dataPos = this._cache.ids[id];
        this._delete_if_expired(dataPos);
        return this._cache.data[dataPos];
    };
    /**
     * Add a new item to the object cache, accepts an item type,
     * the handle of the item, and the item's content as an object.
     *
     * @param {ShopifyTypeStr}  type    The Shopify type to add
     * @param {string}          handle  The handle of the item we're searching for
     * @param {GenericShopifyType}     value   The contents of the Shopify item
     *
     * @return {void}
     */
    Cache.prototype.set = function (type, value, expires) {
        // Let's modify the incoming value and give it an expiration time
        var expiresAt = expires || (lib_1.getCurrentEpoch() + (this.options.cacheTimeout * 1000));
        value.__expires = expiresAt;
        value.__type = type;
        var itemWasCreated = data_1.indexSingleElement(this._cache, value);
        // If there are no new additions, then this object already exists.
        // Let's update it's value, and keep it's indexes.
        if (!itemWasCreated) {
            // Find the position of the value so we can update it
            var pos = this._cache.ids[value.id];
            this._cache.data[pos] = value;
        }
    };
    /**
     * This function will resolve the item at a given index position, and
     * determine if the value exists (or has been deleted and is null). If the
     * item exists, but has expired. It will set the record at that index to null.
     *
     * @param {number} position   The position of the object in the data cache
     */
    Cache.prototype._delete_if_expired = function (position) {
        // The item does not exist
        var item = this._cache.data[position];
        // The item has already been deleted (expired)
        if (item === null)
            return true;
        // The cache item is valid, return immediately
        if (!lib_1.isExpired(item.__expires))
            return true;
        // The cache item has expired, remove it
        this._cache.data[position] = null;
        return true;
    };
    return Cache;
}());
exports.Cache = Cache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2FjaGUvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDhCQUFrRDtBQUNsRCxrQ0FBZ0c7QUFDaEcsK0JBQXFGO0FBQ3JGLGlDQUFpRDtBQUVqRDs7Ozs7OztHQU9HO0FBQ1UsUUFBQSxZQUFZLEdBQUcsV0FBVyxDQUFDO0FBRXhDOzs7O0dBSUc7QUFDVSxRQUFBLDBCQUEwQixHQUFHLEdBQUcsQ0FBQyxDQUFFLFlBQVk7QUFHNUQ7O0dBRUc7QUFDVSxRQUFBLGtCQUFrQixHQUFpQjtJQUM5QyxZQUFZLEVBQUUsa0NBQTBCO0NBQ3pDLENBQUM7QUFFRjs7Ozs7Ozs7O0dBU0c7QUFDSDtJQU9FOzs7Ozs7Ozs7O09BVUc7SUFDSCxlQUFZLE9BQXNCLEVBQUUsS0FBMkI7UUFDN0QsSUFBTSxXQUFXLEdBQUcsMEJBQWtCLENBQUM7UUFFdkMsSUFBSSxDQUFDLE9BQU8sZ0JBQU8sV0FBVyxFQUFLLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJLDhCQUFzQixFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILHlCQUFTLEdBQVQ7UUFDRSxNQUFNLENBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQUU7SUFDL0IsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCwwQkFBVSxHQUFWLFVBQVcsS0FBdUI7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCwwQkFBVSxHQUFWLFVBQTZCLE1BQVM7UUFDcEMsTUFBTSxDQUNGLElBQUksQ0FBQyxZQUFZLENBQUksdUJBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUMvQyxDQUFDO0lBQ1osQ0FBQztJQUVELDZCQUFhLEdBQWIsVUFBZ0MsTUFBUztRQUN2QyxNQUFN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