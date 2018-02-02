import { Cache, CacheData$Values } from './cache/index';
import { StorageDriver } from './storage';
import { Collection, GenericShopifyType, Handle, Page, Product, ShopifyTypeEnum } from './types';
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
export declare type ShopifyInstanceWrapper<H extends Handle> = {
    product: Product<H>;
    products: Array<Product<Handle>>;
    page: Page<H>;
    collection: Collection<H>;
};
/**
 * This type describes the configurable options available
 * in the Shopify `Client`.
 */
export declare type ClientOptions = {
    domain: string;
    cacheTimeout?: number;
    cache?: Cache;
    storage?: StorageDriver;
};
/**
 * ..:: Client ::..
 *
 * The `Client` class is a basic interface between JavaScript
 * and interacting with Shopify's JSON API. By providing a simple
 * cache you can easily access most Shopify objects easily in JS.
 */
export declare class Client {
    urlPrefix: string;
    cache: Cache;
    storage: StorageDriver;
    /**
     * Construct a new Shopify client for a particular store.
     *
     * Parameters:
     *  - domain        The Shopify domain name
     *  - cacheTimeout  The timeout of cached objects (in seconds)
     *  - cache         A pre-existing `Cache` instance
     *  - storage       The storage driver to automatically read/write with
     *
     * @param {ClientOptions} options   The configurable options for the
     *                                  Shopify-JS client.
     */
    constructor(options: ClientOptions);
    read(): Promise<CacheData$Values | null>;
    write(): Promise<boolean>;
    /**
     * Generates a URL to a JSON Shopify object, most commonly used like so:
     *
     *      _resolve_path('product', 'example-product');
     *      => "https://example.com/products/example-product.json"
     *
     * Additional parameters can also be given, in the case for irregular
     * types with varying URL patterns (i.e., blogs and collections).
     *
     * @param {ShopifyTypeEnum} type    The Shopify type to resolve
     * @param {string}          handle  The item handle to target
     * @param {string[]}        extra   Additional parameters to include in the URL
     *
     * @return {string}         The resolved URL of the JSON Shopify object
     */
    _resolve_path(type: ShopifyTypeEnum, handle: Handle, ...extra: string[]): string;
    /**
     * Given an array of `handle`s, will return the result of a
     * `Promise.all()` call, FIFO order.
     *
     * @param {T[]} handles     The array of item handles to resolve.
     *
     * @return {Promise<Product<T>>}    Returns a Promise with the result of
     *                                  each Shopify item.
     */
    getProducts<T extends Handle>(handles: T[]): Promise<Array<Product<T> | null>>;
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
    getProduct<T extends Handle>(handle: T): Promise<Product<T> | null>;
    /**
     * Given an array of `handle`s, will return the result of a
     * `Promise.all()` call, FIFO order.
     *
     * @param {T[]} handles     The array of item handles to resolve.
     *
     * @return {Promise<Collection<T>>}    Returns a Promise with the result of
     *                                  each Shopify item.
     */
    getCollections<T extends Handle>(handles: T[]): Promise<Array<Collection<T> | null>>;
    /**
     * Given the `handle` of a `Collection`, will return a Promise
     * that will resolve to the requested Collection.
     *
     * When using TypeScript, this function will automatically type
     * the `Collection` with it's string `handle` as the generic.
     *
     *   Code:                                  Resulting Type:
     *   -------                                -------
     *   >   client.getCollection('example')    >   Collection<"example">
     *
     * @param   {T} handle      The handle of the `Collection` to resolve
     *
     * @return  {Promise<Collection<T>>} A promise that returns either
     *                                   the Shopify collection, or null.
     */
    getCollection<T extends Handle>(handle: T): Promise<Collection<T> | null>;
    /**
     * Retrieves the array of products belonging to a collection
     * with Shopify's JSON API. The actual collection object response
     * only provides the number of products in the collection, and
     * not even the handles of the belonging items. Thus, we have
     * to make a secondary request to retrieve the product list.
     *
     * @param {string} handle   The handle of the `Collection` to
     *                          resolve products for.
     *
     * @return {Promise<Product<string>[]>} Returns a Promise that
     *                          resolves to a list of Product items.
     */
    getCollectionProducts(handle: string): Promise<Array<Product<Handle>> | null>;
    /**
     * Given an array of `handle`s, will return the result of a
     * `Promise.all()` call, FIFO order.
     *
     * @param {T[]} handles     The array of item handles to resolve.
     *
     * @return {Promise<Page<T>>}    Returns a Promise with the result of
     *                                  each Shopify item.
     */
    getPages<T extends string>(handles: T[]): Promise<Array<Page<T> | null>>;
    /**
     * Given the `handle` of a `Page`, will return a Promise
     * that will resolve to the requested Page.
     *
     * When using TypeScript, this function will automatically type
     * the `Page` with it's string `handle` as the generic.
     *
     *   Code:                                  Resulting Type:
     *   -------                                -------
     *   >   client.getPage('example')          >   Page<"example">
     *
     * @param   {T} handle         The handle of the `Page` to resolve
     *
     * @return  {Promise<Page<T>>} A promise that returns either
     *                             the Shopify page, or null.
     */
    getPage<T extends Handle>(handle: T): Promise<Page<T> | null>;
    /**
     * The primary method for retrieving Shopify items from
     * either the JSON API or our local cache
     *
     * @param   {ShopifyTypeEnum}   type    The Shopify type to target (product, collection, page)
     * @param   {string}            handle  The handle of the Shopify item to resolve
     */
    get<T extends GenericShopifyType>(type: ShopifyTypeEnum, handle: string): Promise<T | null>;
    /**
     * The callback handler for the common Shopify lookup Promise. This
     * will automatically write the new value to the cache, or do
     * additional processing on specific types.
     */
    _processResponse<T extends GenericShopifyType>(type: ShopifyTypeEnum, handle: Handle, json: ShopifyInstanceWrapper<Handle>): Promise<T | null>;
}
