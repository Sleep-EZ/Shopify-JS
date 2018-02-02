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