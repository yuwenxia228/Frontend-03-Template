//事件派发
export class Dispatcher{
    constructor(element){
        this.element = element;
    }
    dispatch(type, properties){
        let event = new Event(type);
        for(let name in properties){
            event[name] = properties[name];
        }
        this.element.dispatchEvent(event);
    }
}

//listen=>recognize=>dispatch

//new Listener(new Recognizer(new Dispatcher()))

export class Listener{
    constructor(element, recognizer){
        let isListeningMouse = false;
        let contexts = new Map();

        element.addEventListener("mousedown", event => {
            let context = Object.create(null);
            contexts.set("mouse" + (1 << event.button), context); //event.button表示按键类型，0：左键，1：中建，2：右键
            // console.log("start", (1 << event.button))
            recognizer.start(event, context)
        
            let mousemove = event => {
                //0b11111 0b00001 0b00010 0b00011
                let button = 1;
                // console.log(event.buttons);
        
                while(button <= event.buttons){//???
                    if(button & event.buttons){ //掩码生效的时候才起作用?
                        let key;
                        if(button === 2){//event.buttons的中键和右键是相反的
                            key = 4;
                        }
                        else if(button === 4){
                            key = 2;
                        }
                        else{
                            key = button;
                        }
                        let context = contexts.get("mouse" + key);// 1<<1=2
                        // console.log("move", button);
                        recognizer.move(event, context);
                    }
        
                    button = button << 1;
                }
        
                // console.log(event.clientX, event.clientY);
            };
        
            let mouseup = event => {
                let context = contexts.get("mouse" + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete("mouse" + (1 << event.button));
        
                if(event.buttons === 0){
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    isListeningMouse = false;
                }
        
            };
        
            if(!isListeningMouse){ //如果已经在监听的话不再绑定新的
                document.addEventListener("mousemove", mousemove);
                document.addEventListener("mouseup", mouseup);
                isListeningMouse = true;
            }
            
        });


        element.addEventListener("touchstart", event => {
            for(let touch of event.changedTouches){
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        });
        element.addEventListener("touchmove", event => {
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        })
        element.addEventListener("touchend", event => {
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });
        
        element.addEventListener("touchcancel", event => { //非正常模式结束
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(touch.identifier);
            }
        });
    }
}

export class Recognizer{
    constructor(dispatcher){
        this.dispatcher = dispatcher;
    }
    start(point, context) {
        // console.log("start", point.clientX, point.clientY);
        context.startX = point.clientX, context.startY = point.clientY;
        this.dispatcher.dispatch("start", {
            clientX: point.clientX,
            clientY: point.clientY
        })
    
        context.points = [{
            t: Date.now(),
            x: point.x,
            y: point.y
        }]; //用于计算平均速度存储的点
    
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.isFlick = false;
    
        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;
            // console.log("pressstart");
            this.dispatcher.dispatch("press", {});
        }, 500)
    }
    
    move(point, context) {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    
        
        if(!context.isPan && dx ** 2 + dy ** 2 > 100){
            context.isTap = false;
            context.isPress = false;
            context.isPan = true;
            context.isVertical = Math.abs(dx) < Math.abs(dy)
            // console.log("panStart");
            this.dispatcher.dispatch("panStart", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
            clearTimeout(context.handler);
        }
    
        if(context.isPan){
            // console.log("pan");
            this.dispatcher.dispatch("pan", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
            // console.log(dx, dy);
        }
        
        context.points.filter(point => Date.now() - point.t < 500); //半秒内
        context.points.push({
            t: Date.now(),
            x: point.x,
            y: point.y
        })
    
        // console.log("move", point.clientX, point.clientY);
    }
    
    end(point, context) {
        // console.log("end", point.clientX, point.clientY);
        if(context.isTap){
            // console.log("tap");
            this.dispatcher.dispatch('tap', {});
            //清除handler否则会触发press
            clearTimeout(context.handler);
        }

        if(context.isPress){
            // console.log("pressend");
            this.dispatcher.dispatch("pressEnd", {})
        }
    
        context.points = context.points.filter(point => Date.now() - point.t < 500); 
    
        let d, v;
        if(!context.points.length){
            v = 0;
        }else{
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
            v = d / (Date.now() - context.points[0].t);
        }
        // console.log(v);
    
        if(v > 1.5){
            // console.log("flick");
            this.dispatcher.dispatch("flick", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
            context.isFlick = true;
        }

        if(context.isPan){
            // console.log("panend");
            this.dispatcher.dispatch("panEnd", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
        }

        this.dispatcher.dispatch("end", {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            isVertical: context.isVertical,
            isFlick: context.isFlick,
            velocity: v
        })
    }
    
    cancel(point, changedTouches) {
        // console.log("cancel", point.clientX, point.clientY);
        this.dispatcher.dispatch("cancel", {});
        clearTimeout(context.handler);
    }
}

export function enableGesture(element){
    new Listener(element, new Recognizer(new Dispatcher(element)));
}