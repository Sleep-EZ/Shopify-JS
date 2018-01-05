/**
 * Entry Point for Browsers
 * ----
 * 
 * Include this file from your webpage to publish the `ShopifyJS`
 * object in the global window context. 
 */

import Client from '../client';
import Cache from '../cache';
import * as Storage from '../storage';
import * as Types from '../types';
import * as Lib from '../lib';


(() => {
    const win = (window as any);

    win.ShopifyJS = win.ShopifyJS || {
        Client,
        Cache,
        Storage,
        Types,
        Lib
    };
})();