import {CACHE_DEFAULT_OPTS} from '../cache/index';
import {clean_expired, StorageDriver} from '../storage';
import {testCreatePage} from '../testing/index';

// Copyright 2018 Sleep EZ USA / Evan Darwin
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

describe('Storage Drivers', () => {
  describe('clean_expired() util function', () => {
    it('returns empty on invalid data', () => {
      expect(clean_expired(null)).toEqual([]);
      expect(clean_expired([])).toEqual([]);
    });

    it('works as expected', () => {
      const page1 = testCreatePage({id: 1});
      const page2 = testCreatePage({id: 2});
      const page3 = testCreatePage({id: 3});

      const testData = [page1, null, page2, page3];
      expect(clean_expired(testData)).toEqual([page1, page2, page3]);
    });
  });

  describe('StorageDriver (parent implementation)', () => {
    describe('option handling', () => {
      it('should default to CACHE_DEFAULT_OPTS', () => {
        const driver = new StorageDriver();
        expect(driver.opts).toEqual(CACHE_DEFAULT_OPTS);
      });

      it('should accept user options', () => {
        const driver = new StorageDriver({cacheTimeout: 100});
        expect(driver.opts).toEqual({cacheTimeout: 100});
      });
    });

    describe('I/O functions (return empty arrays)', () => {
      const driver = new StorageDriver();

      it('read() gets empty data array', (done) => {
        driver.read().then((data) => {
          expect(data).toEqual([]);
          done();
        });
      });

      it('write() returns true', (done) => {
        driver.write([]).then((result) => {
          expect(result).toBeTruthy();
          done();
        });
      });
    });
  });
});