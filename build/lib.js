"use strict";
exports.__esModule = true;
/**
 * Return the current unix time (time since epoch)
 *
 * We only need data resolution to the second.
 */
function getCurrentEpoch() {
    return Date.now();
}
exports.getCurrentEpoch = getCurrentEpoch;
function pluralizeType(type) {
    return type + "s";
}
exports.pluralizeType = pluralizeType;
function isExpired(expiredAt) {
    return (getCurrentEpoch() > expiredAt);
}
exports.isExpired = isExpired;
function __ts_resolve_type(item) {
    if ('products' in item) {
        return item;
    }
    if ('options' in item) {
        return item;
    }
    if ('body_html' in item && !('variants' in item)) {
        return item;
    }
    return item;
}
exports.__ts_resolve_type = __ts_resolve_type;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOzs7O0dBSUc7QUFDSDtJQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUZELDBDQUVDO0FBRUQsdUJBQThCLElBQXFCO0lBQ2pELE1BQU0sQ0FBSSxJQUFJLE1BQUcsQ0FBQztBQUNwQixDQUFDO0FBRkQsc0NBRUM7QUFFRCxtQkFBMEIsU0FBaUI7SUFDekMsTUFBTSxDQUFDLENBQUMsZUFBZSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUZELDhCQUVDO0FBRUQsMkJBQWtDLElBQXdCO0lBRXhELEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBRSxJQUEyQixDQUFDO0lBQ3RDLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUUsSUFBd0IsQ0FBQztJQUNuQyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUUsSUFBcUIsQ0FBQztJQUNoQyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFmRCw4Q0FlQyJ9