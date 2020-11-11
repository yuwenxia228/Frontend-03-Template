学习笔记  
1、手势常识  
start--end-->tap(相当于click事件)  
start---移动一定的距离（通常为10px）--->pan start----move---->pan----->pan end/flick(快速)  
start---长按0.5s---->press start---->press end  
2、手势事件  
touchStart、touchMove、touchEnd、touchCancel  
event.changedTouches是一个列表，因为touch是多点触碰，touch列表里的每一个touch都有clientX和clientY。另外，touchEnd和touchCancel和touchEnd的区别在于，touchEnd是一次正常的touch事件结束，而touchCancel是异常结束，例如：在touchMove的过程中调用alert事件，touch事件被中断了，这就属于异常结束的范畴。  
3、逻辑处理  
start:记录startX和startY，判断移动距离是否大于10px时需要；初始化isPan、isTap、isPress；设置0.5秒的定时器，判断是否处与press状态时需要；  
move:计算移动距离，大于10px进入"pan"状态，清除定时器防止进入“press”状态；  
end:进入"end"状态，如果是"tap"还要清除定时器，其他状态时都已经处理过定时器不需要再清除。  
cancel:清除定时器  
