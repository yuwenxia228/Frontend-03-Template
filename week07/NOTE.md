学习笔记<br>
1、html语义标签<br>
语义标签使得HTML文档的可读性增强<br>
- aside:定义article以外的内容、侧边栏
- article:文章
- details:定义文章中隐藏的细节（目前只支持Chrome和Safari 6）
- summary:定义details元素的可见标题
- figcaption:图片注解
- figure:图表
- footer:尾部
- header:头部
- main:主题内容
- mark:定义重要的或强调的文本
- nav:导航栏
- section:文章中的节
- time:定义日期、时间

2、浏览器Api<br>
2.1 DOM API<br>
节点操作：<br>
导航类：parentNode、parentElement、childNodes、children、firstChild、firstElementChild、lastChild、lastElementChild、nextSibling、nextElementSibling、previousSibling、previousElementSibling<br>
修改类：appendChild、insertBefore、removeChild、replaceChild<br>
高级操作：compareDocumentPosition、contains、isEqualNode、isSameNode、cloneNode（深拷贝）<br>
2.2 事件API<br>
addEventListener
2.3 Range API<br>
选取任意两个元素之间的元素集合，可以选取半个元素<br>
```
var range = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);
//var range = document.getSelection().getRangeAt(0);
```
setStartBefore、setEndBefore、setStartAfter、setEndAfter、selectNode、selectNodeContents、extractContents(从dom树上摘除)、insertNode<br>
2.4 CSSOM<br>
- document.styleSheets获取
- document.styleSheets[0].cssRules
- document.styleSheets[0].insertRule("{color:pink}", 0)
- document.styleSheets[0].removeRule(0)
- getComputedStyle(el, 伪元素)
2.5 CSSOM View<br>
windowAPI:innerHeight、innerWidth(真实的宽高)、outerWidth、outerHeight(整个浏览器的宽高)、devicePixelRatio(物理像素与屏幕像素比)、screen.width、screen.height、screen.availWidth、screen.availHeight、open、moveTo、moveBy、resizeTo、resizeBy<br>
滚动相关：scrollTop、scrollLeft、scrollWidth、scrollHeight、scroll(x,y)、scrollBy(x,y)、scrollIntoView()<br>
布局相关：getClientRects()(获取元素所有的盒)、getBoundingClientRect(包裹所有元素的一个盒)<br>
2.6 其他<br>
