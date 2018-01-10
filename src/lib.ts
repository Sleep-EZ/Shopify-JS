import {ShopifyTypeStr, ShopifyType, Product, Collection, Page} from './types';

/**
 * Return the current unix time (time since epoch)
 *
 * We only need data resolution to the second.
 */
export function getCurrentEpoch(): number {
  return +new Date();
}

export function pluralizeType(type: ShopifyTypeStr) {
  return `${type}s`;
}

export function isExpired(ts: number, timeout: number) {
  return ((getCurrentEpoch() - ts) / 1000 > timeout);
}

export function __ts_resolve_type(item: ShopifyType<string>): ShopifyType<string> {
  if('products' in item) {
    return (item as Collection<string>);
  }

  if('options' in item) {
    return (item as Product<string>);
  }

  if('body_html' in item && !('variants' in item)) {
    return (item as Page<string>);
  }

  return item;
}