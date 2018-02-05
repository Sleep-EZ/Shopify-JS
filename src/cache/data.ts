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

import {Collection, GenericShopifyType, Handle, Product, ShopifyTypeEnum} from '../types';

/**
 * This function generates a new [[CacheData]] object. We made this
 * a function so that the newly created [[CacheData]] (<u>and it's
 * children</u>) are **NOT** returned as a reference. All code that
 * creates a new Cache instance should reference this method.
 *
 * We want to ensure that if you want to have multiple stores with
 * different URLs, that their caches should not mix (we test for this
 * as well).
 */
export function generateEmptyCacheData(): CacheData {
  return {
    ids: {},
    handles: {
      [ShopifyTypeEnum.Collection]: {},
      [ShopifyTypeEnum.Page]: {},
      [ShopifyTypeEnum.Variant]: {},
      [ShopifyTypeEnum.Product]: {},
    },
  };
}

/**
 * The [[CacheData]] is the data structure used for caching fetched
 * Shopify objects. Objects are indexed by their Shopify ID (all types
 * in the Shopify platform have an ID), and another index is managed
 * for quickly looking up items by their type and handle.
 *
 * **NOTE:** You should never need to access this object directly.
 * You should always use one of [[Client]]'s common methods that
 * calls `get()`, or cache expiration will not work.
 *
 * **NOTE:** Shopify types can have colliding handles. For example,
 * a [[Product]] with the handle `example`, and a [[Page]] with the
 * same handle, can exist on the same store. So, we must index handles
 * categorized by their type as well.
 *
 * **<u>Object Format:</u>**
 * ```
 * {
 *   ids: {
 *     1: { __type: 'page', id: 1, handle: 'example' }
 *   },
 *   handles: { "page": { "example": 1 } },
 * }
 * ```
 */
export interface CacheData {
  /**
   * An object with the Shopify ID as the key, and the Shopify
   * entity as the value. All Shopify types include an ID.
   */
  ids: CacheData$IDMap;

  /**
   * An index with the key as the item handle, and the value
   * being the ID of the item to resolve.
   */
  handles: {[type: string]: CacheData$Handles};
}

/**
 * Our cache includes an array of **real** values, full
 * JSON representations of Shopify objects). These are accessed
 * by using the IDMap, given a Shopify item ID (variant, product,
 * page, collection) can quickly look up existance.
 *
 * The ID map also allows us to have type-less indexing, with
 * deletion and addition managed by the Client.
 */
export interface CacheData$IDMap { [id: number]: CacheData$Value; }

/**
 * A possible value in the [[CacheData]] element. Contains either
 * a [[Product]], [[Page]], [[Collection]], or `null`.
 */
export type CacheData$Value = GenericShopifyType|null;

/**
 * An object used to quickly look up items by their handle **for a
 * specific type**. One of these objects exists for each Shopify
 * type to prevent accidental collisions between types.
 */
export type CacheData$Handles = {
  [handle: string]: number
};


/**
 * Given a Shopify entity, will index it and its children elements.
 *
 * @param {CacheData}  data  The cache data to augment the indexed data to
 * @param {GenericShopifyType|null} item
 *        The value in the cache can be a Shopify entity, or a null value
 *        if it has expired.
 */
export function indexShopifyElement(
    data: CacheData, item: GenericShopifyType): void {
  // Assign the value, we don't care if it already exists
  data.ids[item.id] = item;

  if ('handle' in item) {
    item = item as Product<Handle>;
    data.handles[item.__type][item.handle] = item.id;
  }

  // Determine if it's a product
  if ('variants' in item) {
    const product = (item as Product<Handle>);
    product.variants.map((item) => indexShopifyElement(data, item));
  }

  // Determine if it's a collection
  if ('products' in item) {
    const collection = (item as Collection<Handle>);
    collection.products.map((item) => indexShopifyElement(data, item));
  }
}

export function rebuildCache(givenValues: CacheData$Value[]): CacheData {
  const newCache = generateEmptyCacheData();

  givenValues.forEach((item: GenericShopifyType|null) => {
    if (!!item) indexShopifyElement(newCache, item);
  });

  return newCache;
}