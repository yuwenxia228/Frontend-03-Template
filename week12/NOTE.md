学习笔记
##### 1、proxy
可以用来生成一个被代理的对象  
const p = new Proxy(taret, handler)  
target：被代理的目标对象，handler：常见的有set、get、has捕捉器  
##### 2、vue3.0 reactive原理
1、代理，捕获get和set，get时进行依赖收集，set时执行副作用函数。  
2、注册副作用函数，根据对象和对象的属性名注册副作用函数，当该属性发生变化是就会执行副作用函数。dep是一个map类型，key为obj，val又是一个map类型，key为属性名，val为副作用函数数组。  
3、当属性值是对象时需要继续代理该对象，从而达到响应的目的。  
4、dom->数据，获取dom的值传给data  
##### 3、拖拽效果
1、获取鼠标的位置clientX和clientY，为MouseMove添加事件，每当鼠标坐标变化时，都改变方块的坐标  
2、获取文本节点，在每一个位置创建range并保存。  
3、用getBoundingRect API获取range的位置，找到最近的range，插入方块节点（dragble）。  
