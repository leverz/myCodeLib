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
	//
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