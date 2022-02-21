// jsx 经过babel编译后 createElement('ul', {...props}, child1, child2...)
// 虚拟DOM的结构为: {type: 'ul', props: {...props, children: [child1, child2...]}}
// createElment的目标是return 虚拟DOM
// 其中要注意文字节点特殊处理: String -> Object

/* 
** @params {String} type
** @params {Object} props
** @params {Object || String} children 节点为text时类型为String
**
*/
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'string' ? createTextElement(child) : child)
    }
  };
}

const TEXT_ELEMENT = 'text_element'; // 创建文字节点
function createTextElement(text) {
  console.log(text);
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: []
    }
  };
}

var Zack = {
  createElement
};
const data = {
  item1: 'bb',
  item2: 'cc'
};
const jsx = Zack.createElement("ul", {
  className: "list"
}, Zack.createElement("li", {
  className: "item",
  style: {
    background: 'blue',
    color: 'pink'
  },
  onClick: () => alert(2)
}, "aa"), Zack.createElement("li", {
  className: "item"
}, data.item1, Zack.createElement("i", null, "xxx")), Zack.createElement("li", {
  className: "item"
}, data.item2));
console.log('vdom: ', jsx); // schedule
let nextFiberReconcileWork = null; // 下一个需要创建fiber的VDOM

let wipRoot = null;

function workLoop(deadline) {
  let shouldYield = false;
  // console.log(nextFiberReconcileWork);
  while (nextFiberReconcileWork && !shouldYield) {
    // 为当前节点创建fiber
    nextFiberReconcileWork = performNextWork(nextFiberReconcileWork); // performwork返回下一个需要处理的节点

    shouldYield = deadline.timeRemaining() < 1;
  }
  // console.log(111, nextFiberReconcileWork, wipRoot);
  if (!nextFiberReconcileWork && wipRoot) {
    // 已经创建所有fiber
    // debugger
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performNextWork(fiber) {
  // 1.创建fiber
  reconcile(fiber); // 2.返回下一个需要处理的节点

  if (fiber.child) {
    return fiber.child;
  }

  let next = fiber;

  while (next) {
    if (next.sibing) {
      return next.sibing;
    }

    next = next.return;
  }
}

function render(element, container) {
  // 创建根节点
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  };
  nextFiberReconcileWork = wipRoot;
} // vdom转fiber，并且创建相应的dom，赋值给fiber.dom


function reconcile(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  reconcileChildren(fiber, fiber.props.children); // vdom转fiber：把之前的 vdom 转成 child、sibling、return 这样串联起来的 fiber 链表
} // vdom转fiber


function reconcileChildren(wipFiber, elements) {
  if (elements.length > 0) {
    let preSibing = null;
    elements.forEach((element, index) => {
      let newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        return: wipFiber,
        effectTag: "PLACEMENT" // 因为只考虑第一次挂载，所有的节点都是新建的，因此tag是PLACEMENT

      };

      if (index === 0) {
        wipFiber.child = newFiber;
      } else {
        preSibing.sibing = newFiber;
      }

      preSibing = newFiber;
    });
  }
}

function createDom(fiber) {
  const dom = fiber.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type);

  for (let attr in fiber.props) {
    setAttribute(dom, attr, fiber.props[attr]);
  }

  return dom;
} // ==============DOM的创建细节===========


function isEventListenerAttr(key, value) {
  return typeof value == 'function' && key.startsWith('on');
}

function isStyleAttr(key, value) {
  return key == 'style' && typeof value == 'object';
}

function isPlainAttr(key, value) {
  return typeof value != 'object' && typeof value != 'function';
}

function setAttribute(dom, key, value) {
  if (key === 'children') {
    return;
  }

  if (key === 'nodeValue') {
    dom.textContent = value;
  } else if (isEventListenerAttr(key, value)) {
    const eventType = key.slice(2).toLowerCase();
    dom.addEventListener(eventType, value);
  } else if (isStyleAttr(key, value)) {
    Object.assign(dom.style, value);
  } else if (isPlainAttr(key, value)) {
    dom.setAttribute(key, value);
  }
}; // ============================================

function commitRoot() {
  console.log('commitRoot:', wipRoot);
  commitWork(wipRoot.child);
  wipRoot = null
}

// 把fiber对应的DOM插入到父亲的DOM中，递归处理兄弟fiber和子fiber
function commitWork(fiber) {
  if (!fiber) return
  console.log(fiber);
  let parent = fiber.return
  let parentDom = parent.dom
  while (!parentDom) {
    parent = parent.return
    parentDom = parent.dom
  }
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    console.log(111);
    parentDom.appendChild(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibing)

}

render(jsx, document.getElementById("root"));