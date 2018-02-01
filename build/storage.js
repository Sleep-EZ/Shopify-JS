"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var localForage = require('localforage');
var index_1 = require("./cache/index");
var lib_1 = require("./lib");
function clean_expired(data) {
    var cleaned = [];
    data.forEach(function (item) {
        if (item && !lib_1.isExpired(item.__expires)) {
            cleaned.push(item);
        }
    });
    return cleaned;
}
var StorageDriver = /** @class */ (function () {
    function StorageDriver(opts) {
        this.opts = opts || index_1.CACHE_DEFAULT_OPTS;
    }
    StorageDriver.prototype.read = function () {
        return Promise.resolve([]);
    };
    StorageDriver.prototype.write = function (data) {
        console.log('WRITE: ' + data.length); // TODO: Make unused param, used...
        return Promise.resolve(true);
    };
    StorageDriver.DEFAULT_CACHE_KEY_NAME = 'shopify_js_cache';
    return StorageDriver;
}());
exports.StorageDriver = StorageDriver;
var ForageStorageDriver = /** @class */ (function (_super) {
    __extends(ForageStorageDriver, _super);
    function ForageStorageDriver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForageStorageDriver.prototype.read = function () {
        var cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;
        console.log('READ');
        return localForage.getItem(cacheKey)
            .then(function (data) { return ((data) ? clean_expired(data) : undefined); })["catch"](function (e) { return console.error(e); });
    };
    ForageStorageDriver.prototype.write = function (data) {
        var cacheKey = StorageDriver.DEFAULT_CACHE_KEY_NAME;
        return localForage.setItem(cacheKey, data).then(function () { return true; });
    };
    return ForageStorageDriver;
}(StorageDriver));
exports.ForageStorageDriver = ForageStorageDriver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdG9yYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUUzQyx1Q0FBaUQ7QUFDakQsNkJBQWdDO0FBRWhDLHVCQUF1QixJQUFzQjtJQUMzQyxJQUFNLE9BQU8sR0FBcUIsRUFBRSxDQUFDO0lBRXJDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1FBQ2YsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFHRDtJQUlFLHVCQUFZLElBQW1CO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLDBCQUFrQixDQUFDO0lBQ3pDLENBQUM7SUFFRCw0QkFBSSxHQUFKO1FBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELDZCQUFLLEdBQUwsVUFBTSxJQUFzQjtRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBRSxtQ0FBbUM7UUFFMUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQWZNLG9DQUFzQixHQUFHLGtCQUFrQixDQUFDO0lBZ0JyRCxvQkFBQztDQUFBLEFBakJELElBaUJDO0FBakJZLHNDQUFhO0FBbUIxQjtJQUF5Qyx1Q0FBYTtJQUF0RDs7SUFnQkEsQ0FBQztJQWZDLGtDQUFJLEdBQUo7UUFDRSxJQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsc0JBQXNCLENBQUM7UUFFdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwQixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7YUFDL0IsSUFBSSxDQUFDLFVBQUMsSUFBMkIsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUNqRixPQUFLLENBQUEsQ0FBQyxVQUFDLENBQVEsSUFBSyxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsbUNBQUssR0FBTCxVQUFNLElBQXNCO1FBQzFCLElBQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztRQUV0RCxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQWhCRCxDQUF5QyxhQUFhLEdBZ0JyRDtBQWhCWSxrREFBbUIifQ==