export function createElement(type, attributes, ...children){
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
export class Component{
    constructor(type){
        
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

class ElementWrapper extends Component {//正常的element是没有mountTo方法，为了统一，设置一个新的类
    constructor(type) {
        this.root = document.createElement(type);
    }
}

class TextWrapper extends Component {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}