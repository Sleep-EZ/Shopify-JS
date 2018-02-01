import {Collection, GenericShopifyType, Page, Product, ShopifyTypeEnum} from './types';

/**
 * Return the current unix time (time since epoch)
 *
 * We only need data resolution to the second.
 */
export function getCurrentEpoch(): number {
  return Date.now();
}

export function pluralizeType(type: ShopifyTypeEnum) {
  return `${type}s`;
}

export function isExpired(expiredAt: number) {
  return (getCurrentEpoch() > expiredAt);
}

export function __ts_resolve_type(item: GenericShopifyType):
    GenericShopifyType {
  if ('products' in item) {
    return (item as Collection<string>);
  }

  if ('options' in item) {
    return (item as Product<string>);
  }

  if ('body_html' in item && !('variants' in item)) {
    return (item as Page<string>);
  }

  return item;
}