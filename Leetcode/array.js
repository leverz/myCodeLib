/**
 * 532. K-diff Pairs in an Array
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findPairs = function(nums, k) {
    if (k < 0) {
        return 0;
    }
    const results = nums.reduce((r, cur, index) => {
        r[cur] = r[cur] !== undefined ? index : true;
        return r;
    }, {}), resultsKeyList = Object.keys(results);
    return k === 0 ? resultsKeyList.filter(key => results[key] !== true).length : resultsKeyList.filter(key => results[+key + k]).length;
};

/**
 * 495. Teemo Attacking
 * @param {number[]} timeSeries
 * @param {number} duration
 * @return {number}
 */
var findPoisonedDuration = function(timeSeries, duration) {
    let len = timeSeries.length, count = duration * len;
    return timeSeries.reduce((acc, time, index) => 
        index === 0 ? 
            acc : 
            acc - Math.max(0, duration - (time - timeSeries[index - 1])), 
    duration * timeSeries.length)
};