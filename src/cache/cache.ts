// Copyright (C) 2018 Sleep EZ USA / Evan Darwin
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import {getCurrentEpoch, isExpired} from '../lib';
import {Collection, GenericShopifyType, Handle, Page, Product, ShopifyTypeEnum} from '../types';

import {CacheData, CacheData$Value, indexShopifyElement, rebuildCache} from './data';
import {generateEmptyCacheData} from './index';

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
export const CACHE_TS_KEY = '__expires';

/**
 * The default offset in seconds until an element stored in the cache will
 * expire. For more information about cache expiration, view the documentation
 * for the [[Client]] class.
 *
 * @default **300 seconds (5 min.)**
 */
export const CACHE_DEFAULT_CACHE_EXPIRY = 300;  // 5 minutes

/**
 * Configurable options that can be passed to the [[Cache]] instance during
 * creation.
 */
export const CACHE_DEFAULT_OPTS: CacheOptions = {
  /**
   * The time until an element in the [[Cache]] expires.
   *
   * @default [[CACHE_DEFAULT_CACHE_EXPIRY]]
   */
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
export class Cache {
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
   *                                        if provided it will be loaded
   * immediately.
   */
  constructor(options?: CacheOptions, cache?: CacheData|undefined) {
    const defaultOpts = CACHE_DEFAULT_OPTS;

    this.options = {...defaultOpts, ...options};
    this._cache = cache || generateEmptyCacheData();
  }

  /**
   * Returns a copied instance of the current internal
   * raw cache object. This function is primarily intended
   * to be used by the given `StorageInterface` class.
   *
   * @return {CacheData$Values} A copy of the current cache
   */
  readCache(): CacheData$Value[] {
    return [...Object.values(this._cache.ids)];
  }

  /**
   * Replaces the current cache data instance with a provided
   * one. This function is primarily intended to be used for
   * loading existing cache objects (pre-warmed).
   *
   * @param {CacheData$Values} cache   The object cache to apply
   * @return {void}
   */
  writeCache(cache: CacheData$Value[]): void {
    this._cache = rebuildCache(cache);
  }

  getProduct<H extends Handle>(handle: H): Product<H>|null {
    return (
        this._fetchHandle<H>(ShopifyTypeEnum.Product, handle) as Product<H>|
        null);
  }

  getCollection<H extends Handle>(handle: H): Collection<H>|null {
    return (
        this._fetchHandle<H>(ShopifyTypeEnum.Collection, handle) as
            Collection<H>|
        null);
  }

  getPage<H extends Handle>(handle: H): Page<H>|null {
    return (
        this._fetchHandle<H>(ShopifyTypeEnum.Page, handle) as Page<H>| null);
  }

  _fetchHandle<H extends Handle>(type: ShopifyTypeEnum, handle: H):
      GenericShopifyType|null {
    if (!(handle in this._cache.handles[type])) return null;

    const id = this._cache.handles[type][handle];
    this._delete_if_expired(id);

    return (this._cache.ids[id] as GenericShopifyType | null);
  }

  _fetchId(id: number): GenericShopifyType|null {
    return this._cache.ids[id] as GenericShopifyType | null;
  }

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
  set(type: ShopifyTypeEnum, value: GenericShopifyType,
      expires?: number): void {
    // Let's modify the incoming value and give it an expiration time
    const expiresAt =
        expires || (getCurrentEpoch() + (this.options.cacheTimeout * 1000));
    value.__expires = expiresAt;
    value.__type = type;

    indexShopifyElement(this._cache, value);
  }

  /**
   * This function will resolve the item at a given index position, and
   * determine if the value exists (or has been deleted and is null). If the
   * item exists, but has expired. It will set the record at that index to null.
   *
   * @param {number} position   The position of the object in the data cache
   */
  _delete_if_expired(id: number): void {
    // The item does not exist
    const item = this._cache.ids[id];

    // The item has already been deleted (expired)
    if (item === null) return;

    // The cache item is valid, return immediately
    if (!isExpired(item.__expires)) return;

    // The cache item has expired, remove it
    this._cache.ids[id] = null;
    return;
  }
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