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
function createElement (type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'string' ? createTextElement(child) : child)
    }
  }
}

const TEXT_ELEMENT = 'text_element'
// 创建文字节点
function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: []
    }
  }
}

var Zack = {
  createElement
}




const data = {
  item1: 'bb',
  item2: 'cc'
}

const jsx =  <ul className="list">
  <li className="item" style={{ background: 'blue', color: 'pink' }} onClick={() => alert(2)}>aa</li>
  <li className="item">{data.item1}<i>xxx</i></li>
  <li className="item">{data.item2}</li>
</ul>;

console.log(jsx);



// schedule
let nextFiberReconcileWork = null; // 下一个需要创建fiber的VDOM
let wipRoot = null;
function workloop(deadline) {
  let shouldYield = false
  while (nextFiberReconcileWork && !shouldYield) {
    // 为当前节点创建fiber
    nextFiberReconcileWork = performNextWork(nextFiberReconcileWork) // performwork返回下一个需要处理的节点
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function performNextWork(fiber) {
  // 1.创建fiber
  reconcile(fiber)
  // 2.返回下一个需要处理的节点
  if (fiber.child) {
    return fiber.child
  }
  let next = fiber
  while (next) {
    if (next.sibing) {
      return next.sibing
    }
    next = next.return
  }
}