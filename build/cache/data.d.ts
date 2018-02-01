import { GenericShopifyType } from '../types';
/**
 * This constant is the structure of an empty Shopify-JS
 * cache. Other files reference this constant to ensure
 * continuity.
 */
export declare function generateEmptyCacheData(): CacheData;
export declare type CacheData = {
    ids: CacheData$IDMap;
    handles: {
        [type: string]: CacheData$Handles;
    };
    data: Array<GenericShopifyType | null>;
};
/**
 * Our cache includes an array of **real** values, full
 * JSON representations of Shopify objects). These are accessed
 * by using the IDMap, given a Shopify item ID (variant, product,
 * page, collection) can quickly look up existance.
 *
 * The ID map also allows us to have type-less indexing, with
 * deletion and addition managed by the Client.
 */
export declare type CacheData$IDMap = {
    [id: number]: number;
};
export declare type CacheData$Handles = {
    [handle: string]: number;
};
export declare type CacheData$CleanValues = GenericShopifyType[];
export declare type CacheData$Values = Array<GenericShopifyType | null>;
export declare function indexSingleElement(data: CacheData, item: GenericShopifyType): boolean;
export declare function rebuildCache(givenValues: CacheData$Values): CacheData;
