import Lenis from "@studio-freight/lenis"
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

interface CustomScrollType {
    scrollEle: HTMLElement,
    track: { element: HTMLElement, height: number },
    thumb: { element: HTMLElement, height: number },
}

export default class CustomScrollBar {
    scroll!: CustomScrollType;
    lenisScrollInstance: typeof Lenis;
    mainEle: HTMLElement;
    constructor(mainEle: HTMLElement) {
        this.mainEle = mainEle
        this.scrollCustomScroll = this.scrollCustomScroll.bind(this);
    }

    initiatLenisScroll() {
        const wrapper = document.querySelector(".main") as HTMLElement

        this.lenisScrollInstance = new Lenis({
            wrapper: wrapper,
            lerp: 0.03,
        })

        this.lenisScrollInstance.stop();

        this.lenisScrollInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            this.lenisScrollInstance.raf(time * 1000)
        })
    }


    createCustomScrollTracker() {

        // create custom scroll bar
        this.scroll = {
            scrollEle: this.mainEle,
            track: { element: document.createElement("div"), height: 100 },
            thumb: { element: document.createElement("span"), height: 0 },
        }
        const mainScrollThumbProportion = this.scroll.scrollEle.clientHeight / this.scroll.scrollEle.scrollHeight;
        this.scroll.thumb.height = this.scroll.track.height * mainScrollThumbProportion;


        this.scroll.track.element.style.height = `${this.scroll.track.height}px`;
        this.scroll.track.element.style.width = "5px";
        this.scroll.track.element.style.backgroundColor = "rgba(235, 235, 235, 0.296)";
        this.scroll.track.element.style.position = "absolute";
        this.scroll.track.element.style.borderRadius = "30px";
        this.scroll.track.element.style.top = "75%";
        this.scroll.track.element.style.opacity = "0";
        this.scroll.track.element.style.transform = "translateY(40px)"

        this.scroll.thumb.element.style.height = `${this.scroll.thumb.height}px`;
        this.scroll.thumb.element.style.width = "5px";
        this.scroll.thumb.element.style.backgroundColor = "rgba(235, 235, 235, 0.596)";
        this.scroll.thumb.element.style.position = "absolute";
        this.scroll.thumb.element.style.top = "0px";
        this.scroll.thumb.element.style.left = "0px"
        this.scroll.thumb.element.style.borderRadius = "30px";

        // add to dom element
        this.scroll.track.element.append(this.scroll.thumb.element);
        this.scroll.scrollEle.append(this.scroll.track.element);


        gsap.to(this.scroll.track.element,
            {
                opacity: 1,
                translateY: 0,
                duration: 1

            })
        this.scroll.scrollEle.addEventListener("scroll", this.scrollCustomScroll)




    }

    scrollCustomScroll() {
        const pageUpDragIndicator = document.querySelector(".drag-up-indicator") as HTMLElement;
        const scrollEleProportion = this.scroll.scrollEle.scrollTop / this.scroll.scrollEle.scrollHeight;
        const scrollTo = Math.round(this.scroll.track.height * scrollEleProportion);


        // animate and  scroll custom scroll track
        gsap.to(this.scroll.thumb.element,
            {
                translateY: `${scrollTo}px`,
                duration: 0.5
            }
        )

        // Hide or show pageUpDragIndicator base on user scroll position
        if (this.scroll.scrollEle.scrollTop > 5) {
            gsap.to(pageUpDragIndicator,
                {
                    alpha: 0,
                    pointerEvents: "none",
                    duration: 0.5
                })
        } else {
            gsap.to(pageUpDragIndicator,
                {
                    alpha: 1,
                    pointerEvents: "auto",
                    duration: 0.5
                })
        }
    }
}