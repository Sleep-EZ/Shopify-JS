import {testCreatePage, testCreateProduct, testCreateVariant} from '../../testing/index';
import {ShopifyTypeEnum} from '../../types';
import {Cache, CacheData$Values, generateEmptyCacheData, indexSingleElement, rebuildCache} from '../index';

describe('CacheData', () => {
  it('generateEmptyCacheData() is unchanged', () => {
    expect(generateEmptyCacheData()).toMatchSnapshot();
  });

  describe('indexSingleElement()', () => {
    it('returns false when item already exists', () => {
      const cache = new Cache();
      const testPage = testCreatePage({
        id: 1,
        handle: 'test',
      });

      cache._cache.ids[1] = 0;
      cache._cache.handles[ShopifyTypeEnum.Page]['test'] = 0;

      expect(indexSingleElement(cache._cache, testPage)).toBeFalsy();
    });

    it('covpath: indexing a variant skips indexing a handle', () => {
      const cache = new Cache();
      const variant = testCreateVariant({id: 1});

      indexSingleElement(cache._cache, variant);
      expect(cache._cache.ids).toEqual({1: 0});
      expect(cache._cache.data).toEqual([variant]);
    });

    it('covpath: re-indexing a variant overwrites the value', () => {
      const cache = new Cache();
      const product = testCreateProduct({id: 1});
      const variant = testCreateVariant({id: 10});
      const modifiedVariant = Object.assign(variant, {title: 'A'});

      product.variants = [variant];
      indexSingleElement(cache._cache, product);

      product.variants = [modifiedVariant];
      indexSingleElement(cache._cache, product);

      expect(cache._cache.ids).toEqual({1: 0, 10: 1});
      expect(cache._cache.data).toEqual([product, modifiedVariant]);
    });

    it('also indexes product variants', () => {
      const cache = new Cache();
      const variant1 = testCreateVariant({id: 10});
      const product = testCreateProduct({
        id: 1,
        handle: 'example',
        variants: [variant1],
      });

      indexSingleElement(cache._cache, product);

      expect(Object.keys(cache._cache.ids)).toEqual(['1', '10']);
      expect(cache._cache.data).toEqual([product, variant1]);
    });

    it('SPECIAL: Indexing handle resolves proper ID', () => {
      const cache = new Cache();
      const testPage = testCreatePage({id: 1, handle: 'sad'});
      const testPage2 = testCreatePage({id: 2, handle: 'happy'});

      cache._cache.ids[1] = 0;
      cache._cache.ids[2] = 1;
      cache._cache.handles[ShopifyTypeEnum.Page]['happy'] = 1;
      // 'sad' is missing in the index

      // Should still be false, nothing was created, only an index was added
      expect(indexSingleElement(cache._cache, testPage)).toBeFalsy();
      expect(indexSingleElement(cache._cache, testPage2)).toBeFalsy();
      expect(cache._cache.handles[ShopifyTypeEnum.Page])
          .toEqual({happy: 1, sad: 0});
    });
  });

  describe('rebuildCache', () => {
    const page1 = testCreatePage({id: 1, handle: 'page1'});
    const page2 = testCreatePage({id: 2, handle: 'page2'});

    const uncleanCache: CacheData$Values = [page1, null, page2];
    const rebuiltCache = rebuildCache(uncleanCache);

    expect(rebuiltCache.data).toEqual([page1, page2]);
    expect(rebuiltCache.data !== uncleanCache).toBeTruthy();
  });
});