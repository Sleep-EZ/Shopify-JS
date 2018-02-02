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
 * This constant is the structure of an empty Shopify-JS
 * cache. Other files reference this constant to ensure
 * continuity.
 */
export function generateEmptyCacheData(): CacheData {
  return {
    ids: {},
    data: [],
    handles: {
      [ShopifyTypeEnum.Collection]: {},
      [ShopifyTypeEnum.Page]: {},
      [ShopifyTypeEnum.Variant]: {},
      [ShopifyTypeEnum.Product]: {},
    },
  };
}

export type CacheData = {
  ids: CacheData$IDMap,
  handles: {[type: string]: CacheData$Handles},
  data: Array<GenericShopifyType|null>,
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
export type CacheData$IDMap = {
  [id: number]: number
};
export type CacheData$Handles = {
  [handle: string]: number
};

// This is a simple array, items are found using the `CacheIDMap`
export type CacheData$CleanValues = GenericShopifyType[];
export type CacheData$Values = Array<GenericShopifyType|null>;


export function indexSingleElement(
    data: CacheData, item: GenericShopifyType): boolean {
  const ids = data.ids;
  const type = item.__type;
  const nextIndex = data.data.length;
  let wasCreated = false;

  if (!(item.id in ids)) {
    ids[item.id] = nextIndex;
    data.data.push(item);
    wasCreated = true;
  }

  if ('handle' in item) {
    const handle = (item as Product<Handle>).handle;

    if (!(handle in data.handles[type])) {
      data.handles[type][handle] = ids[item.id];
    }
  }

  // Determine if it's a product
  if ('variants' in item) {
    const product = (item as Product<Handle>);

    product.variants.forEach(variant => {
      const variantId = variant.id;
      const newPos = ids[variantId] || data.data.length;

      if (!(variantId in ids)) {
        ids[variantId] = newPos;
        data.data.push(variant);
      } else {
        data.data[newPos] = variant;
      }
    });
  }

  // Determine if it's a collection
  if ('products' in item) {
    const collection = (item as Collection<Handle>);

    collection.products.forEach(product => {
      const productId = product.id;
      const productHandle = product.handle;
      const nextCacheIndex = data.data.length;

      if (!(productId in ids)) {
        data.ids[productId] = nextCacheIndex;
        data.data.push(product);
      }

      if (!(productHandle in data.handles[ShopifyTypeEnum.Product])) {
        data.handles[ShopifyTypeEnum.Product][productHandle] = nextCacheIndex;
      }
    });
  }

  return wasCreated;
}

export function rebuildCache(givenValues: CacheData$Values): CacheData {
  const newCache = generateEmptyCacheData();

  givenValues.forEach((item: GenericShopifyType|null) => {
    if (!!item) indexSingleElement(newCache, item);
  });

  return newCache;
}