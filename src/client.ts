// Copyright (C) 2018 Sleep EZ USA / Evan Darwin
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import * as fetch from 'isomorphic-fetch';

import {Cache, CACHE_DEFAULT_CACHE_EXPIRY, CacheData$Values, generateEmptyCacheData} from './cache/index';
import {pluralizeType} from './lib';
import {StorageDriver} from './storage';
import {Collection, GenericShopifyType, Handle, Page, Product, ShopifyTypeEnum} from './types';

/**
 * TODO: Improve error handling, this is just a placeholder
 *
 * This function is the default handler for catching errors
 * thrown in our request Promise chains.
 *
 * @param {Error} err   The error that was thrown
 */
function defaultErrorHandler(err: Error) {
  if (window.console && console.error) {
    console.error(err);
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
export type ShopifyInstanceWrapper<H extends Handle> = {
  product: Product<H>,
  products: Array<Product<Handle>>,
  page: Page<H>,
  collection: Collection<H>,
};


/**
 * This type describes the configurable options available
 * in the Shopify `Client`.
 */
export type ClientOptions = {
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
    // Ensure that a domain name is given and (mostly) valid
    if (!options || Object.keys(options).indexOf('domain') === -1 ||
        !options.domain.length || !/[\w\d\-\.]+/.test(options.domain)) {
      throw new Error(
          `You must provide the Shopify store's domain name\n` +
          `\texample: "my-store.myshopify.com"`);
    }

    // Unpack the given configuration options (if any)
    const {domain, cacheTimeout = CACHE_DEFAULT_CACHE_EXPIRY} = options;
    const cacheOptions = {cacheTimeout};
    const {storage = new StorageDriver(cacheOptions)} = options;
    const {cache = new Cache(cacheOptions)} = options;

    // If a pre-warmed cache was given, always use it
    this.cache = cache;

    // Create the prefix URL from the domain
    this.urlPrefix = `https://${domain}`;

    // Register the storage driver
    this.storage = storage || new StorageDriver();
  }

  read(): Promise<CacheData$Values|null> {
    return this.storage.read().then(cacheData => {
      if (!cacheData) return null;

      this.cache._cache = generateEmptyCacheData();
      cacheData.forEach((cacheItem: GenericShopifyType|null) => {
        if (!cacheItem) return;
        this.cache.set(cacheItem.__type, cacheItem);
      });

      // Do *not* return by reference
      return [...this.cache._cache.data];
    });
  }

  write(): Promise<boolean> {
    return this.storage.write(this.cache._cache.data);
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
   * @param {ShopifyTypeEnum} type    The Shopify type to resolve
   * @param {string}          handle  The item handle to target
   * @param {string[]}        extra   Additional parameters to include in the URL
   *
   * @return {string}         The resolved URL of the JSON Shopify object
   */
  _resolve_path(type: ShopifyTypeEnum, handle: Handle, ...extra: string[]) {
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
  getProducts<T extends Handle>(handles: T[]): Promise<Array<Product<T>|null>> {
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
  getProduct<T extends Handle>(handle: T): Promise<Product<T>|null> {
    return this.get(ShopifyTypeEnum.Product, handle) as Promise<Product<T>>;
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
  getCollections<T extends Handle>(handles: T[]):
      Promise<Array<Collection<T>|null>> {
    return Promise.all(handles.map(handle => this.getCollection(handle)));
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
  getCollection<T extends Handle>(handle: T): Promise<Collection<T>|null> {
    return this.get(ShopifyTypeEnum.Collection, handle) as
        Promise<Collection<T>|null>;
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
  getCollectionProducts(handle: string): Promise<Array<Product<Handle>>|null> {
    // The collection type must also retrieve the list of products,
    // which is a separate HTTP request.
    const url = this.urlPrefix +
        this._resolve_path(ShopifyTypeEnum.Collection, handle, 'products');


    return fetch(url)
        .then((res) => res.json())
        .then(
            (products: {products: Array<Product<Handle>>}):
                Array<Product<Handle>> => {
                  if (!products) return [];

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
  getPages<T extends string>(handles: T[]): Promise<Array<Page<T>|null>> {
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
  getPage<T extends Handle>(handle: T): Promise<Page<T>|null> {
    return this.get(ShopifyTypeEnum.Page, handle) as Promise<Page<T>|null>;
  }

  /**
   * The primary method for retrieving Shopify items from
   * either the JSON API or our local cache
   *
   * @param   {ShopifyTypeEnum}   type    The Shopify type to target (product, collection, page)
   * @param   {string}            handle  The handle of the Shopify item to resolve
   */
  get<T extends GenericShopifyType>(type: ShopifyTypeEnum, handle: string):
      Promise<T|null> {
    // Check that the type is known
    if (!Object.values(ShopifyTypeEnum).includes(type)) {
      throw new Error(`Refusing to get unknown Shopify type '${type}'`);
    }

    // Attempt to retrieve the item from the cache
    let cacheResult;

    switch (type) {
      case ShopifyTypeEnum.Collection:
        cacheResult = this.cache.getCollection(handle);
        break;

      case ShopifyTypeEnum.Page:
        cacheResult = this.cache.getPage(handle);
        break;

      case ShopifyTypeEnum.Product:
        cacheResult = this.cache.getProduct(handle);
        break;

      default:
        cacheResult = null;
    }

    // Return immediately if we hit the cache
    if (cacheResult) {
      return Promise.resolve(cacheResult as T);
    }

    // Otherwise, request it from Shopify
    return fetch(this.urlPrefix + this._resolve_path(type, handle))
        .then((res: Response) => (res.json()))
        .then(
            (json: ShopifyInstanceWrapper<Handle>) =>
                this._processResponse(type, handle, json))
        .then((results) => (results as T | null))
        .catch(defaultErrorHandler);
  }

  /**
   * The callback handler for the common Shopify lookup Promise. This
   * will automatically write the new value to the cache, or do
   * additional processing on specific types.
   */
  _processResponse<T extends GenericShopifyType>(
      type: ShopifyTypeEnum, handle: Handle,
      json: ShopifyInstanceWrapper<Handle>): Promise<T|null> {
    let data: GenericShopifyType|null;

    switch (type) {
      case ShopifyTypeEnum.Product:
        data = json.product;
        break;

      case ShopifyTypeEnum.Page:
        data = json.page;
        break;

      case ShopifyTypeEnum.Collection:
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
    this.cache.set(type, data);
    this.storage.write(this.cache._cache.data);

    /**
     * This function is a callback handler for the 2nd collection
     * request, and merges the original response with the fully
     * populated product list.
     *
     * @param {Product<string>[]} products  The array of products
     *                            belonging to the collection.
     */
    function mergeCollectionItems(
        products: Array<Product<Handle>>, client: Client): Collection<Handle> {
      const finalResult: Collection<Handle> = {
        ...(data as Collection<Handle>),
        products,
      };

      // We should also cache all of the products we just
      // grabbed! A great opportunity.
      products.forEach(product => {
        client.cache.set(ShopifyTypeEnum.Product, product);
      });

      // Write the merged collection item
      client.cache.set(ShopifyTypeEnum.Collection, finalResult);
      client.storage.write(client.cache._cache.data);

      return finalResult;
    }

    if (type === ShopifyTypeEnum.Collection) {
      return this.getCollectionProducts(handle).then((products) => {
        if (!products) return null;

        return mergeCollectionItems(products, this) as T;
      });
    } else {
      return Promise.resolve(data as T);
    }
  }
}