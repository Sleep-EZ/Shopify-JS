import * as localForage from 'localforage';

import Cache, {CacheData, CacheDataGroup, CacheOptions, CacheData$Values} from './cache';
import {CACHE_DEFAULT_CACHE_EXPIRY, CACHE_DEFAULT_DATA, 
        CACHE_DEFAULT_OPTS, CACHE_TS_KEY } from './cache';
import {Collection, Expires, Page, Product, 
        ShopifyType, ShopifyTypeStr, VALID_SHOPIFY_TYPES} from './types';
import { isExpired } from './lib';

function clean_expired(data: CacheData$Values, opts: CacheOptions): CacheData$Values {
  let cleaned: CacheData$Values = [];

  data.forEach(item => {
    if(!isExpired(item.__ts, opts.cacheTimeout)) {
      cleaned.push(item);
    }
  });

  return cleaned;
}


export class StorageDriver {
  static DEFAULT_CACHE_KEY_NAME = 'shopify_js_cache';
  opts: CacheOptions;

  constructor(opts?: CacheOptions) {
    this.opts = opts || CACHE_DEFAULT_OPTS;
  }

  read(): Promise<CacheData$Values|void> {
    return Promise.resolve(CACHE_DEFAULT_DATA.values);
  }

  write(data: CacheData$Values): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export class ForageStorageDriver extends StorageDriver {
  read(): Promise<CacheData$Values|void> {
    const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

    console.log('READ');

    return localForage.getItem<CacheData$Values|null>(cacheKey)
        .then((data) => ((data) 
          ? clean_expired(data, this.opts) 
          : undefined))
        .catch((e: Error) => 
          console.error(e));
  }

  write(data: CacheData$Values): Promise<boolean> {
    const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

    return localForage.setItem(cacheKey, data).then((res: {}) => true);
  }
}