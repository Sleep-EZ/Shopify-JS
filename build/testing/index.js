"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var types_1 = require("../types");
exports.STANDARD_DATE = '2010-01-01T00:00:00.000Z';
exports.TEST_EXPIRY_DATE = 1900000000000;
function testCreatePage(data) {
    return __assign({ id: -1, title: '', handle: '', body_html: '', created_at: new Date(exports.STANDARD_DATE), updated_at: new Date(exports.STANDARD_DATE), published_at: new Date(exports.STANDARD_DATE), __expires: exports.TEST_EXPIRY_DATE, __type: types_1.ShopifyTypeEnum.Page }, data);
}
exports.testCreatePage = testCreatePage;
function testCreateVariant(data) {
    return __assign({ id: -1, title: '', product_id: 0, price: 0, compare_at_price: 0, sku: '', barcode: '', fulfillment_service: 'manual', grams: 0, image_id: null, inventory_item_id: 9000, inventory_management: null, inventory_policy: 'deny', inventory_quantity: 0, old_inventory_quantity: 0, option1: "Default", option2: null, option3: null, position: 0, requires_shipping: true, taxable: true, weight: 0, weight_unit: 'lb', created_at: new Date(exports.STANDARD_DATE), updated_at: new Date(exports.STANDARD_DATE), __expires: exports.TEST_EXPIRY_DATE, __type: types_1.ShopifyTypeEnum.Variant }, data);
}
exports.testCreateVariant = testCreateVariant;
function testCreateProduct(data) {
    return __assign({ id: -1, title: '', handle: '', product_type: '', vendor: '', tags: [], body_html: '', options: [], variants: [], image: null, images: [], created_at: new Date(exports.STANDARD_DATE), updated_at: new Date(exports.STANDARD_DATE), published_at: new Date(exports.STANDARD_DATE), published_scope: 'public', template_suffix: '', __expires: exports.TEST_EXPIRY_DATE, __type: types_1.ShopifyTypeEnum.Product }, data);
}
exports.testCreateProduct = testCreateProduct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdGluZy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsa0NBQTJFO0FBRTlELFFBQUEsYUFBYSxHQUFHLDBCQUEwQixDQUFDO0FBQzNDLFFBQUEsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO0FBRTlDLHdCQUErQixJQUEyQjtJQUN0RCxNQUFNLFlBQ0YsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUNOLEtBQUssRUFBRSxFQUFFLEVBQ1QsTUFBTSxFQUFFLEVBQUUsRUFDVixTQUFTLEVBQUUsRUFBRSxFQUViLFVBQVUsRUFBRSxJQUFJLElBQUksQ0FBQyxxQkFBYSxDQUFDLEVBQ25DLFVBQVUsRUFBRSxJQUFJLElBQUksQ0FBQyxxQkFBYSxDQUFDLEVBQ25DLFlBQVksRUFBRSxJQUFJLElBQUksQ0FBQyxxQkFBYSxDQUFDLEVBRXJDLFNBQVMsRUFBRSx3QkFBZ0IsRUFDM0IsTUFBTSxFQUFFLHVCQUFlLENBQUMsSUFBSSxJQUV6QixJQUFJLEVBQ1Q7QUFDTixDQUFDO0FBaEJELHdDQWdCQztBQUVELDJCQUFrQyxJQUFzQjtJQUNwRCxNQUFNLFlBQ0YsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUNOLEtBQUssRUFBRSxFQUFFLEVBQ1QsVUFBVSxFQUFFLENBQUMsRUFFYixLQUFLLEVBQUUsQ0FBQyxFQUNSLGdCQUFnQixFQUFFLENBQUMsRUFFbkIsR0FBRyxFQUFFLEVBQUUsRUFDUCxPQUFPLEVBQUUsRUFBRSxFQUNYLG1CQUFtQixFQUFFLFFBQVEsRUFDN0IsS0FBSyxFQUFFLENBQUMsRUFDUixRQUFRLEVBQUUsSUFBSSxFQUNkLGlCQUFpQixFQUFFLElBQUksRUFDdkIsb0JBQW9CLEVBQUUsSUFBSSxFQUMxQixnQkFBZ0IsRUFBRSxNQUFNLEVBQ3hCLGtCQUFrQixFQUFFLENBQUMsRUFDckIsc0JBQXNCLEVBQUUsQ0FBQyxFQUN6QixPQUFPLEVBQUUsU0FBUyxFQUNsQixPQUFPLEVBQUUsSUFBSSxFQUNiLE9BQU8sRUFBRSxJQUFJLEVBQ2IsUUFBUSxFQUFFLENBQUMsRUFDWCxpQkFBaUIsRUFBRSxJQUFJLEVBQ3ZCLE9BQU8sRUFBRSxJQUFJLEVBQ2IsTUFBTSxFQUFFLENBQUMsRUFDVCxXQUFXLEVBQUUsSUFBSSxFQUVqQixVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMscUJBQWEsQ0FBQyxFQUNuQyxVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMscUJBQWEsQ0FBQyxFQUVuQyxTQUFTLEVBQUUsd0JBQWdCLEVBQzNCLE1BQU0sRUFBRSx1QkFBZSxDQUFDLE9BQU8sSUFFNUIsSUFBSSxFQUNUO0FBQ04sQ0FBQztBQXBDRCw4Q0FvQ0M7QUFFRCwyQkFBa0MsSUFBOEI7SUFDNUQsTUFBTSxZQUNGLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFDTixLQUFLLEVBQUUsRUFBRSxFQUNULE1BQU0sRUFBRSxFQUFFLEVBQ1YsWUFBWSxFQUFFLEVBQUUsRUFDaEIsTUFBTSxFQUFFLEVBQUUsRUFDVixJQUFJLEVBQUUsRUFBRSxFQUNSLFNBQVMsRUFBRSxFQUFFLEVBQ2IsT0FBTyxFQUFFLEVBQUUsRUFDWCxRQUFRLEVBQUUsRUFBRSxFQUNaLEtBQUssRUFBRSxJQUFJLEVBQ1gsTUFBTSxFQUFFLEVBQUUsRUFDVixVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMscUJBQWEsQ0FBQyxFQUNuQyxVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMscUJBQWEsQ0FBQyxFQUNuQyxZQUFZLEVBQUUsSUFBSSxJQUFJLENBQUMscUJBQWEsQ0FBQyxFQUNyQyxlQUFlLEVBQUUsUUFBUSxFQUN6QixlQUFlLEVBQUUsRUFBRSxFQUNuQixTQUFTLEVBQUUsd0JBQWdCLEVBQzNCLE1BQU0sRUFBRSx1QkFBZSxDQUFDLE9BQU8sSUFFNUIsSUFBSSxFQUNUO0FBQ04sQ0FBQztBQXZCRCw4Q0F1QkMifQ==