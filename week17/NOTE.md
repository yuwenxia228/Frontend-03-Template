学习笔记
yeoman文档地址：https://yeoman.io/  
初始化一个项目npm init；安装依赖项，yeoman-generator和yo；npm link  
根据yeoman文档，创建index.js和模板文件t.html。index.js可控制初始化的package文件并执行安装modules，利用文件系统创建需要的文件，也可以处理用户在命令行中的输入。  
创建一个脚手架的过程就是为项目做好初始化，下载需要的modules，创建模板HTML引入js文件，设置好webpack打包配置，利用yeoman可以将这些文件输出。  
  
webpack是一个为node设计的打包工具，根据文件之间的依赖关系打包出js文件，HTML可以通过引用的js文件渲染。webpack的核心是loader，例如babel-loader，css-loader，vue-loader等等，通过test匹配文件后缀，use使用loader。  

babel是可以用来将高版本的js转化为低版本的j可执行s的工具，使用babel的配置可以引入babel-env-presets，相当于一种默认配置。
