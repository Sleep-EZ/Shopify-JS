import {testCreatePage} from '../../testing/index';
import {ShopifyTypeEnum} from '../../types';
import {Cache, indexSingleElement} from '../index';


it('readCache() works', () => {
  const cache = new Cache();
  const testPage = testCreatePage({
    id: 100,
    handle: 'asdas',
  });

  indexSingleElement(cache._cache, testPage);
  const result = cache.readCache();

  expect(result).toHaveLength(1);
  expect(result).toMatchSnapshot();
});

describe('writeCache()', () => {
  const page1 = testCreatePage({id: 1, handle: 'test1'});

  it('creates new references for each', () => {
    const cache = new Cache();
    const newCache = new Cache();
    cache.set(ShopifyTypeEnum.Page, page1);

    newCache.writeCache(cache._cache.data);
    expect(newCache._cache.data).toEqual(cache._cache.data);

    expect(newCache._cache.data !== cache._cache.data).toBeTruthy();
    expect(newCache._cache.ids !== cache._cache.ids).toBeTruthy();
    expect(
        newCache._cache.handles[ShopifyTypeEnum.Collection] !==
        cache._cache.handles[ShopifyTypeEnum.Collection])
        .toBeTruthy();
    expect(
        newCache._cache.handles[ShopifyTypeEnum.Product] !==
        cache._cache.handles[ShopifyTypeEnum.Product])
        .toBeTruthy();
    expect(
        newCache._cache.handles[ShopifyTypeEnum.Page] !==
        cache._cache.handles[ShopifyTypeEnum.Page])
        .toBeTruthy();
  });
});

describe(
    'getCollection()',
    () => {

    });

describe('getProduct()', () => {});