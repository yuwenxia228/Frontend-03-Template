学习笔记<br>
<h5>1、async/await<br>
  async返回一个promise对象，如果函数return一个普通值，将返回一个resolve该值的promise对象。await后面的表达式的结果为promise对象时，阻塞后面的代码，直到得到resolve值。为什么在insert函数前加await？根据调试结果来看，如果直接写await，在执行insert函数时遇到sleep后面的代码会阻塞，而insert函数调用后的语句会继续执行，也就是在下一个循环开始时，sleep后的语句仍然没有执行，这是queue的长度为空不管怎样寻路函数返回的结果永远都是false。
<h5>2、广度优先<br>
  广度优先搜索算法的思想是利用队列的数据结构，在父元素出队列时，对父元素进行必要的处理，并将所有的子元素入队
<h5>3、启发式寻路
  到目的地的估值比实际的距离小就一定能找到一个最优解（A*算法）<br>
  在这个函数中，我们的实际操作是每次都优先选择距离目的地最近的点做为下一次搜索的父元素
