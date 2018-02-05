import {__ts_resolve_type, getCurrentEpoch, isExpired, pluralizeType} from '../lib';
import {testCreateCollection, testCreatePage, testCreateProduct} from '../testing/index';
import {GenericShopifyType, ShopifyTypeEnum} from '../types';


describe('ShopKeeper internal lib', () => {
  it('getting current timestamp works', () => {
    const current = Date.now();

    expect(getCurrentEpoch()).toBeGreaterThanOrEqual(current);
  });

  it('pluralize types works', () => {
    Object.values(ShopifyTypeEnum).forEach((type) => {
      expect(pluralizeType(type as ShopifyTypeEnum)).toEqual(`${type}s`);
    });
  });

  it('check isExpired() works', () => {
    const now = Date.now();

    expect(isExpired(now - 3)).toBeTruthy();
    expect(isExpired(now + 5)).toBeFalsy();
  });

  it('check __ts_resolve_type always returns', () => {
    const page = testCreatePage({});
    const product = testCreateProduct({});
    const collection = testCreateCollection({});

    expect(__ts_resolve_type(page)).toEqual(page);
    expect(__ts_resolve_type(product)).toEqual(product);
    expect(__ts_resolve_type(collection)).toEqual(collection);
    expect(__ts_resolve_type({} as GenericShopifyType)).toEqual({});
  });
});