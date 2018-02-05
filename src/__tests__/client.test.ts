import {Client} from '../client';
import {ShopifyTypeEnum} from '../types';


describe('Shopify-JS Client', () => {
  describe('handles domain validation properly', () => {
    it('".com" fails', () => {
      expect(() => (new Client({domain: '.com'})))
          .toThrowErrorMatchingSnapshot();
    });

    it('"invalid" fails', () => {
      expect(() => (new Client({domain: 'invalid'})))
          .toThrowErrorMatchingSnapshot();
    });

    it('"" (empty) fails', () => {
      expect(() => (new Client({domain: ''}))).toThrowErrorMatchingSnapshot();
    });

    it('"google.com" succeeds', () => {
      const client = new Client({domain: 'google.com'});
      expect(client).toBeInstanceOf(Client);
    });

    it('"corp.intel.com" succeeds', () => {
      const client = new Client({domain: 'corp.intel.com'});
      expect(client).toBeInstanceOf(Client);
    });

    it('"xn-12jong3h33.com" (IDN) succeeds', () => {
      const client = new Client({domain: 'xn-12jong3h33.com'});
      expect(client).toBeInstanceOf(Client);
    });
  });

  describe('_resolvePath()', () => {
    const client = new Client({domain: 'example.com '});

    it('can resolve pages', () => {
      expect(client._resolve_path(ShopifyTypeEnum.Page, 'example'))
          .toEqual('/pages/example.json');
      expect(client._resolve_path(ShopifyTypeEnum.Page, 'example', 'test'))
          .toEqual('/pages/example/test.json');
    });

    it('can resolve products', () => {
      expect(client._resolve_path(ShopifyTypeEnum.Product, 'example'))
          .toEqual('/products/example.json');
      expect(client._resolve_path(ShopifyTypeEnum.Product, 'example', 'test'))
          .toEqual('/products/example/test.json');
    });

    it('can resolve collections', () => {
      expect(client._resolve_path(ShopifyTypeEnum.Collection, 'example'))
          .toEqual('/collections/example.json');
      expect(client._resolve_path(
                 ShopifyTypeEnum.Collection, 'example', 'products'))
          .toEqual('/collections/example/products.json');
    });
  });
});