学习笔记<br>
1、实现一个TicTacToe游戏<br>
1-1、游戏画面显示<br>
1-2、点击事件，代表下棋这个动作，在点击后的位置增加一颗棋子<br>
1-3、判断输赢，三横三纵两对角线的位置如果都是相同的棋子则胜利<br>
1-4、AI：判断每次下棋后能否胜利，找到一个我最好的策略（即对方最坏的策略），这时候的结果就是最好的结果<br>
2、异步编程<br>
2-1、callback<br>
2-2、promise<br>
promise.then执行异步步骤<br>
2-3、generator<br><br>
用\*来标记这个函数，配合yield使用<br>
```
function* go(){
  yield sleep();
}
```
2-4、async/await<br>
```
async function(){
  const result = await asyncFn();
}
```
async和await一般成对出现，await后面的结果如果是一个promise对象则等待一个promise中resolve回的结果，如果跟的是一个普通的值得到的结果就是这个值
