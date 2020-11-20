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

    let processChildren = (children) => {
        for(let child of children){
            if((typeof child === "object") && (child instanceof Array))
            {
                processChildren(child); //如果child是一个数组的话，递归调用processChildren
                continue;
            }

            if(typeof child === 'string'){
                child = new TextWrapper(child);
            }
            element.appendChild(child);
            // child.mountTo(element);
        }
    }
    processChildren(children);
    
    return element;
}

export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute")

export class Component{
    constructor(type){
        this[ATTRIBUTE] = Object.create(null); //保存图片数组
        this[STATE] = Object.create(null);
    }
    setAttribute(name, value){
        this[ATTRIBUTE][name] = value;
    }
    appendChild(child){
        // this.root.appendChild(child);//child不是node类型，对于appendChild方法参数类型不对
        child.mountTo(this.root);
    }
    mountTo(parent){
        if(!this.root){
            this.render();
        }
        parent.appendChild(this.root);
    }
    triggerEvent(type, args){
        this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, s => s.toUpperCase())/*正则替换首字母大写*/](new CustomEvent(type, {detail: args}));

    }
    render(){
        return this.root;
    }
}

class ElementWrapper extends Component {//正常的element是没有mountTo方法，为了统一，设置一个新的类
    constructor(type) {
        super();
        this.root = document.createElement(type);
    }

    setAttribute(name, value){
        this.root.setAttribute(name,value);
    }
}

class TextWrapper extends Component {
    constructor(content) {
        super();
        this.root = document.createTextNode(content);
    }
}