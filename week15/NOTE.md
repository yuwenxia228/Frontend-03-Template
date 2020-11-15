学习笔记  
1、手势常识  
start--end-->tap(相当于click事件)  
start---移动一定的距离（通常为10px）--->pan start----move---->pan----->pan end/flick(快速)  
start---长按0.5s---->press start---->press end  
2、手势事件  
touchStart、touchMove、touchEnd、touchCancel  
event.changedTouches是一个列表，因为touch是多点触碰，touch列表里的每一个touch都有clientX和clientY。另外，touchEnd和touchCancel和touchEnd的区别在于，touchEnd是一次正常的touch事件结束，而touchCancel是异常结束，例如：在touchMove的过程中调用alert事件，touch事件被中断了，这就属于异常结束的范畴。  
3、逻辑处理  
鼠标事件：  
1、在mousedown事件中创建一个context对象并保存，调用start方法。该context对象保存在一个全局的map类型变量中，以按键类型为key进行区分，左中右键分别为0,1,2  
2、在mousemove中调用move方法。其中获取context对象时，mousemove中不存在event.button属性，但存在event。buttons属性记录被按下的按键，通过设定一个变量与buttons进行&计算获得被按下的按键类型
3、mouseup事件中解除事件绑定，但要注意有可能存在多次绑定多次调用的问题，所以增加一个变量判断是否已经存在监听事件，如果存在则不再绑定。  
recognizer:  
start:初始化context对象中的startX、startY、isPan、isTap、isPress等信息；设置0.5秒的定时器，判断是否处与press状态时需要；  
move:计算移动距离，大于10px进入"pan"状态，清除定时器防止进入“press”状态；flick时要过滤离当前时刻超过500ms的点以计算最近一段时间的速度  
end:进入"end"状态，如果是"tap"还要清除定时器，flick状态时计算当前速度并保存于context中，其他状态时都已经处理过定时器不需要再清除。  
cancel:清除定时器  
事件派发：  
1、new一个event事件  
2、调用dom的dispatchEvent方法
