import {testCreateCollection, testCreatePage, testCreateProduct} from '../../testing/index';
import {ShopifyTypeEnum} from '../../types';
import {Cache, indexShopifyElement} from '../index';

describe('Cache', () => {
  it('readCache() works', () => {
    const cache = new Cache();
    const testPage = testCreatePage({
      id: 100,
      handle: 'asdas',
    });

    indexShopifyElement(cache._cache, testPage);
    const result = cache.readCache();

    expect(result).toHaveLength(1);
    expect(result).toMatchSnapshot();
  });

  it('can copy data with writeCache()', () => {
    const cache = new Cache();
    const cache2 = new Cache();

    const testPage = testCreatePage({
      id: 100,
      handle: 'asdas',
    });

    indexShopifyElement(cache._cache, testPage);
    cache._cache.ids[100] = null;
    const readCache = cache.readCache();
    expect(readCache).toEqual([null]);

    cache2.writeCache(readCache);
    expect(cache2._cache.ids).toEqual({});
  });

  it('can find an object by ID', () => {
    const cache = new Cache();
    const page = testCreatePage({id: 1});

    indexShopifyElement(cache._cache, page);
    expect(cache._fetchId(1)).toEqual(page);
  });

  it('can handle fetching handles that do not exist', () => {
    const cache = new Cache();
    expect(cache._fetchHandle(ShopifyTypeEnum.Page, 'no-exist')).toEqual(null);
  });

  it('can fetch handles by individual type', () => {
    const cache = new Cache();
    const page = testCreatePage({id: 1, handle: 'example'});
    const product = testCreateProduct({id: 2, handle: 'example'});
    const collection = testCreateCollection({id: 3, handle: 'example'});

    indexShopifyElement(cache._cache, page);
    indexShopifyElement(cache._cache, product);
    indexShopifyElement(cache._cache, collection);

    expect(cache._fetchHandle(ShopifyTypeEnum.Page, 'example')).toEqual(page);
    expect(cache._fetchHandle(ShopifyTypeEnum.Product, 'example'))
        .toEqual(product);
    expect(cache._fetchHandle(ShopifyTypeEnum.Collection, 'example'))
        .toEqual(collection);
  });

  it('can fetch products by handle', () => {
    const cache = new Cache();
    const product = testCreateProduct({
      id: 1,
      handle: 'test',
    });

    cache.set(ShopifyTypeEnum.Product, product);

    expect(cache.getPage('test')).toEqual(null);
    expect(cache.getProduct('test')).toEqual(product);
    expect(cache.getCollection('test')).toEqual(null);
  });

  it('can fetch pages by handle', () => {
    const cache = new Cache();
    const page = testCreatePage({
      id: 1,
      handle: 'test',
    });

    cache.set(ShopifyTypeEnum.Page, page);

    expect(cache.getPage('test')).toEqual(page);
    expect(cache.getProduct('test')).toEqual(null);
    expect(cache.getCollection('test')).toEqual(null);
  });

  it('can fetch collections by handle', () => {
    const cache = new Cache();
    const collection = testCreateCollection({
      id: 1,
      handle: 'test',
    });

    indexShopifyElement(cache._cache, collection);

    expect(cache.getPage('test')).toEqual(null);
    expect(cache.getProduct('test')).toEqual(null);
    expect(cache.getCollection('test')).toEqual(collection);
  });
});
