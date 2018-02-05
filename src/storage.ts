// Copyright (C) 2018 Sleep EZ USA / Evan Darwin
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


const localForage = require('localforage');
import {CacheData$Value, CacheOptions} from './cache/index';
import {CACHE_DEFAULT_OPTS} from './cache/index';
import {isExpired} from './lib';

export function clean_expired(data: CacheData$Value[]|null): CacheData$Value[] {
  const cleaned: CacheData$Value[] = [];
  if (!data) return cleaned;

  data.forEach(item => {
    if (item && !isExpired(item.__expires)) {
      cleaned.push(item);
    }
  });

  return cleaned;
}


export class StorageDriver {
  static DEFAULT_CACHE_KEY_NAME = 'shopify_js_cache';
  opts: CacheOptions;

  constructor(opts?: CacheOptions) {
    this.opts = opts || CACHE_DEFAULT_OPTS;
  }

  read(): Promise<CacheData$Value[]|void> {
    return Promise.resolve([]);
  }

  write(data: CacheData$Value[]): Promise<boolean> {
    console.log('WRITE: ' + data.length);  // TODO: Make unused param, used...

    return Promise.resolve(true);
  }
}

export class ForageStorageDriver extends StorageDriver {
  read(): Promise<CacheData$Value[]|void> {
    const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

    console.log('READ');

    return localForage.getItem(cacheKey)
        .then((data: CacheData$Value[]|null) => (clean_expired(data)))
        .catch((e: Error) => console.error(e));
  }

  write(data: CacheData$Value[]): Promise<boolean> {
    const cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;

    return localForage.setItem(cacheKey, data).then(() => true);
  }
}