/**
 * 118.Pascal's Triangle
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    if (numRows === 0) {
        return [];
    }
    const start = 0, end = numRows - 1, arr = [];
    arr[start] = 1;
    arr[end] = 1;
    const oldArr = generate(end), oldLen = oldArr.length, prevArr = oldArr[oldLen - 1];
    for (let i = 1; i < end; i++) {
        arr[i] = prevArr[i - 1] + prevArr[i]
    }
    return oldArr.concat([arr]);
};