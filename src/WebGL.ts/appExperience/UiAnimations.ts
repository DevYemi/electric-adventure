import AppExperience from ".";
import gsap from 'gsap';

export default class UiAnimations {
    experience: AppExperience;
    constructor(experience: AppExperience) {
        this.experience = experience;


        this.init();
    }

    init() {
        const headerText = document.querySelector('.header-text') as HTMLHeadingElement;

        const tl = gsap.timeline({ defaults: { duration: 1 } });

        tl.to(headerText.children,
            {
                translateY: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                stagger: 0.5
            },
        )
    }
}