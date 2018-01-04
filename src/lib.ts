/**
 * Return the current unix time (time since epoch)
 *
 * We only need data resolution to the second.
 */
function getCurrentEpoch(): number {
    return + new Date();
}