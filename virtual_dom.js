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

var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

function patch(node, patches) {
	var walker = {
		index: 0
	};
	dfsPatchWalk(node, walker, patches);
}

function dfsPatchWalk(node, walker, patches) {
	var currentPatches = patches[walker.index];

	var len = node.childNodes ? node.childNodes.length : 0;
	for(var i = 0; i < len; i++){
		var child = node.childNodes[i];
		walker.index++;
		dfsPatchWalk(child, walker, patches);
	}

	if(currentPatches){
		applyPatches(node, currentPatches);
	}
}

function applyPatches(node, currentPatches) {
	_.each(currentPatches, function (currentPatch) {
		switch (currentPatch.type){
			case REPLACE:
				var newNode = (typeof currentPatch.node === 'string') ? document.createTextNode(currentPatch.node) : currentPatch.node.render();
				node.parentNode.replaceChild(newNode,node);
				break;
			case REORDER:
				reorderChildren(node, currentPatch.moves);
				break;
			case PROPS:
				setProps(node, currentPatch.props);
				break;
			case TEXT:
				if(node.textContent){
					node.textContent = currentPatch.content;
				}else {
					node.nodeValue = currentPatch.content;
				}
				break;
			default:
				throw new Error('Unknow patch type ' + currentPatch.type);
		}
	})
}

function setProps(node, props) {
	for(var key in props){
		if(props[key] === undefined){
			node.removeAttribute(key);
		}else{
			var value = props[key];
			_.setAttr(node,key,value);
		}
	}
}

function reorderChildren(node,moves) {
	var staticNodeList = _.toArray(node.childNodes);
	var maps = {};
	
	_.each(staticNodeList, function (node) {
		if(node.nodeType === 1){
			var key = node.getAttribute('key');
			if (key) {
				maps[key] = node;
			}
		}
	})
}


function Element(tagName, props, children) {
	this.tagName = tagName;
	this.props = props;
	this.children = children;
}
Element.prototype.render = function() {
	var el = document.createElement(this.tagName);
	var props = this.props;
	for(var propName in props){
		var propValue = props[propName];
		el.setAttribute(propName, propValue);
	}
	var children = this.children || [];
	children.forEach(function(child){
		//如果子节点也是虚拟DOM，递归构建DOM节点;如果是字符串，则只构建文本节点
		var childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
		el.appendChild(childEl);
	})
	return el;
};

//diff算法，分析两颗DOM树的差异
//深度优先遍历DOM树，每遍历一个节点就把该节点与新的树进行对比。如果有差异的话就记录到一个对象里面。

function diff (oldTree, newTree){
	var index = 0;	//当前节点标志
	var patches = {};	//用来记录每个节点差异的对象。
	dfsWalk(oldTree, newTree, index, patches);
	return patches;
}
function dfsWalk (oldNode, newNode, index, patches){
	var currentPatch = [];

	//节点被删除的状态
	if (newNode === null){
		//真实的dom节点会直接被删除,所以没必要进行任何操作
	} else if (_.isString(oldNode) && _.isString(newNode)) {
		//文本节点替换的情况
		if(newNode !== oldNode){
			currentPatch.push({
				type: patch.TEXT,
				content: newNode
			});
		}
	}
}


// module.exports = function(tagName,props,children){
// 	return new Element(tagName,props,children);
// }
// 
//要构建的DOM结构
//
//<ul id='list'>
// <li class='item'>Item 1</li> <li class='item'>Item 2</li> <li class='item'>Item 3</li>
//</ul>

var el = function(tagName, props, children){
	return new Element(tagName, props, children);
}
var ul = new el('ul',{id:'list'},[ el('li', {class: 'item'}, ['Item 1']), el('li', {class: 'item'}, ['Item 2']), el('li', {class: 'item'}, ['Item 3']) ]);
var ulRoot = ul.render();
document.body.appendChild(ulRoot);