学习笔记  
动画时间线的几个函数方法的实现：  
1、start()  
记录动画开始时间，遍历执行所有动画(requestAniationFrame)。通过animation.receiveTime(time)改变属性值，关键在于time值的计算，  
2、pause()  
cancelAnimationFrame()  
3、resume()  
关键在于对暂停时数据的记录，让他在开始时的值不受等待时间的影响  
4、reset()  
初始化所有值  
5、add()  

Animation类的设计几个难点  
1、timingFunction  
2、template
