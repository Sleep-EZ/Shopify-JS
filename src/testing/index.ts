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

import {Handle, Page, Product, ShopifyTypeEnum, Variant} from '../types';

export const STANDARD_DATE = '2010-01-01T00:00:00.000Z';
export const TEST_EXPIRY_DATE = 1900000000000;

export function testCreatePage(data: Partial<Page<Handle>>): Page<Handle> {
  return {
    id: -1,
    title: '',
    handle: '',
    body_html: '',

    created_at: new Date(STANDARD_DATE),
    updated_at: new Date(STANDARD_DATE),
    published_at: new Date(STANDARD_DATE),

    __expires: TEST_EXPIRY_DATE,  // a constant VERY far in the future
    __type: ShopifyTypeEnum.Page,

    ...data,
  };
}

export function testCreateVariant(data: Partial<Variant>): Variant {
  return {
    id: -1,
    title: '',
    product_id: 0,

    price: 0,
    compare_at_price: 0,

    sku: '',
    barcode: '',
    fulfillment_service: 'manual',
    grams: 0,
    image_id: null,
    inventory_item_id: 9000,
    inventory_management: null,
    inventory_policy: 'deny',
    inventory_quantity: 0,
    old_inventory_quantity: 0,
    option1: 'Default',
    option2: null,
    option3: null,
    position: 0,
    requires_shipping: true,
    taxable: true,
    weight: 0,
    weight_unit: 'lb',

    created_at: new Date(STANDARD_DATE),
    updated_at: new Date(STANDARD_DATE),

    __expires: TEST_EXPIRY_DATE,
    __type: ShopifyTypeEnum.Variant,

    ...data,
  };
}

export function testCreateProduct(data: Partial<Product<Handle>>):
    Product<Handle> {
  return {
    id: -1,
    title: '',
    handle: '',
    product_type: '',
    vendor: '',
    tags: [],
    body_html: '',
    options: [],
    variants: [],
    image: null,
    images: [],
    created_at: new Date(STANDARD_DATE),
    updated_at: new Date(STANDARD_DATE),
    published_at: new Date(STANDARD_DATE),
    published_scope: 'public',
    template_suffix: '',
    __expires: TEST_EXPIRY_DATE,
    __type: ShopifyTypeEnum.Product,

    ...data,
  };
}