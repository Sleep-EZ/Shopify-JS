import {getCurrentEpoch} from './lib';
import {Collection, Page, Product, SHOPIFY_TYPE_COLLECTION, SHOPIFY_TYPE_PAGE, SHOPIFY_TYPE_PRODUCT, ShopifyType, ShopifyTypeStr} from './types';

/**
 * This will be the key that will be suffixed to every
 * complete Shopify cache entry that is saved in the cache.
 *
 * The current UNIX (epoch) timestamp is stored to allow
 * for cached items to expire after a short period of time,
 * ensuring accuracy.
 */
export const OBJ_CACHE_TS_KEY = '__ts';
export const OBJ_CACHE_DEFAULT_CACHE_EXPIRY = 300;  // 5 minutes
export const OBJ_CACHE_DEFAULT_DATA: CacheData = {
  [SHOPIFY_TYPE_PRODUCT]: {},
  [SHOPIFY_TYPE_PAGE]: {},
  [SHOPIFY_TYPE_COLLECTION]: {},
};
export const OBJ_CACHE_DEFAULT_OPTS: CacheOptions = {
  cacheTimeout: OBJ_CACHE_DEFAULT_CACHE_EXPIRY,
};

export class Cache {
  options: CacheOptions;
  _cache: CacheData;

  constructor(options: CacheOptions, cache?: CacheData|undefined) {
    const defaultOpts = OBJ_CACHE_DEFAULT_OPTS;

    this.options = {...defaultOpts, ...options};
    this._cache = cache || OBJ_CACHE_DEFAULT_DATA;
  }

  /**
   * Returns a copied instance of the current internal
   * raw cache object. This function is primarily intended
   * to be used by the given `StorageInterface` class.
   *
   * @return {CacheData}    A copy of the current cache
   */
  readCache(): CacheData {
    return {...this._cache};
  }

  /**
   * Replaces the current cache data instance with a provided
   * one. This function is primarily intended to be used for
   * loading existing cache objects (pre-warmed).
   *
   * @param {CacheData} cache   The object cache to apply
   * @return {void}
   */
  writeCache(cache: CacheData): void {
    this._cache = {...cache};
  }

  _try_remove_expired_entry(type: ShopifyTypeStr, handle: string) {
    let typeItems: CacheDataGroup<ShopifyType<string>>|null = null;
    const timeout = this.options.cacheTimeout || OBJ_CACHE_DEFAULT_CACHE_EXPIRY;

    const isExpired = (ts: number) =>
        ((getCurrentEpoch() - ts) / 1000 > timeout);

    if (type === SHOPIFY_TYPE_PRODUCT) {
      typeItems = this._cache.product;
    } else if (type === SHOPIFY_TYPE_PAGE) {
      typeItems = this._cache.page;
    } else if (type === SHOPIFY_TYPE_COLLECTION) {
      typeItems = this._cache.collection;
    }

    if (typeItems && handle in typeItems &&
        isExpired(typeItems[handle][OBJ_CACHE_TS_KEY])) {
      delete typeItems[handle];
      return true;
    }

    // There is no entry, thus it is not valid / is invalidated
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
  fetch<H extends string>(type: ShopifyTypeStr, handle: H):
      ShopifyType<H>|null {
    /**
     * Looks up an item to see if it has expired in our cache.
     * In the case it has, we delete the data from the cache
     * before we attempt to access it.
     */

    this._try_remove_expired_entry(type, handle);

    switch (type) {
      case SHOPIFY_TYPE_PRODUCT:
        return this._fetch_product(handle);

      case SHOPIFY_TYPE_PAGE:
        return this._fetch_page(handle);

      case SHOPIFY_TYPE_COLLECTION:
        return this._fetch_collection(handle);

      default:
        return null;
    }
  }

  _fetch_product<H extends string>(handle: H): Product<H>|null {
    return (this._cache.product[handle] as Product<H>| null);
  }

  _fetch_page<H extends string>(handle: H): Page<H>|null {
    return (this._cache.page[handle] as Page<H>| null);
  }

  _fetch_collection<H extends string>(handle: H): Collection<H>|null {
    return (this._cache.collection[handle] as Collection<H>| null);
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
  set<H extends string>(type: ShopifyTypeStr, handle: H, value: ShopifyType<H>):
      void {
    // Replace the value in our cache with the given object, and
    // also suffix our timestamp to the object.
    let itemGroup: CacheDataGroup<ShopifyType<string>>|null = null;

    switch (type) {
      case SHOPIFY_TYPE_PRODUCT:
        itemGroup = this._cache.product;
        break;

      case SHOPIFY_TYPE_PAGE:
        itemGroup = this._cache.page;
        break;

      case SHOPIFY_TYPE_COLLECTION:
        itemGroup = this._cache.collection;
        break;

      default:
        break;
    }


    if (itemGroup) {
      itemGroup[handle] = {
        ...value,
        [OBJ_CACHE_TS_KEY]: getCurrentEpoch(),
      };
    }
  }
}

export type CacheDataGroup<T> = {
  [handle: string]: T
};
export type CacheData = {
  'product': CacheDataGroup<Product<string>>,
  'collection': CacheDataGroup<Collection<string>>,
  'page': CacheDataGroup<Page<string>>,
};

export type CacheOptions = {
  cacheTimeout: number,
};