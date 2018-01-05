const fetch = require('unfetch');

import {Cache, OBJ_CACHE_DEFAULT_CACHE_EXPIRY} from './cache';
import {pluralizeType} from './lib';
import {Product, Page, Collection, ShopifyType, ShopifyTypeStr, VALID_SHOPIFY_TYPES} from './types';
import {SHOPIFY_TYPE_PRODUCT, SHOPIFY_TYPE_COLLECTION, SHOPIFY_TYPE_PAGE} from './types';
import {StorageDriver} from './storage';

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
}

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
type ShopifyInstanceWrapper<H> = {
  product: Product<H>,
  products: Array<Product<string>>,
  page: Page<H>,
  collection: Collection<H>,
};


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
  cache?: Cache,

  // Storage driver
  storage?: StorageDriver,
};

/**
 * ..:: Client ::..
 *
 * The `Client` class is a basic interface between JavaScript
 * and interacting with Shopify's JSON API. By providing a simple
 * cache you can easily access most Shopify objects easily in JS.
 */
export class Client {
  // The URL to prefix to each request (includes the https://)
  urlPrefix: string;

  // The current instance of the Shopify client cache.
  cache: Cache;

  // The storage driver instance for reading / writing
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
  constructor(options: ClientOptions) {
    // Unpack the given configuration options (if any)
    const {domain, cacheTimeout = OBJ_CACHE_DEFAULT_CACHE_EXPIRY} = options;

    const cacheOptions = {cacheTimeout};
    const {storage = new StorageDriver(cacheOptions)} = options;
    const {cache = new Cache(cacheOptions)} = options;

    // Ensure that a domain name is given and (mostly) valid
    if (!domain || !domain.length || !/[\w\d\-\.]+/.test(domain)) {
      throw new Error(
          `You must provide the Shopify store's domain name\n` +
          `\texample: "my-store.myshopify.com"`);
    }

    // If a pre-warmed cache was given, always use it
    this.cache = cache;

    // Create the prefix URL from the domain
    this.urlPrefix = `https://${domain}`;

    // Register the storage driver
    this.storage = storage || new StorageDriver();
  }

  read(): Promise<boolean> {
    return this.storage.read().then(cacheData => {
      if (!cacheData) return false;

      this.cache._cache = cacheData;
      return true;
    });
  }

  write(): Promise<boolean> {
    return this.storage.write(this.cache._cache);
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
   * @param {string[]}        extra   Additional parameters to include in the URL
   *
   * @return {string}         The resolved URL of the JSON Shopify object
   */
  _resolve_path(type: ShopifyTypeStr, handle: string, ...extra: string[]) {
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
  getProducts<T extends string>(handles: T[]): Promise<Array<Product<T>>> {
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
    return (
        this.get<Product<T>>(SHOPIFY_TYPE_PRODUCT, handle) as
        Promise<Product<T>>);
  }

  /**
   * Given an array of `handle`s, will return the result of a
   * `Promise.all()` call, FIFO order.
   *
   * @param {T[]} handles     The array of item handles to resolve.
   *
   * @return {Promise<Collection<T>>}    Returns a Promise with the result of
   *                                  each Shopify item.
   */
  getCollections<T extends string>(handles: T[]):
      Promise<Array<Collection<T>>> {
    return Promise.all(handles.map(handle => this.getCollection<T>(handle)));
  }

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
  getCollection<T extends string>(handle: T): Promise<Collection<T>> {
    return (
        this.get<Collection<T>>(SHOPIFY_TYPE_COLLECTION, handle) as
        Promise<Collection<T>>);
  }

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
  getCollectionProducts(handle: string): Promise<Array<Product<string>>> {
    // The collection type must also retrieve the list of products,
    // which is a separate HTTP request.
    const url = this.urlPrefix +
        this._resolve_path(SHOPIFY_TYPE_COLLECTION, handle, 'products');

    return fetch(url)
        .then((res: Response) => (res.json()))
        .then((products: {products: Array<Product<string>>}) => {
          return products.products;
        })
        .catch(defaultErrorHandler);
  }

  /**
   * Given an array of `handle`s, will return the result of a
   * `Promise.all()` call, FIFO order.
   *
   * @param {T[]} handles     The array of item handles to resolve.
   *
   * @return {Promise<Page<T>>}    Returns a Promise with the result of
   *                                  each Shopify item.
   */
  getPages<T extends string>(handles: T[]): Promise<Array<Page<T>>> {
    return Promise.all(handles.map((handle) => this.getPage<T>(handle)));
  }

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
  getPage<T extends string>(handle: T): Promise<Page<T>> {
    return (this.get<Page<T>>(SHOPIFY_TYPE_PAGE, handle) as Promise<Page<T>>);
  }

  /**
   * The primary method for retrieving Shopify items from
   * either the JSON API or our local cache
   *
   * @param   {ShopifyTypeStr}    type    The Shopify type to target (product, collection, page)
   * @param   {string}            handle  The handle of the Shopify item to resolve
   */
  get<T extends ShopifyType<string>>(type: ShopifyTypeStr, handle: string):
      Promise<ShopifyType<string>> {
    // Check that the type is known
    if (VALID_SHOPIFY_TYPES.indexOf(type) === -1) {
      throw new Error(`Refusing to get unknown Shopify type '${type}'`);
    }

    // Attempt to retrieve the item from the cache
    const cacheResult = this.cache.fetch(type, handle);

    // Return immediately if we hit the cache
    if (cacheResult) {
      return Promise.resolve(cacheResult);
    }

    // Otherwise, request it from Shopify
    return fetch(this.urlPrefix + this._resolve_path(type, handle))
        .then((res: Response) => (res.json()))
        .then(
            (json: ShopifyInstanceWrapper<T>) =>
                this._processResponse.call(this, type, handle, json))
        .catch(defaultErrorHandler);
  }

  /**
   * The callback handler for the common Shopify lookup Promise. This
   * will automatically write the new value to the cache, or do
   * additional processing on specific types.
   *
   * @param {ShopifyTypeStr}type
   * @param {string}handle
   * @param {ShopifyInstanceWrapper<ShopifyType<string>>} json
   */
  _processResponse<H extends string>(
      type: ShopifyTypeStr, handle: H, json: ShopifyInstanceWrapper<H>) {
    let data: ShopifyType<H>|null;

    switch (type) {
      case SHOPIFY_TYPE_PRODUCT:
        data = json.product;
        break;

      case SHOPIFY_TYPE_PAGE:
        data = json.page;
        break;

      case SHOPIFY_TYPE_COLLECTION:
        data = json.collection;
        break;

      default:
        data = null;
        break;
    }

    if (!data) {
      throw new Error('Unable to process Shopify response\n' + data);
    }

    // Set the value and flush the storage driver
    this.cache.set(type, handle, data);
    this.storage.write(this.cache._cache);

    /**
     * This function is a callback handler for the 2nd collection
     * request, and merges the original response with the fully
     * populated product list.
     *
     * @param {Product<string>[]} products  The array of products
     *                            belonging to the collection.
     */
    function mergeCollectionItems(
        products: Array<Product<string>>, client: Client): Collection<H> {
      const finalResult: Collection<H> = {
        ...(data as Collection<H>),
        products,
      };

      client.cache.set(type, handle, finalResult);
      client.storage.write(client.cache._cache);

      return finalResult;
    }

    return this.getCollectionProducts(handle).then(
        (products) => mergeCollectionItems(products, this));
  }
}