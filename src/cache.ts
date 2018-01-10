import {getCurrentEpoch, isExpired} from './lib';
import {Collection, Page, Product, ShopifyType, Handle, ShopifyTypeStr, SHOPIFY_TYPE_VARIANT, Variant, Indexable} from './types';
import {SHOPIFY_TYPE_COLLECTION, SHOPIFY_TYPE_PAGE, SHOPIFY_TYPE_PRODUCT} from './types';
import { Array } from 'core-js/library/web/timers';

/**
 * This will be the key that will be suffixed to every
 * complete Shopify cache entry that is saved in the cache.
 *
 * The current UNIX (epoch) timestamp is stored to allow
 * for cached items to expire after a short period of time,
 * ensuring accuracy.
 */
export const CACHE_TS_KEY = '__ts';

/**
 * `OBJ_CACHE_DEFAULT_CACHE_EXPIRY` describes the time
 * in seconds until a record in the cache will be declared
 * out of date, and be removed during access-time.
 */
export const CACHE_DEFAULT_CACHE_EXPIRY = 300;  // 5 minutes

/**
 * This constant is the structure of an empty Shopify-JS
 * cache. Other files reference this constant to ensure
 * continuity.
 */
export const CACHE_DEFAULT_DATA: CacheData = { 
  ids: {}, 
  handles: {},
  values: [],
};

/**
 * Options for the Cache object
 */
export const CACHE_DEFAULT_OPTS: CacheOptions = {
  cacheTimeout: CACHE_DEFAULT_CACHE_EXPIRY,
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
export default class Cache {
  // The options for the Cache object
  options: CacheOptions;

  // The object data store
  _cache: CacheData;

  /**
   * Creates a new Cache instance. Both parameters
   * are optional and will fall back to defaults.
   * 
   * @param {CacheOptions}        options?  Optional: Configurable options
   *                                        for the Cache instance.
   * 
   * @param {CacheData|undefined} cache?    A pre-existing cache object to use,
   *                                        if provided it will be loaded immediately.
   */
  constructor(options?: CacheOptions, cache?: CacheData|undefined) {
    const defaultOpts = CACHE_DEFAULT_OPTS;

    this.options = {...defaultOpts, ...options};
    this._cache = cache || CACHE_DEFAULT_DATA;
  }

  /**
   * Returns a copied instance of the current internal
   * raw cache object. This function is primarily intended
   * to be used by the given `StorageInterface` class.
   *
   * @return {CacheData$Values} A copy of the current cache
   */
  readCache(): CacheData$Values {
    return {...this._cache.values};
  }

  /**
   * Replaces the current cache data instance with a provided
   * one. This function is primarily intended to be used for
   * loading existing cache objects (pre-warmed).
   *
   * @param {CacheData$Values} cache   The object cache to apply
   * @return {void}
   */
  writeCache(cache: CacheData$Values): void {
    const cleanedValues = this._clean_entries(cache);
    const { ids, handles } = this._generate_item_caches(cleanedValues);

    this._cache = {
      ids: ids,
      handles: handles,
      values: cache,
    };
  }

  _clean_entries(data: CacheData$Values): CacheData$CleanValues {
    const cleaned: CacheData$CleanValues = [];
    
    for(var item of data) {
      if (item !== null) cleaned.push(item);
    }

    return cleaned;
  }

  _generate_item_caches(data: (Indexable|null)[]): 
    {ids: CacheData$IDMap, handles: CacheData$Handles} {
    let ids: CacheData$IDMap = {};
    let handles: CacheData$Handles = {};
    let children: Indexable[] = [];

    data.forEach((item, pos) => {
      if(item === null) return;

      if(!('id' in item)) { 
        throw new Error("Encountered an item without an 'id' (not acceptable)"); 
      }

      // The item is already cached
      if(item.id in ids) return;

      const newPosition = children.length;
      children.push(item);

      ids[item.id] = newPosition;

      if('handle' in item) { 
        handles[(item as Product<string>).handle] = newPosition; 
      }

      // The item is a Product
      if('variants' in item) {
        children = (item as Product<string>).variants;
      }

      if('options' in item) {
        children = (item as Product<string>).options;
      }

      // The item is a collection
      if('products' in item) {
        children = (item as Collection<string>).products;
      }

      if(children) {
        const { ids: recursiveIds, handles: recursiveHandles } = this._generate_item_caches(children);


        ids = {...ids, ...recursiveIds};
        handles = {...handles, ...recursiveHandles};
      }
    });

    return { ids, handles };
  }

  /**
   * This function will access the record in the object cache and determine
   * it's validity. If the record has expired, it will delete it and return
   * with `null`.
   * 
   * @param {ShopifyTypeStr}  type    The Shopify type to fetch
   * @param {string}          handle  The handle of the Shopify item
   */
  _try_expire_entry<H extends string>(position: number): ShopifyType<H>|null {
    let typeItems: CacheDataGroup<ShopifyType<string>>|null = null;
    const timeout = this.options.cacheTimeout || CACHE_DEFAULT_CACHE_EXPIRY;

    // The item does not exist
    const item = this._cache.values[position];

    if(!item) return null;

    // The cache item is valid, return immediately
    if (!isExpired(item.__ts, timeout)) return item;

    // The cache item has expired, remove it
    this._cache.values[position] = null;
    return null;
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

    if(!(handle in this._cache.handles)) {
      throw new Error(`Failed to find Product (${handle})`);
    }

    const cachePos = this._cache.handles[handle];
    const cacheData = this._cache.values[cachePos];

    // Check that the record exists
    this._try_expire_entry(cacheData.id);

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

  /**
   * Fetches a product. This is an alias function used
   * to allow the TypeScript interpreter understand each
   * individual type.
   * 
   * @param {H} handle  The product handle to fetch
   */
  _fetch_product<H extends string>(handle: H): Product<H>|null {
    return (this._cache.product[handle] as Product<H>| null);
  }

  /**
   * Fetches a page. This is an alias function used
   * to allow the TypeScript interpreter understand each
   * individual type.
   * 
   * @param {H} handle  The page handle to fetch
   */
  _fetch_page<H extends string>(handle: H): Page<H>|null {
    return (this._cache.page[handle] as Page<H>| null);
  }

  /**
   * Fetches a collection. This is an alias function used
   * to allow the TypeScript interpreter understand each
   * individual type.
   * 
   * @param {H} handle  The collection handle to fetch
   */
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

    // This switch statement exists for TS compiler assistance
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
        // TODO: Handle me better
        break;
    }


    if (itemGroup) {
      itemGroup[handle] = {
        ...value,
        [CACHE_TS_KEY]: getCurrentEpoch(),
      };
    }

    // void
  }
}

/**
 * This type describes an object containing a specific ShopifyType
 */
export type CacheDataGroup<T extends ShopifyType<Handle>> = {
  [id: number]: T
};

export type CacheData = {
  ids: CacheData$IDMap,
  handles: CacheData$Handles,
  values: CacheData$Values,
};

/**
 * Our cache includes an array of **real** values, full
 * JSON representations of Shopify objects). These are accessed
 * by using the IDMap, given a Shopify item ID (variant, product,
 * page, collection) can quickly look up existance.
 * 
 * The ID map also allows us to have type-less indexing, with
 * deletion and addition managed by the Client.
 */
export type CacheData$IDMap = {[id: number]: number};
export type CacheData$Handles = {[handle: string]: number};

// This is a simple array, items are found using the `CacheIDMap`
export type CacheData$CleanValues = ShopifyType<Handle>[];
export type CacheData$Values = CacheData$CleanValues|null[];

export type CacheOptions = {
  cacheTimeout: number,
};