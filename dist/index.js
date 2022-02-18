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
    props: { ...props,
      children: children.map(child => typeof child === 'string' ? createTextElement(child) : child)
    }
  };
}

const TEXT_ELEMENT = 'text_element'; // 创建文字节点

function createTextElement(text) {
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
console.log(jsx);