import {ShopifyTypeStr} from './types';

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