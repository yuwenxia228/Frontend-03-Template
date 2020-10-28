function createElement(type, attributes, ...children){
    let element;
    if(typeof type === 'string'){
        element = new ElementWrapper(type);
    }
    else{
        element = new type;
    }
    for(let name in attributes){
        element.setAttribute(name, attributes[name]);
    }
    for(let child of children){
        if(typeof child === 'string'){
            child = new TextWrapper(child);
        }
        element.appendChild(child);
        // child.mountTo(element);
    }
    return element;
}

class ElementWrapper {//正常的element是没有mountTo方法，为了统一，设置一个新的类
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value){
        this.root.setAttribute(name, value);
    }
    appendChild(child){
        // this.root.appendChild(child);//child不是node类型，对于appendChild方法参数类型不对
        child.mountTo(this.root);
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    setAttribute(name, value){
        this.root.setAttribute(name, value);
    }
    appendChild(child){
        // this.root.appendChild(child);
        child.mountTo(this.root);
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }
}

class Div {//当我们使用jsx时，英文大写的标签也能生效
    constructor(){
        this.root = document.createElement('div');
    }
    setAttribute(name, value){
        this.root.setAttribute(name, value);
    }
    appendChild(child){
        // this.root.appendChild(child);
        child.mountTo(this.root);
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }
}

let a = <div id="container">
    <span>1</span>
    <span>2</span>
    <span>3</span>
</div>
// document.body.appendChild(a);
a.mountTo(document.body);