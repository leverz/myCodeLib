/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var client = __webpack_require__(1);
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


















/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 *用户代理字符串检测脚本，包括检测呈现引擎，平台，Windows操作系统，移动设备和游戏系统。
	 */

	function client () {
		// body...
		// 呈现引擎
		var engine = {
			ie: 0,
			gecko: 0,
			webkit: 0,
			khtml: 0,
			opera: 0,

			// 完整的版本号
			ver: null
		};
		// 浏览器
		var browser = {

			// 主要浏览器
			ie: 0,
			firefox: 0,
			safari: 0,
			konq: 0,
			opera: 0,
			chrome: 0,

			// 具体版本号
			ver: null
		};

		// 平台、设备和操作系统
		var system = {
			win: false,
			mac: false,
			x11: false,

			// 移动设备
			iphone: false,
			ipod: false,
			ipad: false,
			ios: false,
			android: false,
			nokiaN: false,
			winMobile: false,

			// 游戏系统
			wii: false,
			ps: false
		};

		// 检测呈现引擎和浏览器
		var ua = navigator.userAgent;
		if(window.opera){
			engine.ver = browser.ver = window.opera.version();
		}else if(/AppleWebKit\/(\S+)/.test(ua)){
			//正则表达式中'\S'表示'not whitespace'。例：AppleWebKit/534.7
			engine.ver = RegExp["$1"];//534.7,'$1'表示正则表达式中的第一个分组，就是匹配正则表达式括号中的内容，一对括号是一个分组
			engine.webkit = parseFloat(engine.ver);

			// 确定是Chrome还是Safari
			if(/Chrome\/(\S+)/.test(ua)){
				// 例如：Chrome/47.0.2526.106
				browser.ver = RegExp["$1"];
				browser.chrome = parseFloat(browser.ver);
			}else if(/Version\/(\S+)/.test(ua)){
				browser.ver = RegExp["$1"];
				browser.safari = parseFloat(browser.ver);
			}else{
				// 近似的确定版本号,因为只有Safari3以后版本的Safari才能通过检测Version的方式识别
				var safariVersion = 1;
				if(engine.webkit < 100){
					safariVersion = 1;
				}else if(engine.webkit < 312){
					safariVersion = 1.2;
				}else if(engine.webkit < 412){
					safariVersion = 1.3;
				}else{
					safariVersion = 2;
				}

				browser.safari = broser.ver = safariVersion;
			}
		}else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
			engine.ver = browser.ver = RegExp['$1'];
			engine.khtml = browser.konq = parseFloat(engine.ver);
		}else if(/rv:([^]+)\) Gecko\/\d{8}/.test(ua)){
			// 例如：rv:0.9.4) Gecko/20111128
			engine.ver = RegExp['$1'];
			browser.gecko = parseFloat(engine.ver);

			// 确定是不是Firefox
			if(/Firefox\/(\S+)/.test(ua)){
				browser.ver = RegExp['$1'];
				browser.firefox = parseFloat(browser.ver);
			}
		}else if(/MSIE ([^;]+)/.test(ua)){
			engine.ver = browser.ver = RegExp['$1'];
			engine.ie = browser.ie = parseFloat(engine.ver);
		}

		// 检测浏览器
		browser.ie = engine.ie;
		browser.opera = engine.opera;

		// 检测平台
		var p = navigator.platform;
		system.win = p.indexOf('Win') == 0;
		system.mac = p.indexOf('Mac') == 0;
		system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0);

		// 检测Windows操作系统
		if(system.win){
			if(/Win(?:dows)?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
				if(RegExp['$1'] == 'NT'){
					switch(RegExp['$2']){
						case '5.0':
							system.win = '2000';
							break;
						case '5.1':
							system.win = 'XP';
							break;
						case '6.0':
							system.win = 'Vista';
							break;
						case '6.1':
							system.win = '7';
							break;
						default:
							system.win = 'NT';
							break;
					}
				}else if(RegExp['$1'] == '9x'){
					system.win = "ME";
				}else{
					system.win = RegExp["$1"];
				}
			}
		}

		// 移动设备
		system.iphone = ua.indexOf('iPhone') > -1;
		system.ipod = ua.indexOf('iPod') > -1;
		system.ipad = ua.indexOf('iPad') > -1;
		system.nokiaN = ua.indexOf('NokiaN') > -1;

		// windows mobile
		if(system.win == 'CE'){
			system.winMobile = system.win;
		}else if(system.win == 'Ph'){
			if(/Windows Phone OS (\d+.\d+)/.test(ua)){
				system.win = 'Phone';
				system.winMobile = parseFloat(RegExp['$1']);
			}
		}

		// 检测iOS版本
		if(system.mac && ua.indexOf('Mobile') > -1){
			if(/CPU (?:iphone)?OS (\d+_\d+)/.test(ua)){
				system.ios = parseFloat(RegExp.$1.replace('_','.'));
			}else{
				system.ios = 2; //不能真正检测出来，所以只能猜测
			}
		}

		//判断是否是微信
		var isWeChat = /micromessenger/.test(u.toLowerCase()) ? true : false;

		// 检测Android版本
		if(/Android (\d+\.\d+)/.test(ua)){
			system.android = parseFloat(RegExp.$1);
		}

		// 游戏系统
		system.wii = ua.indexOf('Wii') > -1;
		system.ps = /playstation/i.test(ua);

		// 返回这些对象
		var obj = {
			engine: engine,
			browser: browser,
			system: system
		};
		return obj;
	};

	module.exports = client;

/***/ }
/******/ ]);