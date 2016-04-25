/**
 * Created by Lever on 16/4/14.
 */

/**
 * JavaScript排序算法实现
 * insertSort - 插入排序:
 *          @param {Array} arr
 *          @return {Array}
 */

var insertSort = function (arr) {
    var len = arr.length;
    if(len <= 1){
        return arr;
    }

    for(var i = 1; i < arr.length; i++){
        var temp = arr[i];
        for (var j = i; j > 0 && arr[j-1] > temp; j--){
            arr[j] = arr[j-1];
        }
        arr[j] = temp;
    }
    return arr;
};

/**
 * shellSort - 希尔排序
 * @param {Array} arr
 */
var shellSort = function (arr) {
    var len = arr.length;
    if(len <= 1){
        return arr;
    }

    for(var increment = Math.floor(len / 2); increment > 0; increment = Math.floor(increment / 2)){
        for(var i = increment; i < len; i++){
            var temp = arr[i];
            for(var j = i; j >= increment; j -= increment){
                if(arr[j] < arr[j-increment]){
                    arr[j] = arr[j-increment];
                }else{
                    break;
                }
            }
            arr[j] = temp;
        }
    }
    return arr;
};


/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    var count = 0;//统计使用硬币的数量
    var coinArr = [];//使用的面值统计
    var coinsLen = coins.length;
    var len = coins.length;
    var stateAmount = amount;
    if(coinsLen > 1){
        for(var i = 1; i < coinsLen; i++){
            var temp = coins[i];
            for (var j = i; j > 0 && coins[j-1] > temp; j--){
                coins[j] = coins[j-1];
            }
            coins[j] = temp;
        }
    }
    /*最小面值仍比amount大的情况*/
    if(amount < coins[0]){
        return -1;
    }

    function getCount() {
        var i = len;
        for(i; i > 0; i--){
            coinsLen = i;
            if(amount === 0){
                return count;
            }else{
                while(amount !== 0){
                    if(coins[coinsLen-1] > amount){
                        if(coinsLen <= 1){
                            count--;
                            amount += coins[i-1];
                            break;
                        }
                        coinsLen--;
                    }else{
                        count++;
                        coinArr.push(coins[coinsLen-1]);
                        amount = amount - coins[coinsLen-1];
                    }
                }
            }
        }
        return count;
    }

    count = getCount();
    //TODO 实现两者的递归调用
    function isOver() {
        if(amount === 0){
            console.log(count);
            return count;
        }else if(count > 0){
            len--;
            amount = stateAmount;
            count = 0;
            getCount();
        }

        if(i <= 0)
            return -1;
    }
    var result = isOver();
    return result;
};

var coins = [5,7,8];
var amount = 17;
var count = coinChange(coins, amount);
console.log(count);