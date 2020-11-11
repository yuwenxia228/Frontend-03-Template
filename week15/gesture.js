let element = document.documentElement; //代表HTML元素
element.addEventListener("mousedown", event => {
    let mousemove = event => {
        console.log(event.clientX, event.clientY);
    };

    let mouseup = event => {
        element.removeEventListener("mousemove", mousemove);
        element.removeEventListener("mouseup", mouseup);
    };

    element.addEventListener("mousemove", mousemove);
    element.addEventListener("mouseup", mouseup);
});

element.addEventListener("touchstart", event => {
    for(let touch of event.changedTouches){
        start(touch);
    }
});
element.addEventListener("touchmove", event => {
    for(let touch of event.changedTouches){
        move(touch)
    }
})
element.addEventListener("touchend", event => {
    for(let touch of event.changedTouches){
        end(touch);
    }
});

element.addEventListener("touchcancel", event => { //非正常模式结束
    for(let touch of event.changedTouches){
        cancel(touch);
    }
});

let handler;
let startX, startY;
let isPan = false, isTap = true;

let start = (point) => {
    // console.log("start", point.clientX, point.clientY);
    startX = point.clientX, startY = point.clientY;

    isTap = true;
    isPan = false;
    isPress = false;

    handler = setTimeout(() => {
        isTap = false;
        isPan = false;
        isPress = true;
        handler = null;
        console.log("pressstart")
    }, 500)
}

let move = (point) => {
    let dx = point.clientX - startX, dy = point.clientY - startY;
    
    if(!isPan && dx ** 2 + dy ** 2 > 100){
        isTap = false;
        isPress = false;
        isPan = true;
        console.log("panStart");
        clearTimeout(handler);
    }

    if(isPan){
        console.log("pan");
        console.log(dx, dy);
    }

    // console.log("move", point.clientX, point.clientY);
}

let end = (point) => {
    // console.log("end", point.clientX, point.clientY);
    if(isTap){
        console.log("tap");
        //清除handler否则会触发press
        clearTimeout(handler);
    }
    if(isPan){
        console.log("panend");
    }
    if(isPress){
        console.log("pressend");
    }
}

let cancel = (point) => {
    // console.log("cancel", point.clientX, point.clientY);
    clearTimeout(handler);
}