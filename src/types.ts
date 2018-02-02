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

/**
 * A type for each Shopify type in it's string form
 */
export enum ShopifyTypeEnum {
  Product = 'product',
  Collection = 'collection',
  Page = 'page',
  Variant = 'variant',
}


/**
 * A type for representing any one of the three available
 * Shopify types.
 */
export type GenericShopifyType =
    Indexable&Expires&(Product<Handle>|Collection<Handle>|Page<Handle>|Variant);

/**
 * The type extended by the three primary types: **Page**,
 * **Product**, and **Collection**. This secret value is
 * suffixed to each object with the UNIX timestamp of when
 * the value was written. This is used for cache expiration.
 */
export type Expires = {
  __expires: number,
  __type: ShopifyTypeEnum,
};
export type Indexable = {
  id: number
};

export type Handle = string;

/**
 * == Product
 *
 * This is the TypeScript definition as described by Shopify's
 * JSON API. (WARNING: These are subject to change at Shopify's
 * descretion without warning!)
 */
export type Product<H extends Handle> = Indexable&Expires&{
  title: string,
  handle: H,
  body_html: string | null,
  vendor: string | null,
  product_type: string | null,
  template_suffix: string,
  published_scope: string,
  tags: string[],
  variants: Variant[],
  options: Option[],
  images: Image[],
  image: Image | null,
  created_at: Date,
  updated_at: Date,
  published_at: Date,
};

/**
 * A Shopify image object, typically found in the Product response.
 */
export type Image = Indexable&{
  product_id: number,
  position: number,
  created_at: Date,
  updated_at: Date,
  width: number,
  height: number,
  src: string,
  variant_ids: number[],
};

/**
 * A product option
 */
export type Option = Indexable&{
  product_id: number,
  name: string,
  position: number,
  values: string[],
};

/**
 * A product variant
 */
export type Variant = Indexable&Expires&{
  product_id: number,
  title: string,
  price: number,
  sku: string,
  position: number,
  inventory_policy: string,
  compare_at_price: number,
  fulfillment_service: string,
  inventory_management: string | null,
  option1: string,
  option2: string | null,
  option3: string | null,
  created_at: Date,
  updated_at: Date,
  taxable: boolean,
  barcode: string | null,
  grams: number,
  image_id: number | null,
  inventory_quantity: number,
  weight: number,
  weight_unit: string,
  inventory_item_id: number,
  old_inventory_quantity: number,
  requires_shipping: boolean,
};

/**
 * A Shopify page element
 */
export type Page<H> = Indexable&Expires&{
  title: string,
  handle: H,
  body_html: string,
  created_at: Date,
  published_at: Date,
  updated_at: Date,
};

/**
 * A Shopify collection.
 *
 * This type is special because it requires two requests
 * to fully resolve this. The original collection data,
 * and it's products (`collection.products`).
 */
export type Collection<H> = Indexable&Expires&{
  title: string,
  handle: H,
  description: string,
  published_at: Date,
  updated_at: Date,
  image: Image,
  products_count: number,

  // This is a field provided by this API only
  products: Array<Product<string>>,
};