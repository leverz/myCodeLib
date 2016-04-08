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

//patch.js
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
	});

	_.each(moves, function (move) {
		var index = move.index;
		if(move.type === 0){
			if (staticNodeList[index] === node.childNodes[index]){
				node.removeChild(node.childNodes[index]);
			}
			staticNodeList.splice(index,1);
		}else if (move.type === 1){
			var insertNode = maps[move.item.key] ? maps[move.item.key] : (typeof move.item === 'object') ? move.item.render() : document.createTextNode(move.item);
			staticNodeList.splice(index, 0, insertNode);
			node.insertBefore(insertNode, node, childNodes[index] || null);
		}
	})
}

patch.REPLACE = REPLACE;
patch.REORDER = REORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;


//listDiff.js
/**
 * Diff two list in O(N).
 * @param {Array} oldTree - Original list
 * @param {Array} newTree - List After certain insertions, removes, or moves
 * @returns {{Object}} - {moves: <Array>}
 *                     - moves is a list of actions that telling how to remove and insert.
 */

function listDiff(oldList, newList, key) {
	var oldMap = makeKeyIndexAndFree(oldList, key);
	var newMap = makeKeyIndexAndFree(newList, key);

	var newFree = newMap.free;

	var oldKeyIndex = oldMap.keyIndex;
	var newKeyIndex = newMap.keyIndex;

	var moves = [];

	var children = [];
	var i = 0;
	var item;
	var itemKey;
	var freeIndex = 0;

	while (i < oldList.length){
		item = oldList[i];
		itemKey = getItemKey(item, key);
		if (itemKey){
			if(!newKeyIndex.hasOwnProperty(itemKey)){
				children.push(null);//新的节点树中没有对应的key值,则把它记为null
			}else{
				var newItemIndex = newKeyIndex[itemKey];//获取对应在数组中的位置
				children.push(newList[newItemIndex]);
			}
		}else{
			var freeItem = newFree[freeIndex++];//freeIndex在取值的同时完成了计算.
			children.push(freeItem || null);
		}
		i++;
	};

	var simulateList = children.slice(0); //克隆数组

	i = 0;
	while (i < simulateList.length){
		if(simulateList[i] === null){
			remove(i);
			removeSimulate(i);
			//去除子树中值为null,即被删除的节点
			//由于节点被删除,所以不需要操作i
		}else{
			i++;
		}
	}


	var j = i = 0;
	while (i < newList.length){
		item = newList[i];
		itemKey = getItemKey(item, key);

		var simulateItem = simulateList[j];
		var simulateItemKey = getItemKey(simulateItem, key);

		if (simulateItem){
			if(itemKey === simulateItemKey){
				j++;
			}else{
				if(!oldKeyIndex.hasOwnProperty(itemKey)){
					insert(i, item);
				}else{
					var nextItemKey = getItemKey(simulateList[j + 1], key);
					if(nextItemKey === itemKey){
						remove(i);
						removeSimulate(j);
						j++;
					}else{
						insert(i, item);
					}

				}
			}
		} else {
			insert(i, item);
		}

		i++;
	}

	function remove(index) {
		var move = {
			index: index,
			type: 0
		};
		moves.push(move);
	}

	function insert(index, item) {
		var move = {
			index: index,
			item: item,
			type: 1
		};
		moves.push(move);
	}

	function removeSimulate(index) {
		simulateList.splice(index,1);
	}

	return{
		moves: moves,
		children: children
	}
}


/**
 * Convert list to key-item keyIndex object
 * @param {Array} list
 * @param {String | Function} key
 */
function makeKeyIndexAndFree(list, key) {
	var keyIndex = {};
	var free = []; //没有key值的子树
	for (var i = 0, len = list.length; i < len; i++){
		var item = list[i];
		var itemKey = getItemKey(item, key);
		if(itemKey){
			keyIndex[itemKey] = i;
		}else{
			free.push(item);
		}
	}
	return {
		keyIndex: keyIndex, //被编号的子树key对应的值
		free: free //没有key值的子树
	}
}

function getItemKey(item, key) {
	if(!item || !key)
		return undefined;
	return typeof key === 'string' ? item[key] : key(item); //处理item并返回值的相关函数.
	//最后返回的是子树中对应key的value
}

//diff.js

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
	}else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key){
		var propsPatches = diffProps(oldNode, newNode);
		if(propsPatches){
			currentPatch.push({type: patch.PROPS, props: propsPatches});
		}

		if(!isIgnoreChildren(newNode)) {
			diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
		}
	}else {
		currentPatch.push({type: patch.REPLACE, node: newNode});
	}

	if(currentPatch.length){
		patches[index] = currentPatch;
	}
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
	var diffs = listDiff(oldChildren, newChildren, 'key');
	newChildren = diffs.children;

	if(diffs.moves.length){
		var reorderPatch = {
			type: patch.REORDER,
			moves: diffs.moves
		};
		currentPatch.push(reorderPatch);
	}

	var leftNode = null;
	var currentNodeIndex = index;
	_.each(oldChildren, function (child, i) {
		var newChild = newChildren[i];
		currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
		dfsWalk(child, newChild, currentNodeIndex, patches);
		leftNode = child;
	})
}

function diffProps(oldNode, newNode) {
	var count = 0;
	var oldProps = oldNode.props;
	var newProps = newNode.props;

	var key, value;
	var propsPatches = {};

	//判断旧的属性节点是否与新的相同属性有差异.
	for(key in oldProps){
		value = oldProps[key];
		if(newProps[key] !== value){
			count++;
			propsPatches[key] = newProps[key];
		}
	}

	//获取新增的属性节点
	for(key in newProps){
		value = newProps[key];
		if(!oldProps.hasOwnProperty(key)){
			count++;
			propsPatches[key] = newProps[key];
		}
	}

	if(count == 0){
		return null;
	}

	return propsPatches;
}

function isIgnoreChildren(node) {
	return (node.props && node.props.hasOwnProperty('ignore'));
}


/**
 *
 * Virtual-dom Element
 * @param {String} tagName
 * @param {Object} props - Element's properties,
 * 						 - using object to store key-value pair
 *
 * @param {Array<Element | String>} - This element's children elements.
 * 									- Can be Element instance or just a piece plain text.
 *
 */

function Element(tagName, props, children) {
	//防止this不指向当前的Element
	if(!(this instanceof Element)){
		return new Element(tagName, props, children);
	}

	//针对没有props参数的情况
	if(_.isArray(props)){
		children = props;
		props = {};
	}

	this.tagName = tagName;
	this.props = props || {};
	this.children = children || [];
	this.key = props ? props.key : undefined; //key用来统一表示节点,以方便diff函数检测新旧DOM结构的差异类型

	var count = 0;

	_.each(this.children, function (child, i) {
		//不是元素节点就是文本节点
		if(child instanceof Element) {
			count += child.count;
		}else{
			children[i] = '' + child;
		}
		count++;
	});

	this.count = count;
}
Element.prototype.render = function() {
	var el = document.createElement(this.tagName);
	var props = this.props;

	for(var propName in props){
		var propValue = props[propName];
		_.setAttr(el, propName, propValue);
	};

	_.each(this.children, function (child) {
		var childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
		el.appendChild(childEl);
	});

	return el;
};

// module.exports = function(tagName,props,children){
// 	return new Element(tagName,props,children);
// }
// 
//要构建的DOM结构
//
//<ul id='list'>
// <li class='item'>Item 1</li> <li class='item'>Item 2</li> <li class='item'>Item 3</li>
//</ul>

//using...
var el = function(tagName, props, children){
	return new Element(tagName, props, children);
};
var ul = new el('ul',{id:'list'},[ el('li', {class: 'item'}, ['Item 1']), el('li', {class: 'item'}, ['Item 2']), el('li', {class: 'item'}, ['Item 3']) ]);

var ulRoot = ul.render();

var newUl = new el('ul', [
	el('li', {class: 'item'}, ['Item 1']),
	el('li', {class: 'item'}, ['Item 2']),
	el('li', {class: 'item'}, ['Item 3']),
	el('li', {class: 'item'}, ['Item 4'])
]);

var patches = diff(ul, newUl);

patch(ulRoot, patches);

document.body.appendChild(ulRoot);