import { Component } from './framework.js'
import { enableGesture } from './gesture.js'
import { TimeLine, Animation } from './animation.js'
import { ease } from './ease.js'

export class Carousel extends Component {  //当我们使用jsx时，英文大写的标签也能生效
    constructor(){
        super();
        this.attributes = Object.create(null); //保存图片数组
    }
    setAttribute(name, value){
        this.attributes[name] = value;
    }
    render(){
        this.root =  document.createElement('div');
        this.root.classList.add("carousel");
        for(let record of this.attributes.src){
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }

        enableGesture(this.root);
        let timeline = new TimeLine();
        timeline.start();
        let handler = null;


        let children = this.root.children;
        let position = 0;
        let t = 0;//动画开始的时间
        let ax = 0;//动画造成的x的偏移

        this.root.addEventListener("start", event => {
            timeline.pause();
            clearInterval(handler);
            let progress = (Date.now() - t) / 1500; //动画播放的进度
            ax = ease(progress) * 500 - 500;
        })

        this.root.addEventListener("pan", event => {
            let x = event.clientX - event.startX - ax;
            let current = position - ((x - x % 500) / 500);
            for(let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;//???

                children[pos].style.transition = "none";
                children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
            }
        })

        this.root.addEventListener("panEnd", event => {
            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000);

            let x = event.clientX - event.startX - ax;
            let current = position - ((x - x % 500) / 500);

            let direction = Math.round((x % 500) / 500);

            for(let offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;
                    
                children[pos].style.transition = "none";
                timeline.add(new Animation(children[pos].style, "transform", -pos * 500 + offset * 500 + x % 500, 
                -pos * 500 + offset * 500 + direction * 500, 1500, 0, ease, v => `translateX(${v}px)`));
            }

            position = position - ((x - x % 500) / 500) - direction;
            position = (position % children.length + children.length) % children.length;
        })

        let nextPicture = () => {
            let children = this.root.children;
            let nextIndex = (position + 1) % children.length; //可以用取余的方法控制current在0-4之间
            let current = children[position];
            let next = children[nextIndex];

            t = Date.now();
            // next.style.transition = "none";
            // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;

            timeline.add(new Animation(current.style, "transform", -position * 500, -500 - position * 500, 1500, 0, ease, v => `translateX(${v}px)`));
            timeline.add(new Animation(next.style, "transform", 500 - nextIndex * 500, -500 * nextIndex, 1500, 0, ease, v => `translateX(${v}px)`));

            position = nextIndex;
        }

        handler = setInterval(nextPicture, 3000);

        // this.root.addEventListener('mousedown', event => {
        //     console.log("mousedown");
        //     let children = this.root.children;
        //     let startX = event.clientX;

        //     let move = event => {
        //         let x = event.clientX - startX;


        //         let current = position - ((x - x % 500) / 500);
        //         for(let offset of [-1, 0, 1]) {
        //             let pos = current + offset;
        //             pos = (pos + children.length) % children.length;

        //             children[pos].style.transition = "none";
        //             children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`
        //         }


        //         /*for(let child of children){
        //             child.style.transition = "none";
        //             child.style.transform = `translateX(${-position * 500 + x}px)` //?
        //         }
        //         console.log('mousemove');*/
        //     }
    
        //     let up = event => {
        //         console.log("mouseup")
        //         let x = event.clientX - startX;
        //         position = position - Math.round(x / 500); 
        //         /*for(let child of children){ //拖到一半以上自动跳到下一张
        //             child.style.transition = ""; 
        //             child.style.transform = `translateX(${-position * 500}px)`
        //         }*/


        //         for(let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
        //             let pos = position + offset;
        //             pos = (pos + children.length) % children.length;
                    
        //             children[pos].style.transition = "none";
        //             children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`
        //         }


        //         document.removeEventListener('mousemove', move);
        //         document.removeEventListener('mouseup', up);
        //     }

        //     document.addEventListener('mousemove', move);
        //     document.addEventListener('mouseup', up);
        // })

        
        // let currentIndex = 0;
        // setInterval(() => {
        //     let children = this.root.children;
        //     let nextIndex = (currentIndex + 1) % children.length; //可以用取余的方法控制current在0-4之间
        //     let current = children[currentIndex];
        //     let next = children[nextIndex];

        //     next.style.transition = "none";
        //     next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

        //     setTimeout(() => { //这里应该是下一张出现的动画
        //         next.style.transition = "";
        //         current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        //         next.style.transform = `translateX(${-nextIndex * 100}%)`;

        //         currentIndex = nextIndex;
        //     }, 16/*浏览器一帧的时间 */)
        // }, 3000)
        return this.root;
    }
    mountTo(parent){
        parent.appendChild(this.render());
    }
}