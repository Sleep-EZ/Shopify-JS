/**
 * A type for each Shopify type in it's string form
 */
export declare enum ShopifyTypeEnum {
    Product = "product",
    Collection = "collection",
    Page = "page",
    Variant = "variant",
}
/**
 * A type for representing any one of the three available
 * Shopify types.
 */
export declare type GenericShopifyType = Indexable & Expires & (Product<Handle> | Collection<Handle> | Page<Handle> | Variant);
/**
 * The type extended by the three primary types: **Page**,
 * **Product**, and **Collection**. This secret value is
 * suffixed to each object with the UNIX timestamp of when
 * the value was written. This is used for cache expiration.
 */
export interface Expires {
    __expires: number;
    __type: ShopifyTypeEnum;
}
export interface Indexable {
    id: number;
}
export declare type Handle = string;
/**
 * == Product
 *
 * This is the TypeScript definition as described by Shopify's
 * JSON API. (WARNING: These are subject to change at Shopify's
 * descretion without warning!)
 */
export interface Product<H extends Handle> extends Indexable, Expires {
    title: string;
    handle: H;
    body_html: string | null;
    vendor: string | null;
    product_type: string | null;
    template_suffix: string;
    published_scope: string;
    tags: string[];
    variants: Variant[];
    options: Option[];
    images: Image[];
    image: Image | null;
    created_at: Date;
    updated_at: Date;
    published_at: Date;
}
/**
 * A Shopify image object, typically found in the Product response.
 */
export interface Image extends Indexable {
    product_id: number;
    position: number;
    created_at: Date;
    updated_at: Date;
    width: number;
    height: number;
    src: string;
    variant_ids: number[];
}
/**
 * A product option
 */
export interface Option extends Indexable {
    product_id: number;
    name: string;
    position: number;
    values: string[];
}
/**
 * A product variant
 */
export interface Variant extends Indexable, Expires {
    product_id: number;
    title: string;
    price: number;
    sku: string;
    position: number;
    inventory_policy: string;
    compare_at_price: number;
    fulfillment_service: string;
    inventory_management: string | null;
    option1: string;
    option2: string | null;
    option3: string | null;
    created_at: Date;
    updated_at: Date;
    taxable: boolean;
    barcode: string | null;
    grams: number;
    image_id: number | null;
    inventory_quantity: number;
    weight: number;
    weight_unit: string;
    inventory_item_id: number;
    old_inventory_quantity: number;
    requires_shipping: boolean;
}
/**
 * A Shopify page element
 */
export interface Page<H> extends Indexable, Expires {
    title: string;
    handle: H;
    body_html: string;
    created_at: Date;
    published_at: Date;
    updated_at: Date;
}
/**
 * A Shopify collection.
 *
 * This type is special because it requires two requests
 * to fully resolve this. The original collection data,
 * and it's products (`collection.products`).
 */
export interface Collection<H> extends Indexable, Expires {
    title: string;
    handle: H;
    description: string;
    published_at: Date;
    updated_at: Date;
    image: Image | null;
    products_count: number;
    products: Array<Product<string>>;
}
