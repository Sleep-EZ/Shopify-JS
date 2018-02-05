import {testCreatePage, testCreateProduct, testCreateVariant} from '../../testing/index';
import {ShopifyTypeEnum} from '../../types';
import {Cache, CacheData$Value, generateEmptyCacheData, indexShopifyElement, rebuildCache} from '../index';

describe('CacheData', () => {
  it('generateEmptyCacheData() is unchanged', () => {
    expect(generateEmptyCacheData()).toMatchSnapshot();
  });

  describe('indexSingleElement()', () => {
    it('always overwrites existing elements, even if not expired', () => {
      const cache = new Cache();
      const testPage = testCreatePage({id: 1, handle: 'test'});
      indexShopifyElement(cache._cache, testPage);

      const newTestPage = Object.assign({}, testPage, {sku: 'abc'});
      indexShopifyElement(cache._cache, newTestPage);

      expect(cache._cache.ids).toEqual({1: newTestPage});
      expect(cache._cache.handles[ShopifyTypeEnum.Page]).toEqual({'test': 1});
    });

    it('covpath: indexing a variant skips indexing a handle', () => {
      const cache = new Cache();
      const variant = testCreateVariant({id: 1});

      indexShopifyElement(cache._cache, variant);
      expect(cache._cache.ids).toEqual({1: variant});
      expect(cache._cache.handles[ShopifyTypeEnum.Variant]).toEqual({});
    });

    it('also indexes product variants', () => {
      const cache = new Cache();
      const variant1 = testCreateVariant({id: 10});
      const product = testCreateProduct({
        id: 1,
        handle: 'example',
        variants: [variant1],
      });

      indexShopifyElement(cache._cache, product);

      expect(cache._cache.ids).toEqual({
        1: product,
        10: variant1,
      });
      expect(cache._cache.handles[ShopifyTypeEnum.Product]).toEqual({
        'example': 1
      });
    });
  });

  describe('rebuildCache', () => {
    const page1 = testCreatePage({id: 1, handle: 'page1'});
    const page2 = testCreatePage({id: 2, handle: 'page2'});

    const uncleanCache: CacheData$Value[] = [page1, null, page2];
    const rebuiltCache = rebuildCache(uncleanCache);

    expect(rebuiltCache.ids).toEqual({1: page1, 2: page2});
  });
});