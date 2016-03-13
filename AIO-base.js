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
		script.text = code;
	}
	document.body.appendChild(script);
}