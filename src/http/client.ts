import fetch from 'unfetch';

import ObjectCache from '../object_cache';
import {pluralizeType} from '../lib';
import {OBJ_CACHE_DEFAULT_CACHE_EXPIRY} from '../object_cache';
import {Product, Page, Collection, ShopifyType, ShopifyTypeStr} from '../types'; 
import {SHOPIFY_TYPE_PRODUCT, SHOPIFY_TYPE_COLLECTION, SHOPIFY_TYPE_PAGE} from '../types';

/**
 * TODO: Improve error handling, this is just a placeholder
 * 
 * This function is the default handler for catching errors
 * thrown in our request Promise chains.
 * 
 * @param {Error} err   The error that was thrown
 */
function defaultErrorHandler(err: Error) {
    if (console && console.log) {
        console.log('Failed to read Shopify response\n');
        console.log(err);
    }

    return null;
};

/**
 * This type describes the response container that
 * Shopify responds with in their JSON API. For example,
 * requesting `/products/some-product.json` will return
 * a request looking something like this:
 * 
 *         { "product": {"id": "1234567890", ...} }
 * 
 * This type allows us to describe the type (Generic T)
 * contained inside each of the possible keys.
 */
type VagueResponseContainer<T> = (
    { product: T } | 
    { products: T } | 
    { collection: T } | 
    { page: T });


/**
 * This type describes the configurable options available
 * in the Shopify `Client`.
 */
type ClientOptions = {
    // The domain name of the Shopify store (something.myshopify.com)
    domain: string,

    // The duration until a cached item expires, in seconds
    cacheTimeout?: number,

    // A pre-existing cache instance to warm up with (instead of empty)
    cache?: ObjectCache,
}

/**
 * ..:: Client ::..
 * 
 * The `Client` class is a basic interface between JavaScript
 * and interacting with Shopify's JSON API. By providing a simple
 * cache you can easily access most Shopify objects easily in JS.
 */
export default class Client {
    // The URL to prefix to each request (includes the https://)
    url_prefix: string;

    // The current instance of the Shopify client cache.
    cache: ObjectCache;

    /**
     * Construct a new Shopify client for a particular store.
     * 
     * Parameters:
     *  - domain        The Shopify domain name
     *  - cacheTimeout  The timeout of cached objects (in seconds)
     *  - cache         A pre-existing `ObjectCache` instance
     * 
     * @param {ClientOptions} options   The configurable options for the
     *                                  Shopify-JS client.
     */
    constructor(options: ClientOptions) {
        // Unpack the given configuration options (if any)
        const {
            domain, 
            cacheTimeout = OBJ_CACHE_DEFAULT_CACHE_EXPIRY,
            cache = null,
        } = options;

        // Ensure that a domain name is given and (mostly) valid
        if(!domain || !domain.length || !/[\w\d\-\.]+/.test(domain)) 
            throw new Error(`You must provide the Shopify store's domain name\n` +
                            `\texample: "my-store.myshopify.com"`)

        // Set the pre-existing cache if given, otherwise create a cold cache
        this.cache = cache || new ObjectCache({ cacheTimeout });

        // Create the prefix URL from the domain
        this.url_prefix = `https://${domain}`;
    }

    /**
     * Generates a URL to a JSON Shopify object, most commonly used like so:
     * 
     *      _resolve_path('product', 'example-product');
     *      => "https://example.com/products/example-product.json"
     * 
     * Additional parameters can also be given, in the case for irregular
     * types with varying URL patterns (i.e., blogs and collections).
     * 
     * @param {ShopifyTypeStr}  type    The Shopify type to resolve
     * @param {string}          handle  The item handle to target
     * @param {any[]}           extra   Additional parameters to include in the URL
     * 
     * @return {string}         The resolved URL of the JSON Shopify object
     */
    _resolve_path(type: ShopifyTypeStr, handle: string, ...extra) {
        // Pluralize the Shopify type string (product => products)
        const pluralType = pluralizeType(type);

        // Construct and return the URL
        return '/' + [pluralType, handle, ...extra].join('/') + '.json'; 
    }

    /**
     * Given an array of `handle`s, will return the result of a 
     * `Promise.all()` call, FIFO order.
     * 
     * @param {T[]} handles     The array of item handles to resolve.
     * 
     * @return {Promise<Product<T>>}    Returns a Promise with the result of
     *                                  each Shopify item.
     */
    getProducts<T extends string>(handles: T[]): Promise<Product<T>[]> {
        return Promise.all(handles.map(handle => this.getProduct<T>(handle)));
    }

    /**
     * Given the `handle` of a `Product`, will return a Promise
     * that will resolve to the requested Product. 
     * 
     * When using TypeScript, this function will automatically type 
     * the `Product` with it's string `handle` as the generic. 
     * 
     *   Code:                                  Resulting Type:
     *   -------                                -------
     *   >   client.getProduct('example')       >   Product<"example">
     *      
     * @param   {T}         handle    The handle of the `Product` to resolve
     * 
     * @return  {Promise<Product<T>>} A promise that returns either 
     *                                the Shopify product, or null.
     */
    getProduct<T extends string>(handle: T): Promise<Product<T>> {
        return this.get<Product<T>>(SHOPIFY_TYPE_PRODUCT, handle);
    }

    getCollections<T extends string>(handles: T[]): Promise<Collection<T>[]> {
        return Promise.all(handles.map(handle => this.getCollection<T>(handle)));
    }

    getCollection<T extends string>(handle: T): Promise<Collection<T>> {
        return this.get<Collection<T>>(SHOPIFY_TYPE_COLLECTION, handle);
    }

    getCollectionProducts(handle: string): Promise<Product<string>[]> {
        // The collection type must also retrieve the list of products,
        // which is a separate HTTP request.
        const url = this.url_prefix + this._resolve_path(SHOPIFY_TYPE_COLLECTION, handle, 'products');

        return fetch(url).then(res => (res.json()))
            .then((products: {products: Product<string>[]}) => {
                return products.products;
            }).catch(defaultErrorHandler);
    }

    getPages<T extends string>(handles: T[]): Promise<Page<T>[]> {
        return Promise.all(handles.map((handle) => this.getPage<T>(handle)));
    }

    getPage<T extends string>(handle: T): Promise<Page<T>> {
        return this.get<Page<T>>(SHOPIFY_TYPE_PAGE, handle);
    }

    get<T extends ShopifyType<string>>(type: ShopifyTypeStr, handle: string): Promise<T> {
        const url = this.url_prefix + this._resolve_path(type, handle);
        const cache_result = this.cache.fetch<T>(type, handle);

        console.error(this.cache, [type, handle]);

        if(cache_result) {
            console.warn('CACHE HIT');

            return new Promise((res) => (res(cache_result)));
        }

        return fetch(url)
            .then((res) => (res.json()))
            .then((json: {products: Product<string>[]} | 
                VagueResponseContainer<ShopifyType<string>>) => {

                if(type === SHOPIFY_TYPE_COLLECTION) {
                    return this.getCollectionProducts(handle)
                        .then(products => {
                            const finalResult = {
                                ...json[type],
                                ...{ products },
                            };

                            this.cache.set(type, handle, finalResult);
                            return finalResult;
                        });
                }

                this.cache.set(type, handle, json[type]);
                return json[type];
            }).catch(defaultErrorHandler);
    }
}

