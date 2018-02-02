
const localForage = require('localforage');
import {CacheData$Values, CacheOptions} from './cache/index';
import {CACHE_DEFAULT_OPTS} from './cache/index';
import {isExpired} from './lib';

function clean_expired(data: CacheData$Values|null): CacheData$Values {
  const cleaned: CacheData$Values = [];
  if (!data) return cleaned;

  data.forEach(item => {
    if (item && !isExpired(item.__expires)) {
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
    return Promise.resolve([]);
  }

  write(data: CacheData$Values): Promise<boolean> {
    console.log('WRITE: ' + data.length);  // TODO: Make unused param, used...

    return Promise.resolve(true);
  }
}

export class ForageStorageDriver extends StorageDriver {
  read(): Promise<CacheData$Values|void> {
    const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

    console.log('READ');

    return localForage.getItem(cacheKey)
        .then((data: CacheData$Values|null) => (clean_expired(data)))
        .catch((e: Error) => console.error(e));
  }

  write(data: CacheData$Values): Promise<boolean> {
    const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

    return localForage.setItem(cacheKey, data).then(() => true);
  }
}