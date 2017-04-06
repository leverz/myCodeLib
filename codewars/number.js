/**
 * http://www.codewars.com/kata/544aed4c4a30184e960010f4/train/javascript
 * find the divisors
 * @param  {Int} integer 整数
 * @return {[Int] || String} 返回一个divisor组成的数组或字符串
 */
function divisors(integer) {
    let divisor = 2, i = integer / divisor;
    const resultStarts = [], resultEnds = [];
    while (divisor <= i) {
        if (integer % divisor === 0) {
            resultStarts.push(divisor);
            divisor !== i && resultEnds.unshift(i);
        }
        divisor++;
        i = integer / divisor;
    }
    return resultStarts.length !== 0 ? resultStarts.concat(resultEnds) : `${integer} is prime`;
};