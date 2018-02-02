import { GenericShopifyType, ShopifyTypeEnum } from './types';
/**
 * Return the current unix time (time since epoch)
 *
 * We only need data resolution to the second.
 */
export declare function getCurrentEpoch(): number;
export declare function pluralizeType(type: ShopifyTypeEnum): string;
export declare function isExpired(expiredAt: number): boolean;
export declare function __ts_resolve_type(item: GenericShopifyType): GenericShopifyType;
