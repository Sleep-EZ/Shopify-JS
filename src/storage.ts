declare function require(name: string);

import { 
    Cache, CacheData, CacheOptions, 
    OBJ_CACHE_DEFAULT_DATA, OBJ_CACHE_DEFAULT_OPTS 
} from "./cache";


function storage_clean_expired(data: CacheData, opts: CacheOptions): CacheData {
    const cleaned = OBJ_CACHE_DEFAULT_DATA;

    Object.keys(data).forEach(typeKey => {
        Object.keys(data[typeKey]).forEach(itemKey => {
            const item = data[typeKey][itemKey];
            const { __ts: timestamp } = item;

            if ((Date.now() - timestamp) <= opts.cacheTimeout) {
                cleaned[typeKey][itemKey] = item;
            } else {
                console.warn('DEL', item);
            }
        });
    });

    return cleaned;
}

export class StorageDriver {
    static DEFAULT_CACHE_KEY_NAME = 'shopify_js_cache';
    opts: CacheOptions;

    constructor(opts?: CacheOptions) {
        this.opts = opts || OBJ_CACHE_DEFAULT_OPTS;
    }

    read(): Promise<CacheData> {
        return Promise.resolve(OBJ_CACHE_DEFAULT_DATA);
    }

    write(data: CacheData): Promise<boolean> {
        return Promise.resolve(true);
    }

}

export class ForageStorageDriver extends StorageDriver {
    read(): Promise<CacheData> {
        const localForage = require('localforage');
        const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

        console.log('READ');

        return localForage.getItem(cacheKey)
            .then(data => storage_clean_expired(data, this.opts))
            .catch(e => console.error(e));
    }

    write(data: CacheData): Promise<boolean> {
        const localForage = require('localforage');
        const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

        console.log("WRITE", data);

        return localForage.setItem(cacheKey, data)
            .then(res => true);
    }

}