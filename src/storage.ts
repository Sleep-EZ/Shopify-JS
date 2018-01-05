import * as localForage from 'localforage';

import {Cache, CacheData, CacheDataGroup, CacheOptions, OBJ_CACHE_DEFAULT_CACHE_EXPIRY, OBJ_CACHE_DEFAULT_DATA, OBJ_CACHE_DEFAULT_OPTS, OBJ_CACHE_TS_KEY} from './cache';
import {Collection, Expires, Page, Product, ShopifyType, ShopifyTypeStr, VALID_SHOPIFY_TYPES} from './types';

function storage_clean_expired(
    data: CacheData|void, opts: CacheOptions): CacheData {
  const cleaned = OBJ_CACHE_DEFAULT_DATA;
  if (!data) return cleaned;

  function clean_group<T extends ShopifyType<string>>(
      items: CacheDataGroup<T>, opts: CacheOptions): CacheDataGroup<T> {
    const cleaned: CacheDataGroup<T> = {};

    Object.keys(items).forEach((handle: string) => {
      const item: T = items[handle];
      if (!item) return;

      const ts = item.__ts;
      const timeout = opts.cacheTimeout;

      if ((Date.now() - ts) / 1000 <= timeout) {
        cleaned[handle] = item;
      }
    });

    return cleaned;
  }

  return Object.assign({}, data, {
    product: clean_group<Product<string>>(data.product, opts),
    collection: clean_group<Collection<string>>(data.collection, opts),
    page: clean_group<Page<string>>(data.page, opts),
  });
}

export class StorageDriver {
  static DEFAULT_CACHE_KEY_NAME = 'shopify_js_cache';
  opts: CacheOptions;

  constructor(opts?: CacheOptions) {
    this.opts = opts || OBJ_CACHE_DEFAULT_OPTS;
  }

  read(): Promise<CacheData|void> {
    return Promise.resolve(OBJ_CACHE_DEFAULT_DATA);
  }

  write(data: CacheData): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export class ForageStorageDriver extends StorageDriver {
  read(): Promise<CacheData|void> {
    const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

    console.log('READ');

    return localForage.getItem<CacheData|null>(cacheKey)
        .then(
            (data) =>
                ((data) ? storage_clean_expired(data, this.opts) : undefined))
        .catch((e: Error) => console.error(e));
  }

  write(data: CacheData): Promise<boolean> {
    const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

    console.log('WRITE', data);

    return localForage.setItem(cacheKey, data).then((res: {}) => true);
  }
}