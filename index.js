// jsx 经过babel编译后 createElement('ul', {...props}, child1, child2...)
// 虚拟DOM的结构为: {type: 'ul', props: {...props, children: [child1, child2...]}}
// createElment的目标是return 虚拟DOM
/* 
** @params {String} type
** @params {Object} props
** @params {Object} children
**
*/
function createElement (type, props, ...children) {

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
