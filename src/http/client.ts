import ObjectCache from '../object_cache';
import {Product, Page, Collection, ShopifyType} from '../types';

export default class Client {
    cache: ObjectCache;

    constructor() {
        this.cache = new ObjectCache();
    }

    request_object(type: ShopifyType, handle: string): void {


    }

}

