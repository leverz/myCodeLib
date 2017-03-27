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