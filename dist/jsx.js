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
var Zack = {};