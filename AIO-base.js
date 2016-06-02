var client = require('./user_agent_test.js');
/*
	获取URL参数
 */
function getQueryStringArgs () {
	// body...
	var qs = (location.search.length > 0 ? location.search.substring(1) : ""),  //str.substring(indexStart[,indexEnd]),在这里的作用是去掉location.search返回的字符串中，一开始的'?'。
		args = {},
		items = qs.length ? qs.split('&') : [],
		item = null,
		name = null,
		value = null,
		i = 0,
		len = items.length;

	for(i = 0; i < len; i++){
		item = items[i].split('=');
		name = decodeURIComponent(item[0]); //decodeURIComponent()用来对encodeURIComponent()函数编码的URI进行解码。
		value = decodeURIComponent(item[1]);

		if(name.length){
			args[name] = value;
		}
	}
	return args;
} 

/*
 *	DOM：NodeList是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。
 *	NodeList中的值可以通过方括号的语法来访问，而且这个对象有length属性，但它并不是Array的实例。
 *	NodeList的值是基于DOM结构动态执行查询的结果，因此DOM结构的变化能够自动反映在NodeList对象中。
 *	访问保存在NodeList中的节点eg: 
 *	var firstChild = someNode.childNodes[0];
 *	var secondChild = someNode.childNodes.item(1);
 *	var count = someNode.childNodes.length;
 *	注：每一个节点都有一个childNodes属性，其中保存着一个NodeList对象。
 *
 * convertToArray()函数可以将NodeList对象转换为数组。
 */

function convertToArray(nodes){
	var array = [];
	try{
		array = Array.prototype.slice.call(nodes,0);  //arr.slice(begin[,end])从arr数组中抽出一部分。或者说复制出一部分。
	}catch (ex) {
		// IE8及更早版本中，NodeList是一个COM对象，无法用js对象那样使用它，所以这里采用了手动枚举的方式。
		for(var i = 0; i < nodes.length; i++){
			array.push(nodes[i]);
		}
	}
	return array;
}




/*
 *很多时候js要在DOM结构加载完成之后，执行一些操作。
 *而常见的window.onload,只会在页面的所有内容都加载完成之后才会被触发。
 *这样的话，如果我们有大量图片要加载，window.onload就会等待很久才会执行。
 *
 *因此，我们需要有一个DOM Ready事件。
 *现代浏览器已经支持了DOMContentLoaded事件，但我们还是得处理一下那些老旧的浏览器。
 *
 * 在jQuery中，DOM Ready事件有三种用法：
 * 1.$(document).ready(function(){	//handler 	});
 * 2.$(function(){	//handler 	});
 * 3.$().ready(function(){	//handler 	});
 */


/*
 *动态加载外部JavaScript脚本
 *eg:动态加载user_agent_test.js文件。
 *		loadScript('user_agent_test');
 */
function loadScript(url){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	document.body.appendChild(script);
}

/*
 *动态加载行内JavaScript脚本
 *eg: loadScriptString('function sayHi(){alert("hi");}');
 *
 * code中的代码会在全局作用域中执行，跟eval()函数的作用是一样的。
 */
function loadScriptString(code){
	var script = document.createElement("script");
	script.type = "text/javascript";
	try{
		script.appendChild(document.createTextNode(code));
	}catch(ex){
		script.text = code;//IE中把script标签当做了一个特殊的标签，不允许插入子元素，但可以通过text属性向其中添加内容。
	}
	document.body.appendChild(script);
}

/*
 *动态加载外部CSS文件
 *eg:动态加载style.css文件。
 *		loadStyles('style');
 */
function loadStyles(url){
	var link = document.createElement('link');
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = url;
	var head = document.getElementByTagName("head")[0];
	head.appendChild(link);
}

/*
 *动态加载嵌入式CSS
 *eg: loadStyleString('body{background-color:red;}');
 */

var loadStyleString = function(css){
	var style = document.createElement('style');
	style.type = "text/css";
	try{
		style.appendChild(document.createTextNode(css));
	}catch(ex){
		style.styleSheet.cssText = css;//IE中style标签同script标签一样，不能直接插入子元素，但是可以通过为styleSheet.cssText赋值来实现。
	}
	var head = document.getElementByTagName('head')[0];
	head.appendChild(style);
}

/*
 *遍历元素的子元素
 */
function processChild(element,callback){
	var i,len,child = element.firstChild;
	while(child != element.lastChild){
		if(child.nodeType == 1){
			callback && callback(child);//检查是不是元素，以应对除IE外空白元素不会返回文本节点的情况。
		}
		child = child.nextSibling;
	}
}
function newProcessChild(element,callback){
	var i,len,child = element.firstChild;
	while(child != element.lastElementChild){
		callback && callback(child);
	}
	child = child.nextElementSibling;
	// 只返回元素节点，不存在空白元素也当做子节点的情况。支持IE9+。
}

/*
 *在操作类名时，需要通过className属性添加、删除和替换类名。
 *因为className中是一个字符串，所以即使只修改字符串的一部分，也必须每次
 *都设置整个字符串的值。
 */
function classNameToArray(element){
	var className = element.className.split(/\s+/);
	return className;
}
var removeClass = function(element,className){
	//BUG:如果没有这个class，会直接删除最后一个class
	var pos = -1,i,len;
	var classNames = classNameToArray(element);
	for(i = 0, len = classNames.length; i < len; i++){
		if (classNames[i] === className){
			pos = i;
			break;
		}
	}
	if(pos > -1){
		classNames.splice(pos,1);//处理bug	
	}
	element.className = classNames.join(" ");
}
var addClass = function(element,className){
	element.className += ' '+className;
}
var replaceClass = function(element,replaceClass,className){
	var classNames = classNameToArray(element);
	var i,len;
	for(i = 0, len = classNames.length; i < len; i++){
		if(classNames[i] === replaceClass){
			className[i] = className;
			break;
		}
	}
}

/*
 *判断某个节点是不是另一个节点的后代
 */
function contains(refNode, otherNode){
	if(typeof refNode.contains == 'function' && (!client.engine.webkit || client.engine.webkit >= 522)){ //webkit版本号小于522的Safari浏览器中，contains方法不能正常使用。
		return refNode.contains(otherNode);
	}else if(typeof refNode.compareDocumentPostion == "function"){
		return !!(refNode.compareDocumentPostion(otherNode) & 16)
	}else{
		var node = otherNode.parentNode;
		do{
			if(node === refNode){
				return true;
			}else{
				node = node.parentNode;
			}
		} while (node !== null); //文档树的顶端，parentNode值为null
		return false;
	}
}

/*
 *根据浏览器检测使用哪个方法来实现innerText的功能
 *这里需要解释一下innerText和textContent的差别：
 *innerText会忽略行内样式和脚本，而textContent会返回行内的样式和脚本。
 *所以，不要写行内样式和脚本！！！
 */
function getInnerText(element){
	return (typeof element.textContent == 'String') ? element.textContent : element.innerText;
}

function setInnerText(element, text){
	if (typeof element.textContent == 'String'){
		element.textContent = text;
	}else{
		element.innerText = text;
	}
}

/*
 * 获取某个元素在页面上的偏移量
 */
function getElementLeft(element){
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;

	while(current !== null){
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}

	return actualLeft;
}

function getElementTop(element){
	var actualTop = element.offsetTop;
	var current = element.offsetParent;

	while(current !== null){
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}

	return actualTop;
}

/*
 * 获取客户区的大小（content+padding）
 */
function getViewport(){
	if(document.compatMode == 'BackCompat'){
		return {
			width: document.body.clientWidth,
			height: document.body.clientHeight
		};
	} else{
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		};
	}
}

/*
 *滚动大小：
 *scrollHeight-->在没有滚动条的情况下，元素内容的总高度。(所有内容的高度)
 *scrollWidth-->在没有滚动条的情况下，元素内容的总宽度。（所有内容的宽度）
 *scrollLeft-->被隐藏在内容区左侧的像素数。
 *scrollTop-->被隐藏在内容区上方的像素数。
 *其中,可以通过设置scrollLeft和scrollTop的值，来改变元素的滚动位置
 */

function getBoundingClientRect(element){
	var scrollTop = document.documentElement.scrollTop;
	var scrollLeft = document.documentElement.scrollLeft;

	if(element.getBoundingClientRect){
		if(typeof arguments.callee.offset != 'number'){
			var temp = document.createElement('div');
			temp.style.cssText = 'position:absolute;left:0;top:0;';
			document.body.appendChild(temp);
			arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
			document.body.removeChild(temp);
			temp = null;
		}
		var rect = element.getBoundingClientRect();
		var offset = arguments.callee.offset;

		return {
			left: rect.left + offset,
			right: rect.right + offset,
			top: rect.top + offset,
			bottom: rect.bottom + offset
		};
	}else{
		var actualLeft = getElementLeft(element);
		var actualTop = getElementTop(element);

		return{
			left: actualLeft - scrollLeft,
			right: actualLeft + element.offsetWidth - scrollLeft,
			top: actualTop - scrollTop,
			bottom: actualTop + element.offsetHeight - scrollTop
		}
	}
}

/*
 *获取某个元素下的所有子元素
 *NodeInterator用于遍历DOM结构
 *可以使用createNodeIterator方法创建他的实例。
 *这个方法接受四个参数：
 *root————搜索起点
 *whatToShow————要访问哪些节点的数字代码
 *filter————过滤器
 *entityReferenceExpansion————布尔值，表示是否要扩展实体引用。
 */
function getChildren(element){
	var iterator = document.createNodeIterator(element, NodeFilter, SHOW_ELEMENT, null, false);
	var node = iterator.nextNode();
	var nodeList = [];
	while(node !== null){
		nodeList.push(node);
		node = iterator.nextNode();
	}
	return nodeList;
}
/*
 *通用的事件处理函数。
 * TODO: 没有对IE中attachEvent函数的作用域进行处理
 * addEventListener的使用会创建自己的作用域，而attachEvent的作用域依旧是window
 *
 * update: 新增针对跨浏览器的事件对象处理。实现兼容多浏览器。
 *
 * 使用时，应该先用EventUtil.getEvent()函数获取Event对象
 * 
 */
var EventUtil = {
	addHandler: function(element, type, handler){
		if(element.addEventListener){
			element.addEventListener(type, handler, false);
		}else if(element.attachEvent){
			element.attachEvent('on' + type, handler);
		}else{
			element['on' + type] = handler;
		}
	},
	removeHandler: function(element, type, handler){
		if(element.removeEventListener){
			element.removeEventListener(type, handler, false);
		}else if(element.detachEvent){
			element.detachEvent('on' + type, handler);
		}else{
			element['on' + type] = null;
		}
	},
	getEvent: function(event){
		return event ? event : window.event;
	},
	getTarget: function(event){
		return event.target || event.srcElement;
	},
	preventDefault: function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	},
	stopPropagation: function(event){
		if (event.stopPropagation) {
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	},
	getRelatedTarget: function(event){
		if(event.relatedTarget){
			return event.relatedTarget;//mouseover和mouseout事件的event对象中保存着relatedTarget属性，来提供相关元素的信息。对mouseover来说，事件的主目标获得光标，而相关元素失去光标。mouseout是事件的主目标失去光标，而相关元素获得光标。
		}else if(event.toElement){
			return event.toElement;//IE中mouseout的event对象的toElement属性保存相关元素信息
		}else if(event.fromElement){
			return event.fromElement;//IE中的mouseover的event对象的fromElement属性保存着相关元素信息
		}else{
			return null;
		}
	},
	getButton: function(event){
		//针对mousedown和mouseup事件
		//检测MouseEvents这个特性，如果是IE就对它进行DOM操作规范化
		//0==>主鼠标按钮，1==>鼠标滚轮按钮，2==>次鼠标按钮
		if(document.implementation.hasFeature('MouseEvents', '2.0')){
			return event.button;
		}else{
			switch(event.button){
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;
			}
		}
	},
	getWheelDelta: function(event){
		// 针对mousewheel事件
		// event对象中有个wheelDelta属性
		// 用户向前滚动滚轮时，wheelDelta的值为120的倍数
		// 向后滚动时，wheelDelta是-120的倍数
		if(event.wheelDelta){
			return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta); //opera浏览器获得的值与别的浏览器相反
		}else{
			return -event.detail * 40;//firefox支持DOMMouseScroll事件，它的event对象中的滚轮信息存在detail中，向前滚动，其值为-3的倍数，向后滚动其值为3的倍数
		}
	},
	getCharCode: function(event){
		//取得按键所对应的字符编码
		//补充：在取得了字符编码之后，可以使用String.fromCharCode()将其转换成实际的字符
		if(typeof event.charCode == "number"){
			return event.charCode;
		}else{
			return event.keyCode;
		}
	},
	getClipboardText: function(event){
		//获取剪贴板内容
		var clipboardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData('text');
	},
	setClipboardText: function(event, value){
		//设置剪贴板内容
		if(event.clipboardData){
			return event.clipboardData.setData('text/plain', value);
		}else if(window.clipboardData){
			return window.clipboardData.setData('text', value);
		}
	}
}

//计算页面中获得事件的元素的页面坐标
function getElementPagePosition(element,eventType){
	var pageX,pageY;
	EventUtil.addHandler(div, eventType, function(event){
		event = EventUtil.getEvent(event);
		pageX = event.pageX;
		pageY = event.pageY;

		if(pageX === undefined){
			pageX = event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);//混杂模式下识别document.body.scrollLeft,严格模式下识别document.documentElement
		}

		if(pageY === undefined){
			pageY = event.clientY + (document.body.scrollTop || document.documentElement.scrollTop);
		}
	});
}

//异步获取数据
function ajax(url,method,data,callback){
	var xmlhttp;

	if(window.XMLHttpRequest){
		// IE7+
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}

	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == XMLHttpRequest.DONE){
			if(xmlhttp.status == 200){
				var response = xmlhttp.response;
				response = JSON.parse(response);
				callback && callback(response);
			}else if(xmlhttp.status == 400){
				alert("网络出问题了");
			}
		}
	};
	if(data){
		url = url + '?';
		for(var key in data){
			url += key + '=' + data[key] + '&';
		}
		url = url.substring(0,url.length-1);
	}
	xmlhttp.open(method,url,true);
	xmlhttp.send();
}

/*
 * 获取选择的文本
 * textbox参数表示当前用户所选中的输入框 
 */
function getSelectedText(textbox){
	if(typeof textbox.selectionStart == 'number'){
		return textbox.value.substring(textbox.selectionStart,textbox.selectionEnd);
	}else if(document.selection){
		return document.selection.createRange().text;
	}
}/*

 * 选择特定文本
 * textbox参数表示要实现选择文本的输入框
 * startIndex和stopIndex表示选择文本的开始位置和结束位置
 */
function selectText(textbox, startIndex, stopIndex){
	if(textbox.setSelectionRange){
		textbox.setSelectionRange(startIndex,stopIndex);
	}else if(textbox.createTextRange){
		var range = textbox.createTextRange();
		range.collapse(true);
		range.moveStart('character', startIndex);
		range.moveEnd('character', stopIndex - startIndex);
		range.select();
	}
	textbox.focus();
}

/*
 * 获取select中的选中项
 */
function getSelectedOptions(selectBox) {
	var result = [];
	var option = null;

	for(var i = 0, len = selectBox.options.length; i < len; i++){
		option = selectBox.options[i];
		if (option.selected){
			result.push(option);
		}
	}

	return result;
}

/*
 * 表单序列化
 */
function serialize(form) {
	var parts = [],
		field = null,
		i,
		len,
		j,
		optLen,
		option,
		optValue;

	for (i = 0, len = form.elements.length; i < len; i++){
		field = form.elements[i];

		switch (field.type){
			case 'select-one':
			case 'select-multiple':
				if(field.name.length){
					for (j = 0, optLen = field.options.length; j < optLen; j++){
						option = field.options[j];
						if(option.selected){
							optValue = "";
							if(option.hasAttribute){
								optValue = (option.hasAttribute('value') ? option.value : option.text);
							}else{
								optValue = (option.attributes['value'].specified ? option.value : option.text);
							}
							parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
						}
					}
				}
				break;
			case undefined:
			case 'file':
			case 'submit':
			case 'reset':
			case 'button':
				break;
			case 'radio':
			case 'checkbox':
				if(!field.checked){
					break;
				}
			default:
				if(field.name.length){
					parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
				}
		}
	}
	return parts.join("&");
}

//util对象_
var _;
_.type = function (obj) {
	return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
};
_.isArray = function (list) {
	return _.type(list) === 'Array';
};
_.isString = function (list) {
	return _.type(list) === 'String';
};
_.each = function (array, fn) {
	for(var i = 0, len = array.length; i < len; i++){
		fn(array[i],i);
	}
};
_.toArray = function (listLike) {
	if(!listLike){
		return [];
	}

	var list = [];

	for(var i = 0, len = listLike.length; i < len; i++){
		list.push(listLike[i]);
	}

	return list;
};
_.setAttr = function (node, key, value) {
	switch (key) {
		case 'style':
			node.style.cssText = value;
			break;
		case 'value':
			var tagName = node.tagName || '';
			tagName = tagName.toLowerCase();
			if(tagName === 'input' || tagName === 'textarea'){
				node.value = value
			}else{
				node.setAttribute(key, value);
			}
			break;
		default:
			node.setAttribute(key, value);
			break;
	}
};
//向url中添加参数的正确方式
_.addQueryStringArg = function (url, name, value) {
	if (url.indexOf('?') == -1){
		url += '?';
	}else{
		url += '&';
	}

	url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
	return url;
};

//将JavaScript抛出的错误发送到服务端进行记录
_.logError = function (sev, msg) {
	var img = new Image();
	img.src = "log.php?sev=" + encodeURIComponent(sev) + "&msg=" + encodeURIComponent(msg);
};
// 向控制台输出内容
_.log = function (message) {
	if(typeof console === "object"){
		console.log(message);
	}else if(typeof opera === "object"){
		opera.postError(message);
	}else if(typeof java === "object"){
		java.lang.System.out.println(message);
	}
};
// 不满足条件的抛出错误
_.assert = function (condition, message) {
	if(!condition){
		throw new Error(message);
	}
};

// 函数节流
_.throttle = function (fn, delay) {
	var timer = null;
	return function () {
		var context = this;
		var args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context,args);
		}, delay);
	};
};

// 向url中添加参数
_.addURLParam = function(url, name, value){
	url += (url.indexOf("?") === -1 ? "?" : "&");
	url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
	return url;
};

// 跨域请求解决方案(CORS之外的)
/**
 *
 * @param url
 * @param options
 *
 * options是个对象,可以添加success和error的回调函数
 * 这种方式只适合浏览器向服务器发送数据的单向通信
 * 这种方式只能发送get请求,并且无法获得相应文本
 *
 * 一般用于跟踪用户点击页面或动态广告的曝光次数
 */
_.pingImg = function (url,options) {
	options = options || {};
	var img = new Image();
	img.onload = function () {
		options.success && options.success();
	};
	img.onerror = function () {
		options.error && options.error();
	};
	img.src = url;
};


/**
 *
 * @param fn
 * @param context
 * @returns {Function}
 *
 * 绑定作用域
 */
_.bind = function (fn, context){
	var args = Array.prototype.slice.call(arguments, 2);
	return function () {
		var innerArgs = Array.prototype.slice.call(arguments);
		var finalArgs = args.concat(innerArgs);
		return fn.apply(context, finalArgs);
	};
};

/**
 * 函数柯里化
 * @param fn
 * @returns {Function}
 */
_.curry = function (fn) {
	var args = Array.prototype.slice.call(arguments, 1); //第一次传入的参数
	return function () {
		var innerArgs = Array.prototype.slice.call(arguments); //第二次传入的参数
		var finalArgs = args.concat(innerArgs);
		return fn.apply(null, finalArgs);
	}
};








