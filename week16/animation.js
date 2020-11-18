const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick_handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start_time");
const PAUSE_START = Symbol("pause_start");
const PAUSE_TIME = Symbol("pause_time");

export class TimeLine {
    constructor(){
        this.state = "Inited";
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start(){
        if(this.state !== "Inited")
            return;
        
        this.state = "started";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = () => {
            // console.log("tick");
            let now = Date.now();
            // let t = Date.now() - startTime;
            for(let animation of this[ANIMATIONS]){
                let t;
                if(this[START_TIME].get(animation) < startTime)//时间线开启之前加入的动画按时间线开始的时间计算
                    t = now - startTime - this[PAUSE_TIME] - animation.delay;
                else    //时间线开启后加入的动画
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                if(animation.duration < t){
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                if(t > 0){
                    animation.receiveTime(t);
                }
                
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    pause(){
        if(this.state !== "started")
            return;

        this.state = "paused";
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }

    resume(){
        if(this.state !== "paused")
            return;

        this.state = "started";
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }

    reset(){
        this.pause();
        this.state = "Inited";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[TICK_HANDLER] = null;
        this[PAUSE_START] = 0;

    }
    add(animation, startTime){
        if(arguments.length < 2){
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template){
        timingFunction = timingFunction || (v => v);
        template = template || (v => v);
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
        this.template = template;
    }
    receiveTime(time){
        console.log(time);
        let range = this.endValue - this.startValue;
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}