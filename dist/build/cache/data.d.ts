import { GenericShopifyType } from '../types';
/**
 * This function generates a new [[CacheData]] object. We made this
 * a function so that the newly created [[CacheData]] (<u>and it's
 * children</u>) are **NOT** returned as a reference. All code that
 * creates a new Cache instance should reference this method.
 *
 * We want to ensure that if you want to have multiple stores with
 * different URLs, that their caches should not mix (we test for this
 * as well).
 */
export declare function generateEmptyCacheData(): CacheData;
/**
 * The [[CacheData]] is the data structure used for caching fetched
 * Shopify objects. Objects are indexed by their Shopify ID (all types
 * in the Shopify platform have an ID), and another index is managed
 * for quickly looking up items by their type and handle.
 *
 * **NOTE:** You should never need to access this object directly.
 * You should always use one of [[Client]]'s common methods that
 * calls `get()`, or cache expiration will not work.
 *
 * **NOTE:** Shopify types can have colliding handles. For example,
 * a [[Product]] with the handle `example`, and a [[Page]] with the
 * same handle, can exist on the same store. So, we must index handles
 * categorized by their type as well.
 *
 * **<u>Object Format:</u>**
 * ```
 * {
 *   ids: {
 *     1: { __type: 'page', id: 1, handle: 'example' }
 *   },
 *   handles: { "page": { "example": 1 } },
 * }
 * ```
 */
export interface CacheData {
    /**
     * An object with the Shopify ID as the key, and the Shopify
     * entity as the value. All Shopify types include an ID.
     */
    ids: CacheData$IDMap;
    /**
     * An index with the key as the item handle, and the value
     * being the ID of the item to resolve.
     */
    handles: {
        [type: string]: CacheData$Handles;
    };
}
/**
 * Our cache includes an array of **real** values, full
 * JSON representations of Shopify objects). These are accessed
 * by using the IDMap, given a Shopify item ID (variant, product,
 * page, collection) can quickly look up existance.
 *
 * The ID map also allows us to have type-less indexing, with
 * deletion and addition managed by the Client.
 */
export interface CacheData$IDMap {
    [id: number]: CacheData$Value;
}
/**
 * A possible value in the [[CacheData]] element. Contains either
 * a [[Product]], [[Page]], [[Collection]], or `null`.
 */
export declare type CacheData$Value = GenericShopifyType | null;
/**
 * An object used to quickly look up items by their handle **for a
 * specific type**. One of these objects exists for each Shopify
 * type to prevent accidental collisions between types.
 */
export declare type CacheData$Handles = {
    [handle: string]: number;
};
/**
 * Given a Shopify entity, will index it and its children elements.
 *
 * @param {CacheData}  data  The cache data to augment the indexed data to
 * @param {GenericShopifyType|null} item
 *        The value in the cache can be a Shopify entity, or a null value
 *        if it has expired.
 */
export declare function indexShopifyElement(data: CacheData, item: GenericShopifyType): void;
export declare function rebuildCache(givenValues: CacheData$Value[]): CacheData;
