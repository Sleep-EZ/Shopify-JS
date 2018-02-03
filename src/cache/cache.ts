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

import {generateEmptyCacheData} from './index';
import {getCurrentEpoch, isExpired} from '../lib';
import {Collection, GenericShopifyType, Handle, Page, Product, ShopifyTypeEnum} from '../types';
import {CacheData, CacheData$Values, indexSingleElement, rebuildCache} from './data';

/**
 * This _internal_ property name is suffixed to each object returned 
 * via Shopify-JS. Used by the caching system, determines when a cached
 * object is deemed to be expired and should be re-fetched from Shopify.
 * 
 * An example of how this is calculated:
 * <pre>
 *   __expires = Date.now() + ([[CACHE_DEFAULT_CACHE_EXPIRY]] * 1000)
 * </pre>
 * 
 * This value is an epoch timestamp in milliseconds. See the MDN documentation
 * for [Date.now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
 * for detailed information about the JS timestamp format.
 */
export const CACHE_TS_KEY = '__expires';

/**
 * The offset in seconds that will be added to the [[CACHE_TS_KEY]] value in
 * each Shopify object. This value determines when the cached object will be
 * declared out of date, and is automatically removed by the cache on access.
 * 
 * @default **300 seconds**
 */
export const CACHE_DEFAULT_CACHE_EXPIRY = 300;  // 5 minutes


/**
 * Configurable options that can be passed to the [[Cache]] instance
 * during creation
 */
export const CACHE_DEFAULT_OPTS: CacheOptions = {
  /**
   * The timeout in seconds, for more documentation see [[CACHE_DEFAULT_CACHE_EXPIRY]].
   * 
   * <pre>const cache = new Cache({ cacheTimeout: 60 }); // 1 minute</pre>
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
  readCache(): CacheData$Values {
    return [...this._cache.data];
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

    const pos = this._cache.handles[type][handle];
    this._delete_if_expired(pos);

    return (this._cache.data[pos] as GenericShopifyType | null);
  }

  _fetchId(id: number): GenericShopifyType|null {
    if (!(id in this._cache.ids)) return null;

    const dataPos = this._cache.ids[id];
    this._delete_if_expired(dataPos);

    return (this._cache.data[dataPos] as GenericShopifyType | null);
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

    const itemWasCreated = indexSingleElement(this._cache, value);

    // If there are no new additions, then this object already exists.
    // Let's update it's value, and keep it's indexes.
    if (!itemWasCreated) {
      // Find the position of the value so we can update it
      const pos = this._cache.ids[value.id];
      this._cache.data[pos] = value;
    }
  }

  /**
   * This function will resolve the item at a given index position, and
   * determine if the value exists (or has been deleted and is null). If the
   * item exists, but has expired. It will set the record at that index to null.
   *
   * @param {number} position   The position of the object in the data cache
   */
  _delete_if_expired(position: number): boolean {
    // The item does not exist
    const item = this._cache.data[position];

    // The item has already been deleted (expired)
    if (item === null) return true;

    // The cache item is valid, return immediately
    if (!isExpired(item.__expires)) return true;

    // The cache item has expired, remove it
    this._cache.data[position] = null;
    return true;
  }
}

export type CacheOptions = {
  cacheTimeout: number,
};