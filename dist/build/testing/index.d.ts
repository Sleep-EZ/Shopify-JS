import { Handle, Page, Product, Variant } from '../types';
export declare const STANDARD_DATE = "2010-01-01T00:00:00.000Z";
export declare const TEST_EXPIRY_DATE = 1900000000000;
export declare function testCreatePage(data: Partial<Page<Handle>>): Page<Handle>;
export declare function testCreateVariant(data: Partial<Variant>): Variant;
export declare function testCreateProduct(data: Partial<Product<Handle>>): Product<Handle>;
