export const SHOPIFY_TYPE_PRODUCT = 'product';
export const SHOPIFY_TYPE_COLLECTION = 'collection';
export const SHOPIFY_TYPE_PAGE = 'page';

export type ShopifyType = (
    typeof SHOPIFY_TYPE_PRODUCT |
    typeof SHOPIFY_TYPE_COLLECTION |
    typeof SHOPIFY_TYPE_PAGE);

/**
 * Type definitions for the core Shopify JSON representations.
 *
 * These definitions are based on Shopify's web JSON API,
 * and certainly has the possibility for change (without notice).
 */
export type Product<H> = {
    id: number,
    handle: H,
    body_html: string | null,
    vendor: string | null,
    product_type: string | null,
    created_at: Date,
    updated_at: Date,
    published_at: Date,
    template_suffix: string,
    published_scope: string,
    tags: string[],
    variants: Variant[],
    options: Option[],
    images: Image[],
    image: Image,
};

export type Image = {
    id: number,
    product_id: number,
    position: number,
    created_at: Date,
    updated_at: Date,
    width: number,
    height: number,
    src: string,
    variant_ids: number[],
};

export type Option = {
    id: number,
    product_id: number,
    name: string,
    position: number,
    values: string[],
};

export type Variant = {
    id: number,
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
    image_id: number,
    inventory_quantity: number,
    weight: number,
    weight_unit: string,
    inventory_item_id: number,
    old_inventory_quantity: number,
    requires_shipping: boolean,
};

export type Page<H> = {
    id: number,
    handle: string,

};

export type Collection<str> = {

}