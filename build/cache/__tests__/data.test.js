"use strict";
exports.__esModule = true;
var index_1 = require("../index");
var types_1 = require("../../types");
var index_2 = require("../../testing/index");
describe('CacheData', function () {
    it('generateEmptyCacheData() is unchanged', function () {
        expect(index_1.generateEmptyCacheData()).toMatchSnapshot();
    });
    describe('indexSingleElement()', function () {
        it('returns false when item already exists', function () {
            var cache = new index_1.Cache();
            var testPage = index_2.testCreatePage({
                id: 1, handle: 'test'
            });
            cache._cache.ids[1] = 0;
            cache._cache.handles[types_1.ShopifyTypeEnum.Page]['test'] = 0;
            expect(index_1.indexSingleElement(cache._cache, testPage)).toBeFalsy();
        });
        it('covpath: indexing a variant skips indexing a handle', function () {
            var cache = new index_1.Cache();
            var variant = index_2.testCreateVariant({ id: 1 });
            index_1.indexSingleElement(cache._cache, variant);
            expect(cache._cache.ids).toEqual({ 1: 0 });
            expect(cache._cache.data).toEqual([variant]);
        });
        it('covpath: re-indexing a variant overwrites the value', function () {
            var cache = new index_1.Cache();
            var product = index_2.testCreateProduct({ id: 1 });
            var variant = index_2.testCreateVariant({ id: 10 });
            var modifiedVariant = Object.assign(variant, { title: 'A' });
            product.variants = [variant];
            index_1.indexSingleElement(cache._cache, product);
            product.variants = [modifiedVariant];
            index_1.indexSingleElement(cache._cache, product);
            expect(cache._cache.ids).toEqual({ 1: 0, 10: 1 });
            expect(cache._cache.data).toEqual([product, modifiedVariant]);
        });
        it('also indexes product variants', function () {
            var cache = new index_1.Cache();
            var variant1 = index_2.testCreateVariant({ id: 10 });
            var product = index_2.testCreateProduct({
                id: 1, handle: 'example', variants: [variant1]
            });
            index_1.indexSingleElement(cache._cache, product);
            expect(Object.keys(cache._cache.ids)).toEqual(['1', '10']);
            expect(cache._cache.data).toEqual([product, variant1]);
        });
        it('SPECIAL: Indexing handle resolves proper ID', function () {
            var cache = new index_1.Cache();
            var testPage = index_2.testCreatePage({ id: 1, handle: 'sad' });
            var testPage2 = index_2.testCreatePage({ id: 2, handle: 'happy' });
            cache._cache.ids[1] = 0;
            cache._cache.ids[2] = 1;
            cache._cache.handles[types_1.ShopifyTypeEnum.Page]['happy'] = 1;
            // 'sad' is missing in the index
            // Should still be false, nothing was created, only an index was added
            expect(index_1.indexSingleElement(cache._cache, testPage)).toBeFalsy();
            expect(index_1.indexSingleElement(cache._cache, testPage2)).toBeFalsy();
            expect(cache._cache.handles[types_1.ShopifyTypeEnum.Page]).toEqual({
                happy: 1,
                sad: 0
            });
        });
    });
    describe('rebuildCache', function () {
        var page1 = index_2.testCreatePage({ id: 1, handle: 'page1' });
        var page2 = index_2.testCreatePage({ id: 2, handle: 'page2' });
        var uncleanCache = [page1, null, page2];
        var rebuiltCache = index_1.rebuildCache(uncleanCache);
        expect(rebuiltCache.data).toEqual([page1, page2]);
        expect(rebuiltCache.data !== uncleanCache).toBeTruthy();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhY2hlL19fdGVzdHNfXy9kYXRhLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrQ0FBNkc7QUFDN0cscUNBQThDO0FBQzlDLDZDQUEyRjtBQUUzRixRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ2xCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtRQUN4QyxNQUFNLENBQUMsOEJBQXNCLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1FBQzdCLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUN6QyxJQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQzFCLElBQU0sUUFBUSxHQUFHLHNCQUFjLENBQUM7Z0JBQzVCLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU07YUFDeEIsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FBQywwQkFBa0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7WUFDdEQsSUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFNLE9BQU8sR0FBRyx5QkFBaUIsQ0FBQyxFQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBRTNDLDBCQUFrQixDQUFDLEtBQUssQ0FBQyxN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