"use strict";
exports.__esModule = true;
var types_1 = require("../types");
/**
 * This constant is the structure of an empty Shopify-JS
 * cache. Other files reference this constant to ensure
 * continuity.
 */
function generateEmptyCacheData() {
    return {
        ids: {},
        data: [],
        handles: (_a = {},
            _a[types_1.ShopifyTypeEnum.Collection] = {},
            _a[types_1.ShopifyTypeEnum.Page] = {},
            _a[types_1.ShopifyTypeEnum.Variant] = {},
            _a[types_1.ShopifyTypeEnum.Product] = {},
            _a)
    };
    var _a;
}
exports.generateEmptyCacheData = generateEmptyCacheData;
function indexSingleElement(data, item) {
    var ids = data.ids;
    var type = item.__type;
    var nextIndex = data.data.length;
    var wasCreated = false;
    if (!(item.id in ids)) {
        ids[item.id] = nextIndex;
        data.data.push(item);
        wasCreated = true;
    }
    if ('handle' in item) {
        var handle = item.handle;
        if (!(handle in data.handles[type])) {
            data.handles[type][handle] = ids[item.id];
        }
    }
    // Determine if it's a product
    if ('variants' in item) {
        var product = item;
        product.variants.forEach(function (variant) {
            var variantId = variant.id;
            var newPos = ids[variantId] || data.data.length;
            if (!(variantId in ids)) {
                ids[variantId] = newPos;
                data.data.push(variant);
            }
            else {
                data.data[newPos] = variant;
            }
        });
    }
    // Determine if it's a collection
    if ('products' in item) {
        var collection = item;
        collection.products.forEach(function (product) {
            var productId = product.id;
            var productHandle = product.handle;
            var nextCacheIndex = data.data.length;
            if (!(productId in ids)) {
                data.ids[productId] = nextCacheIndex;
                data.data.push(product);
            }
            if (!(productHandle in data.handles[types_1.ShopifyTypeEnum.Product])) {
                data.handles[types_1.ShopifyTypeEnum.Product][productHandle] = nextCacheIndex;
            }
        });
    }
    return wasCreated;
}
exports.indexSingleElement = indexSingleElement;
function rebuildCache(givenValues) {
    var newCache = generateEmptyCacheData();
    givenValues.forEach(function (item) {
        if (!!item)
            indexSingleElement(newCache, item);
    });
    return newCache;
}
exports.rebuildCache = rebuildCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWNoZS9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0NBQTBGO0FBRTFGOzs7O0dBSUc7QUFDSDtJQUNFLE1BQU0sQ0FBQztRQUNMLEdBQUcsRUFBRSxFQUFFO1FBQ1AsSUFBSSxFQUFFLEVBQUU7UUFDUixPQUFPO1lBQ0wsR0FBQyx1QkFBZSxDQUFDLFVBQVUsSUFBRyxFQUFFO1lBQ2hDLEdBQUMsdUJBQWUsQ0FBQyxJQUFJLElBQUcsRUFBRTtZQUMxQixHQUFDLHVCQUFlLENBQUMsT0FBTyxJQUFHLEVBQUU7WUFDN0IsR0FBQyx1QkFBZSxDQUFDLE9BQU8sSUFBRyxFQUFFO2VBQzlCO0tBQ0YsQ0FBQzs7QUFDSixDQUFDO0FBWEQsd0RBV0M7QUE2QkQsNEJBQ0ksSUFBZSxFQUFFLElBQXdCO0lBQzNDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDckIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN6QixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNuQyxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFFdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQU0sTUFBTSxHQUFJLElBQXdCLENBQUMsTUFBTSxDQUFDO1FBRWhELEVBQUUs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