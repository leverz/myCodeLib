/**
 * Created by Lever on 16/7/4.
 */
const _ = {};

_.type = function (obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, "");
};

_.isArray = function (list) {
    return _.type(list) === "Array";
};

_.isString = function (list) {
    return _.type(list) === "String";
};

_.isObject = function (list) {
    return _.type(list) === "Object";
};

_.isFunction = function (list) {
    return _.type(list) === "Function";
};
_.isObjectLike = function (value) {
    return !!value && typeof value === "object";
};
_.getCookie = function (name) {
    const cookieName = `${encodeURIComponent(name)}=`,
        cookieStart = document.cookie.indexOf(cookieName),
        hasNoMatchValue = -1;
    let cookieValue = null;

    if (cookieStart > hasNoMatchValue){
        let cookieEnd = document.cookie.indexOf(";", cookieStart);
        if (cookieEnd === hasNoMatchValue){
            cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(
            document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
        );
    }

    return cookieValue;
};
// 判断是否为低版本IE(小于等于IE9)
_.isOldIE = function () {
    const ua = navigator.userAgent,
        hasMatchValue = 0;
    if (ua.indexOf("MSIE 8.0") > hasMatchValue || ua.indexOf("MSIE 9.0") > hasMatchValue){

        return true;
    }

    return false;
};
// 判断是否为IE浏览器
_.isIE = function(){
    return document.documentMode || +(navigator.userAgent.match(/MSIE (\d+)/) && RegExp.$1);
};
_.isIEVersion = ver => {
    const b = document.createElement("b");
    b.innerHTML = `<!--[if IE ${ver}]><i></i><![endif]-->`;

    return b.getElementsByTagName("i").length === 1;
};

/**
 * 取url中的参数
 * 调用方法_.getUrlParam("参数名")
 * @param {string} name The url param key name.
 * @returns {*} The value with the key in the url search.
 */
_.getUrlParam = function (name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i"),
        stringStart = 1;
    const r = window.location.search.substr(stringStart).match(reg);
    if (r !== null) {
        const valueIndex = 2;

        return decodeURIComponent(r[valueIndex]);
    }

    return null;
};

/**
 * bubbleSort - 冒泡排序
 * @param {Array} arr The array need sort.
 * @param {Number} sortKey The key if target is an array of object.
 * @returns {Array} The sorted array.
 */
_.bubbleSort = function (arr, sortKey) {
    const len = arr.length,
        start = 0,
        gap = 1;
    let i, j, temp, exchange;
    const result = arr.slice(start);
    for (i = 0; i < len; i++){
        exchange = 0;
        for (j = len - gap; j > start; j--){
            if (sortKey ?
                +result[j][sortKey] > +result[j - gap][sortKey] : +result[j] > +result[j - gap]){
                temp = result[j - gap];
                result[j - gap] = result[j];
                result[j] = temp;
                exchange = 1;
            }
        }
        if (!exchange){

            return result;
        }
    }
    
    return result;
};

/**
 * 快速排序
 * @param {Array} arr 一个可以被排序的数组.
 * @returns {Array} 排序后的结果数组
 */
_.quickSort = arr => {
    if (arr.length === 0) {
        return arr;
    }
    const [x, ...others] = arr;
    const smallOrEqual = others.filter(item => item <= x),
        larger = others.filter(item => item > x);
    return _.quickSort(smallOrEqual).concat([x], _.quickSort(larger));
};

/**
 *
 * @param {*} value The value you want to comparing.
 * @param {*} other Next value you want compare with.
 * @returns {boolean} These values equal or not.
 */
_.isEqual = function (value, other) {
    if (value === other) {
        return true;
    }

    if (value === null || other === null) {
        return false;
    }

    if (this.isObjectLike(value) && this.isObjectLike(other)) {
        return _.isEqualDeep(value, other);
    }

    return false;

};

/**
 *
 * @param {Object} obj The object you want to comparing.
 * @param {Object} other Next object you want to compare with.
 * @returns {boolean} These objects equal or not.
 */
_.isEqualDeep = function (obj, other) {
    const objString = JSON.stringify(obj);
    const otherString = JSON.stringify(other);
    
    return objString === otherString;
};

/**
 * 简单的判断两个无嵌套的数组是否相等
 *
 * @param {Array} array1 参与对比的数组1
 * @param {Array} array2 参与对比的数组2
 * @returns {boolean} 判断两个数组是否相等的结果
 */
_.isArrayEqual = (array1 = [], array2 = []) => {
    if (array1 === array2) {
        return true;
    }

    return array1.length === array2.length && array1.every((item, index) => item === array2[index]);
};

/**
 * 简单的判断单层嵌套的对象是否相等
 * @param {Object} obj1 参与对比的对象1
 * @param {Object} obj2 参与对比的对象2
 * @returns {boolean} 判断两个对象是否相等的结果
 */
_.isObjectEqual = (obj1, obj2) => {
    if (!_.isObject(obj1) || !_.isObject(obj2)) {
        return false;
    }

    if (obj1 === obj2) {
        return true;
    }

    const item1Keys = Object.keys(obj1).sort();
    const item2Keys = Object.keys(obj2).sort();

    if (!_.isArrayEqual(item1Keys, item2Keys)) {
        return false;
    }

    return item2Keys.every(key => {
        const value = obj1[key];
        const nextValue = obj2[key];

        if (value === nextValue) {
            return true;
        } else if (_.isFunction(value) && _.isFunction(nextValue)) {
            // 这里不对function类型做判断，只要对应的key都是function就认为这个属性相等
            // 这样做是为了配合react的使用，过滤掉对相同的function的定义导致的重复渲染
            return true;
        }

        return _.isArray(value) && _.isArray(nextValue) && _.isArrayEqual(value, nextValue);
    });
};

/**
 * 数组切片
 * @param {Array} data The data array you want to cut as chunk.
 * @param {Number} dis You need design chunk's min length.
 * @param {Number} index You need get your chunk start from your origin data.
 * @returns {Array} The chunk after cut.
 */
_.chunkData = function (data = [], dis = 20, index = 0) {
    if (data.length <= dis) {
        return data;
    }

    const dataChunk = data.slice(index, dis);

    return dataChunk;
};

/**
 * 获得数组中的最大值
 * @param {Array} arr 一个不能为空的可比较大小的数组
 * @returns {*} 比较之后的最大值
 */
_.maximum = arr => {
    if (arr.length === 0) {
        throw Error("Maximum of empty list");
    } else if (arr.length === 1) {
        return arr[0];
    }
    const [x, ...others] = arr;

    return Math.max(x, _.maximum(others));
};

/**
 * 产生一个重复相同内容的数组
 * @param {Number} n 重复数量
 * @param {*} x 重复的内容
 * @returns {Array}  得到的内容重复的数组
 */
_.replicate = (n, x) => {
    return n <= 0 ? [] : [x].concat(_.replicate(n - 1, x));
};

/**
 * 从一个数组中取出一定数量的元素
 * @param {Number} n 取出的个数
 * @param {Array} arr 被提取的数组
 * @returns {*} 提取后的结果
 */
_.take = (n, arr) => {
    const [x, ...xs] = arr;

    return n <= 0 || arr.length === 0 ? [] : [x].concat( _.take(n - 1, xs));
};

/**
 * 将两个列表捆绑在一起，以较短的为基准
 * @param {Array} arr1 列表1
 * @param {Array} arr2 列表2
 * @returns {*} 捆绑之后的结果
 * [[x1, y1], [x2, y2]...[xn, yn]]
 */
_.zip = (arr1, arr2) => {
    const [x, ...xs] = arr1, [y, ...ys] = arr2;

    return arr1.length === 0 || arr2.length === 0 ? [] : [[x, y]].concat(_.zip(xs, ys));
};

/**
 * 连续调用两次某一函数
 * @param {Function} func 可执行并返回与该函数所需参数类型相同类型的值
 * @param {*} args 初次执行时所需的参数
 * @returns {*} 要求与参数类型应该一致
 */
_.applyTwice = (func, args) => func(func(args));

/**
 * 将两个数组，通过一定的处理函数，融合成为一个数组
 * @param {Function} func 处理函数，将两个数组中的相应元素处理后得出一个值
 * @param {Array} arr1 数组1
 * @param {Array} arr2 数组2
 * @returns {Array} 压缩两个数组后得到的结果
 */
_.zipWith = (func, arr1, arr2) => {
    const [x, ...xs] = arr1, [y, ...ys] = arr2;

    return arr1.length === 0 || arr2.length === 0 ? [] : [].concat(func(x, y), _.zipWith(func, xs, ys));
};

/**
 * 颠倒参数传递
 * @param {Function} func 需要被执行的函数
 * @param {*} y 参数1
 * @param {*} x 参数2
 * @returns {*} func的执行结果
 */
_.flip = (func, y, x) => func(x, y);

/**
 * 递归实现的map函数
 * TODO：还需要添加index值作为参数传入func中
 * @param {Function} func 对数组的每一个元素都要执行的函数
 * @param {Array} arr 源数组
 * @returns {Array} 结果组成的数组
 */
_.map = (func, arr) => {
    const [x, ...xs] = arr;

    return arr.length === 0 ? [] : [].concat(func(x), _.map(func, xs));
};

/**
 * 递归实现的filter函数
 * @param {Function} func 对数组中的每一个元素都要进行判断的函数，返回值应该为Bool类型
 * @param {Array} arr 需要执行过滤操作的数组
 * @returns {Array} 满足条件的数组
 */
_.filter = (func, arr) => {
    const [x, ...xs] = arr;

    return arr.length === 0 ? [] : func(x) && [x].concat(_.filter(func, xs)) || _.filter(func, xs);
};

_.now = () => Date.now();


/**
 * 函数防抖
 * @param {Function} fn 需要防抖的执行函数
 * @param {Number} delay 延迟执行的时间
 * @returns {function()} 包装过后具有防抖功能的函数
 */
_.debounce = (fn, delay) => {
    let TIMER = null;
    return (...args) => {
        clearTimeout(TIMER);
        TIMER = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

/**
 * 函数节流
 * @param {Function} fn 需要节流的执行函数
 * @param {Number} delay 每多少秒最多触发一次
 * @returns {function()} 包装过后具有节流功能的函数
 */
_.throttle = (fn, delay) => {
    let Timer = null, previous = 0;
    const later = (...args) => {
        previous = _.now();
        Timer = null;
        fn(...args);
    };
    return (...args) => {
        const now = _.now();
        !previous && (previous = now);
        const remaining = delay - (now - previous);
        if (remaining <= 0 || remaining > delay) {
            clearTimeout(Timer);
            previous = now;
            fn(...args);
        } else if (!Timer) {
            Timer = setTimeout(() => later(...args), remaining);
        }
    };
};

/**
 * 求得累加值
 * @param {Array} xs 需要累加的值组成的数组
 * @returns {*} 累加后的结果
 */
_.sum = xs => xs.reduce((prev, cur) => cur + prev);

_.map2 = (f, xs) => xs.reduce((prev, cur) => prev.concat(f(cur)), []);

/**
 * 日期格式化
 * TODO: 暂不支持添加格式化规则，后期需进行各种规则的匹配。
 * @param {Date} date 需要格式化的日期
 * @param {String} rule 格式化后生成日期的样式规则
 * @returns {string} 格式化后的生成的内容
 */
_.formatDate = (date, rule) => {
    const newDate = new Date(date);
    switch (rule) {
        case "yy-mm":
            return `${newDate.getFullYear()}-${newDate.getMonth() + 1 > 9 ? newDate.getMonth() + 1 : "0" + (newDate.getMonth() + 1)}`;
        default:
            return `${newDate.getFullYear()}-${newDate.getMonth() + 1 > 9 ? newDate.getMonth() + 1 : "0" + (newDate.getMonth() + 1)}-${newDate.getDate() > 9 ? newDate.getDate() : "0" + newDate.getDate()}`;
    }
};

/**
 * 合并两个对象
 * @param {Object} target 原对象
 * @param {Object} source 需要与原对象合并的对象（与原对象有相同属性时，保留它的，覆盖原对象的）
 * @param {Object} others 其他需要与原对象合并的对象
 * @returns {Object} 合并后的结果
 */
_.merge = (target, source, ...others) => {
    let newTarget = { ...target };
    if (typeof target !== "object") {
        newTarget = {};
    }
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            const newSource = source[key];
            typeof newSource === "object" &&
            (newTarget[key] = _.merge(newTarget[key], newSource)) ||
            (newTarget[key] = newSource);
        }
    }

    others.forEach(item => _.merge(newTarget, item));

    return newTarget;
};

/**
 * Hex转RGB
 * @param {String} color Hex颜色值
 * @returns {string} RGB颜色值
 */
_.hexToRgb = (color) => {
    let newColor = color.replace("#", "");
    if (newColor.length === 3) {
        newColor = newColor.split("").map(item => parseInt(`0x${item}${item}`));
    } else {
        newColor = newColor.split("").map((item, index) => {
            if (index % 2 === 0) {
                return parseInt(`0x${item}${newColor[index + 1]}`);
            }
            return "";
        }).filter(item => item !== "");
    }
    const result = {
        rgb: newColor
    };
    result.toString = () => `RGB(${newColor.join(",")})`;

    return result;
};

/**
 * RGB转Hex
 * @param {Array} color R、G、B三个值
 * @returns {string} Hex值
 */
_.rgbToHex = (...color) => {
    const newColor = color.map(item => {
        return Number(item).toString(16).length < 2 ?
            `0${Number(item).toString(16)}` :
            Number(item).toString(16);
    }).join("");

    return `#${newColor}`;
};

/**
 * 按比例混合两种颜色得到新的颜色
 * @param {String} color1 Hex类型的颜色
 * @param {String} color2 Hex类型的颜色
 * @param {Number} weight 比重
 * @returns {string} 混合后的结果
 */
_.colorMix = (color1, color2, weight) => {
    const rgb1 = _.hexToRgb(color1).rgb;
    const rgb2 = _.hexToRgb(color2).rgb;
    const newRGB = rgb1.map((item, index) => parseInt(item * weight + rgb2[index] * (1 - weight)));

    return _.rgbToHex(...newRGB);
};

/**
 * 组合函数
 * @param {Function} f 函数1
 * @param {Function} g 函数2
 * @returns {function} 函数3 函数2的结果是函数1的参数
 */
_.compose = (f, g) => x => f(g(x));

/**
 * 获取客户端的展示界面的信息
 * @returns {{left: number, top: number, width: number, height: number}} left表示当前内容距内容的最左部的距离，top表示当前的内容距内容的最顶部的距离，width、height表示窗口的大小
 */
_.getClientFace = () => {
    return {
        left   : document.documentElement.scrollLeft || document.body.scrollLeft,
        top    : document.documentElement.scrollTop || document.body.scrollTop,
        width  : document.documentElement.clientWidth,
        height : document.documentElement.clientHeight
    };
};

_.getSubClientPosition = element => {
    if (!element.offsetParent) {
        return {
            left : element.offsetLeft,
            top  : element.offsetTop
        };
    }
    const parent = _.getSubClientPosition(element.offsetParent);
    return {
        left : element.offsetLeft + parent.left,
        top  : element.offsetTop + parent.top
    };
};
_.getSubClientSize = element => {
    return {
        width  : element.offsetWidth,
        height : element.offsetHeight
    };
};

_.getSubClientFace = element => {
    const ePosition = _.getSubClientPosition(element);
    const eSize = _.getSubClientSize(element);

    return {
        ...ePosition,
        ...eSize
    };
};

_.domIntersect = (rec1, rec2) => Math.abs(rec1.left + rec1.width / 2 - rec2.left - rec2.width / 2) < (rec1.width + rec2.width) / 2 &&
    Math.abs(rec1.top + rec1.height / 2 - rec2.top - rec2.height / 2) < (rec1.height + rec2.height) / 2;

_.lazyLoad = (element, action) => {
    return new Promise(resolve => {
        const eventChain = x => _.domIntersect(_.getSubClientFace(element), _.getClientFace()) && resolve(eventChain);
        action(eventChain);
    });
};

_.calculateDate = (type, n, origin) => {
    const date = new Date(origin);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    switch (type) {
        case "Y":
            return date.setFullYear(year + n);
        case "M":
            return date.setMonth(month + n);
        case "D":
            return date.setDate(day + n);
        default:
            return date;
    }
};

_.createArray = (from, to) => {
    if (from === to) {
        return [from];
    }
    return [from].concat(_.createArray(from + (from > to ? -1 : 1), to));
};

_.interpolateProvider = (scope, template) => {
    const scopeReg = /{{.+}}/g,
        startSymbol = "{{",
        endSymbol = "}}";
    return template.replace(scopeReg, text => {
        const symbol = text.replace(startSymbol, "").replace(endSymbol, "");
        return scope[symbol];
    });
}
module.exports = _;

