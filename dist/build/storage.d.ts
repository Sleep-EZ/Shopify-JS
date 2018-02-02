import { CacheData$Values, CacheOptions } from './cache/index';
export declare class StorageDriver {
    static DEFAULT_CACHE_KEY_NAME: string;
    opts: CacheOptions;
    constructor(opts?: CacheOptions);
    read(): Promise<CacheData$Values | void>;
    write(data: CacheData$Values): Promise<boolean>;
}
export declare class ForageStorageDriver extends StorageDriver {
    read(): Promise<CacheData$Values | void>;
    write(data: CacheData$Values): Promise<boolean>;
}
