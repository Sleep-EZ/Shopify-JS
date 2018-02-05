import { CacheData$Value, CacheOptions } from './cache/index';
export declare function clean_expired(data: CacheData$Value[] | null): CacheData$Value[];
export declare class StorageDriver {
    static DEFAULT_CACHE_KEY_NAME: string;
    opts: CacheOptions;
    constructor(opts?: CacheOptions);
    read(): Promise<CacheData$Value[] | void>;
    write(data: CacheData$Value[]): Promise<boolean>;
}
export declare class ForageStorageDriver extends StorageDriver {
    read(): Promise<CacheData$Value[] | void>;
    write(data: CacheData$Value[]): Promise<boolean>;
}
