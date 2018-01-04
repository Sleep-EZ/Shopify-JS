import * as Types from './types';
import {Product, Collection, Page} from './types';


type ObjectCacheData = {
    "product": { [handle: string]: Product<any> },
    "collection": { [handle: string]: Collection<any> },
    "page": { [handle: string]: Page<any> },
};

class ObjectCache {
    cache: ObjectCacheData;

    constructor() {
        this.cache = {
            "product": {},
            "collection": {},
            "page": {},
        };
    }

    fetch<T>(type: T, handle: string): T | null {
        return this.cache[handle];
    }

    set(type: Types.ShopifyType, handle: string, value: Object): void {
        this.cache[type][handle] = value;
    }
}

export default ObjectCache;