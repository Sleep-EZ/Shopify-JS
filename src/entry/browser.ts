/**
 * Entry Point for Browsers
 * ----
 * 
 * Include this file from your webpage to publish the `ShopifyJS`
 * object in the global window context. 
 */

import Client from '../http/client';
import ObjectCache from '../object_cache';
import * as CacheLoader from '../cache_loader';
import * as Types from '../types';
import * as Lib from '../lib';

(() => {
    const win = (window as any);
    win.ShopifyJS = win.ShopifyJS || {
        Client,
        ObjectCache,
        CacheLoader,
        Types,
        Lib
    }
})();