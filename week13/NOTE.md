学习笔记  
组件开发步骤：  
1、环境配置，安装webpack、webpack-cli、babel、babel-loader、@babel/preset-env、@babel/plugin-transform-react-jsx；初始化一个项目（npm init）  
2、创建一个组件基类，包含挂载到父元素、子元素挂载、设置元素属性三种方法（分析jsx的createElement方法，参数有元素类型，属性一级子元素。如果使用大写字母识别不出，所以利用类的方法创建类来实现，如果是普通元素可以使用普通元素类）。  
3、创建需要的组件类继承自基类，完善基类的属性和方法。  
