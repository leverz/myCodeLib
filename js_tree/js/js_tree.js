/**
 * Created by Lever on 16/4/11.
 */
/**
 * add handler to element
 */
function addHandler(element, type, handler) {
    if(element.addEventListener) {
        addHandler = function(element, type, handler) {
            element.addEventListener(type, handler, false);
        };
    } else if (element.attachEvent) {
        addHandler = function(element, type, handler) {
            element.attachEvent("on"+type, handler);
        };
    } else {
        addHandler = function(element, type, handler) {
            element["on"+type] = handler;
        };
    }
    return addHandler(element, type, handler);
};

/**
 * get target from event
 */
function getTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
};

/**
 * prevent default
 */
function preventDefault(event) {
    if(event.preventDefault) {
        preventDefault = function(event) {
            event.preventDefault;
        }
    } else {
        preventDefault = function(event) {
            event.returnValue = false;
        }
    }
    return preventDefault(event);
};

function init(queue, lin) {
    var randHeight, i, input = document.querySelector("input");
    queue.innerHTML = "";
    for(var i = 0; i < 10; i++) {
        input.value = Math.floor(Math.random() * 90) + 10;
        lin.click();
    }
};

function trim(word) {
    return word.replace(/^\s+|\s+$/g,"");
};


(function() {
    var treeWalker = new TreeWalker(),
        btns       = document.querySelectorAll("input"),
        preBtn     = btns[0],
        inBtn      = btns[1],
        postBtn    = btns[2],
        root       = document.querySelector(".root");

    addHandler(preBtn, "click", function() {
        treeWalker.preOrder(root);
        treeWalker.animation();
    });
    addHandler(inBtn, "click", function() {
        treeWalker.inOrder(root);
        treeWalker.animation();
    });
    addHandler(postBtn, "click", function() {
        treeWalker.postOrder(root);
        treeWalker.animation();
    });
})();

/* 遍历一颗树 */
function TreeWalker() {
    this.stack = [];
    this.isWalking = false;
};

/* 前序遍历 */
TreeWalker.prototype.preOrder =  function(node) {
    this.stack.push(node);
    if(node.firstElementChild) {
        this.preOrder(node.firstElementChild);
    }
    if(node.lastElementChild) {
        this.preOrder(node.lastElementChild);
    }
};

/* 中序遍历 */
TreeWalker.prototype.inOrder = function(node) {
    if(node.firstElementChild) {
        this.inOrder(node.firstElementChild);
    }
    this.stack.push(node);
    if(node.lastElementChild) {
        this.inOrder(node.lastElementChild);
    }
};

/* 后序遍历 */
TreeWalker.prototype.postOrder = function(node) {
    if(node.firstElementChild) {
        this.postOrder(node.firstElementChild);
    }
    if(node.lastElementChild) {
        this.postOrder(node.lastElementChild);
    }
    this.stack.push(node);
};

/* 动画方法 */
TreeWalker.prototype.animation = function() {
    var stack   = this.stack,
        speeder = document.querySelector("#speeder"),
        iter    = 0,
        self    = this,
        timer;

    self.stack = [];
    if(!self.isWalking) {
        self.isWalking = true;
        stack[iter].style.backgroundColor = "#F125C2";
        timer = setInterval(function() {
            if(iter == stack.length-1) {
                stack[iter].style.backgroundColor = "#FFFFFF";
                self.isWalking = false;
                clearInterval(timer);
            } else {
                ++iter;
                stack[iter-1].style.backgroundColor = "#FFFFFF";
                stack[iter].style.backgroundColor = "#F125C2";
            }
        }, speeder.value);
    }
};