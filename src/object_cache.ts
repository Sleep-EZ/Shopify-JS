import * as Types from './types';
import {getCurrentEpoch} from './lib';
import {
    Product, Collection, Page, 
    ShopifyTypeStr, ShopifyType, 
    SHOPIFY_TYPE_PRODUCT, 
    SHOPIFY_TYPE_COLLECTION, 
    SHOPIFY_TYPE_PAGE
} from './types';

/**
 * This will be the key that will be suffixed to every
 * complete Shopify cache entry that is saved in the cache.
 * 
 * The current UNIX (epoch) timestamp is stored to allow
 * for cached items to expire after a short period of time,
 * ensuring accuracy.
 */
export const OBJ_CACHE_TS_KEY = '__ts';
export const OBJ_CACHE_DEFAULT_CACHE_EXPIRY = 300; // 5 minutes

export class ObjectCache {
    options: ObjectCacheOptions;
    _cache: ObjectCacheData;

    constructor(options: ObjectCacheOptions, cache?: ObjectCacheData | undefined) {
        this.options = {
            cacheTimeout: OBJ_CACHE_DEFAULT_CACHE_EXPIRY,
            ...options,
        }

        this._cache = cache || {
            [SHOPIFY_TYPE_PRODUCT]: {},
            [SHOPIFY_TYPE_PAGE]: {},
            [SHOPIFY_TYPE_COLLECTION]: {},
        };
    }

    _try_remove_expired_entry(type: ShopifyTypeStr, handle: string) {
        const now = getCurrentEpoch();
        const entry = this._cache[type][handle];

        // There is no entry, thus it is not valid / is invalidated
        if(!entry) return true;

        if((now - entry['__ts'])/1000 > this.options.cacheTimeout) {
            // Delete the entry
            delete this._cache[type][handle];

            console.error([now - entry['__ts']]);

            return true;
        }

        // The cached entry is still valid
        return false;
    }

    /**
     * Search the Shopify cache for a specific item.
     * 
     * @param {ShopifyTypeStr}  type    The Shopify type to find
     * @param {string}          handle  The handle of the item we're searching for
     * 
     * @return {ShopifyType | null}     Returns the result of the lookup (if it's in the cache)
     */
    fetch<T>(type: ShopifyTypeStr, handle: string): T | null {
        /**
         * Looks up an item to see if it has expired in our cache.
         * In the case it has, we delete the data from the cache
         * before we attempt to access it.
         */
        this._try_remove_expired_entry(type, handle);

        const resolveFn = {
            [SHOPIFY_TYPE_PRODUCT]: '_fetch_product',
            [SHOPIFY_TYPE_COLLECTION]: '_fetch_collection',
            [SHOPIFY_TYPE_PAGE]: '_fetch_page',
            default: () => (null),
        }[type];

        return this[resolveFn](handle);
    }

    _fetch_product(handle: string): Product<string> | null {
        return this._cache[SHOPIFY_TYPE_PRODUCT][handle];
    }

    _fetch_page(handle: string): Page<string> | null {
        return this._cache[SHOPIFY_TYPE_PAGE][handle];
    }

    _fetch_collection(handle: string): Collection<string> | null {
        return this._cache[SHOPIFY_TYPE_COLLECTION][handle];
    }

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
    set(type: Types.ShopifyTypeStr, handle: string, value: ShopifyType<string>): void {
        // Replace the value in our cache with the given object, and
        // also suffix our timestamp to the object.
        this._cache[type][handle] = {
            ...value,
            [OBJ_CACHE_TS_KEY]: getCurrentEpoch(),
        };
    }
}

export type ObjectCacheData = {
    "product": { [handle: string]: Product<string> },
    "collection": { [handle: string]: Collection<string> },
    "page": { [handle: string]: Page<string> },
};

export type ObjectCacheOptions = {
    cacheTimeout?: number,
}

export default ObjectCache;