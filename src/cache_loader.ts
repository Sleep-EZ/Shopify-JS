declare function require(name: string);

const localForage = require('localforage');
import { ObjectCache, ObjectCacheData, ObjectCacheOptions } from './object_cache';

export const DEFAULT_CACHE_KEY_NAME = 'shopify_js_cache';

export function restoreCache(key: string = DEFAULT_CACHE_KEY_NAME, opts?: ObjectCacheOptions) {
    return localForage.getItem(key).then((result: ObjectCacheData | null) => {
        if(!result) return result;

        return new ObjectCache(opts, result);
    });
}

export function writeCache(cache: ObjectCache, key: string = DEFAULT_CACHE_KEY_NAME) {
    return localForage.setItem(key, cache._cache);
}