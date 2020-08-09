学习笔记

本周主要学习浏览器原理<br>
1、发送请求<br>
构造一个发送报文，形如：<br>
POST / HTTP/1.1<br>

Content-Type:xxxxx<br>
Content-Length: x<br>

Body<br>

发送该报文，connection.write(this.toString())这里一定要注意字符串格式<br>
2、解析返回的数据<br>
使用状态机模式去解析一个返回的字符串，其中还需要一个专门的类去解析body中的chunk块的内容，同样使用状态机的方法，body中包含多个chunk块（chunk的长度和内容，长度为0表示结束块）<br>
