import AppExperience from "..";
import gsap from 'gsap';
import CustomScrollBar from "./CustomScrollBar";

export default class UiAnimations {
    experience: AppExperience;
    mainEle: HTMLElement;
    customScrollBar: CustomScrollBar;
    disablePageDrag: boolean = true;
    constructor(experience: AppExperience) {
        this.experience = experience;
        this.mainEle = document.querySelector(".main") as HTMLElement;
        this.customScrollBar = new CustomScrollBar(this.mainEle);


        window.addEventListener("wheel", (e) => {

            if (e.deltaY > 0 && !this.disablePageDrag) {
                this.disablePageDrag = true;
                this.dragPage("Down");
            }

        })

        this.customScrollBar.initiatLenisScroll();
        this.init();

    }

    init() {
        const headerText = document.querySelector('.header-text') as HTMLHeadingElement;
        const headerNavLink = document.querySelector('.header-nav') as HTMLElement;
        const heroDetails = document.querySelector(".hero-sec-detail") as HTMLElement;
        const heroIcons = document.querySelector(".hero-sec-icons") as HTMLElement;
        const heroBluePrint = document.querySelector(".hero-sec-blueprint") as HTMLElement;

        const pageDownDragIndicator = document.querySelector(".drag-down-indicator") as HTMLElement;
        const pageUpDragIndicator = document.querySelector(".drag-up-indicator") as HTMLElement;

        pageUpDragIndicator.addEventListener("click", () => {
            this.dragPage("Up")
        })



        const tl = gsap.timeline({ defaults: { duration: 1 } });

        tl.to(headerText.children,
            {
                translateY: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                stagger: 0.5
            },
            "same-1"
        ).to(headerNavLink.children,
            {
                translateY: 0,
                opacity: 1,
                stagger: 0.2,
                duration: 0.7
            },
            "same-1"
        ).to(heroDetails.children,
            {
                translateY: 0,
                opacity: 1,
                stagger: 0.2,
                duration: 0.4
            },
            "same-1"
        ).to(heroIcons.children,
            {
                translateY: 0,
                opacity: 1,
                stagger: 0.3,
                ease: "power2.in"
            },
            "same-1"
        ).to(heroBluePrint,
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease: "power2.in",
                duration: 1,
                onComplete: () => { this.disablePageDrag = false; }
            },
            "same-1"
        ).to([pageDownDragIndicator.children, pageUpDragIndicator.children],
            {
                translateY: "-10px",
                opacity: 1,
                duration: 0.5,
                yoyo: true,
                repeat: -1
            },
        )
    }

    dragPage(direction: "Up" | "Down") {
        const appEle = document.querySelector(".app") as HTMLElement;
        const headerText = document.querySelector('.header-text') as HTMLHeadingElement;
        const heroSec = document.querySelector(".hero-sec") as HTMLElement;
        const heroDetails = document.querySelector(".hero-sec-detail") as HTMLElement;
        const heroIcons = document.querySelector(".hero-sec-icons") as HTMLElement;
        const heroBluePrint = document.querySelector(".hero-sec-blueprint") as HTMLElement;
        const contentSecEle = document.querySelector(".content-sec") as HTMLElement;
        const pageDownDragIndicator = document.querySelector(".drag-down-indicator") as HTMLElement;
        const pageUpDragIndicator = document.querySelector(".drag-up-indicator") as HTMLElement;

        // Create and empty element to micmic the effect of finger drag
        const divEle = document.createElement("div");

        divEle.style.position = "absolute";
        divEle.style.border = "5px solid white";
        divEle.style.borderRadius = "50%"
        divEle.style.width = "60px";
        divEle.style.height = "60px";
        divEle.style.backgroundColor = "#ffffff2e";
        divEle.style.top = "50%";
        divEle.style.right = "10%";
        divEle.style.transform = "scale(0)";

        appEle.append(divEle);


        // animate
        const tl = gsap.timeline({ defaults: { duration: 1 } });

        if (direction === "Down") {
            tl.to(divEle,
                {
                    scale: 1,
                    duration: 1
                },
            ).to([divEle, headerText],
                {
                    translateY: "-300px",
                    alpha: 0
                },
                "same-1"
            ).to([this.mainEle, contentSecEle],
                {
                    marginTop: 0
                },
                "same-1"
            ).to([heroIcons, heroBluePrint, heroDetails],
                {
                    translateY: "-150px",
                    alpha: 0
                },
                "same-1"
            ).to(heroSec,
                {
                    height: 0,
                    onComplete: () => {
                        pageDownDragIndicator.style.display = "none";
                        pageUpDragIndicator.style.display = "flex";
                        appEle.removeChild(divEle);
                        this.customScrollBar.createCustomScrollTracker();
                        this.customScrollBar.lenisScrollInstance.start()
                    }
                },
                "same-1"
            )
        } else {
            tl.to(divEle,
                {
                    scale: 1,
                    duration: 1
                },
            ).to(divEle, {
                translateY: "200px",
                alpha: 0
            },
                "same-1"
            ).to(headerText,
                {
                    translateY: "0px",
                    alpha: 1
                },
                "same-1"
            ).to([this.mainEle, contentSecEle],
                {
                    marginTop: "20em"
                },
                "same-1"
            ).to([heroIcons, heroBluePrint, heroDetails],
                {
                    translateY: "-0px",
                    alpha: 1
                },
                "same-1"
            ).to(this.customScrollBar.scroll.track.element,
                {
                    translateY: "40px",
                    alpha: 0,
                },
                "same-1"
            )
                .to(heroSec,
                    {
                        height: "auto",
                        onComplete: () => {
                            pageDownDragIndicator.style.display = "flex";
                            pageUpDragIndicator.style.display = "none";
                            appEle.removeChild(divEle);
                            this.customScrollBar.scroll.scrollEle.removeChild(this.customScrollBar.scroll.track.element);
                            this.disablePageDrag = false;
                            this.customScrollBar.scroll.scrollEle.removeEventListener("scroll", this.customScrollBar.scrollCustomScroll);
                            this.customScrollBar.lenisScrollInstance.stop();
                        }
                    },
                    "same-1"
                )
        }


    }
}