import { Collection, GenericShopifyType, Handle, Page, Product, ShopifyTypeEnum } from '../types';
import { CacheData, CacheData$Value } from './data';
/**
 * This _internal_ property name is suffixed to each object returned
 * via Shopify-JS. Used by the caching system, determines when a cached
 * object is deemed to be expired and should be re-fetched from Shopify.
 *
 * An example of how this "expires at" date is calculated:
 * ```
 *   __expires = Date.now() + (cacheTimeout * 1000)
 * ```
 *
 * This value is an epoch timestamp in milliseconds. See the MDN documentation
 * for
 * [Date.now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
 * for detailed information about the JS timestamp format.
 */
export declare const CACHE_TS_KEY = "__expires";
/**
 * The default offset in seconds until an element stored in the cache will
 * expire. For more information about cache expiration, view the documentation
 * for the [[Client]] class.
 *
 * @default **300 seconds (5 min.)**
 */
export declare const CACHE_DEFAULT_CACHE_EXPIRY = 300;
/**
 * Configurable options that can be passed to the [[Cache]] instance during
 * creation.
 */
export declare const CACHE_DEFAULT_OPTS: CacheOptions;
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
export declare class Cache {
    options: CacheOptions;
    _cache: CacheData;
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
    constructor(options?: CacheOptions, cache?: CacheData | undefined);
    /**
     * Returns a copied instance of the current internal
     * raw cache object. This function is primarily intended
     * to be used by the given `StorageInterface` class.
     *
     * @return {CacheData$Values} A copy of the current cache
     */
    readCache(): CacheData$Value[];
    /**
     * Replaces the current cache data instance with a provided
     * one. This function is primarily intended to be used for
     * loading existing cache objects (pre-warmed).
     *
     * @param {CacheData$Values} cache   The object cache to apply
     * @return {void}
     */
    writeCache(cache: CacheData$Value[]): void;
    getProduct<H extends Handle>(handle: H): Product<H> | null;
    getCollection<H extends Handle>(handle: H): Collection<H> | null;
    getPage<H extends Handle>(handle: H): Page<H> | null;
    _fetchHandle<H extends Handle>(type: ShopifyTypeEnum, handle: H): GenericShopifyType | null;
    _fetchId(id: number): GenericShopifyType | null;
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
    set(type: ShopifyTypeEnum, value: GenericShopifyType, expires?: number): void;
    /**
     * This function will resolve the item at a given index position, and
     * determine if the value exists (or has been deleted and is null). If the
     * item exists, but has expired. It will set the record at that index to null.
     *
     * @param {number} position   The position of the object in the data cache
     */
    _delete_if_expired(id: number): void;
}
/**
 * Available options for the [[Cache]] that is created for a specific
 * [[Client]] instance.
 *
 * This type is meant to be used internally, as it is actually a subset
 * of options for the [[ClientOptions]] type. When the [[Client]] instance
 * is created, it will automatically determine options that should be passed
 * to the [[Client]].
 */
export interface CacheOptions {
    /**
     * This timeout describes in seconds how long until a fetched Shopify object
     * will expire from the [[Cache]].
     *
     * @default [[CACHE_DEFAULT_CACHE_EXPIRY]]
     */
    cacheTimeout: number;
}
