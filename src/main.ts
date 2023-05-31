import "@/styles/style.scss"
import "@/styles/lenis-scroll.css"
import AppExperience from "./WebGL/appExperience"


const canvasElement = document.querySelector('.webgl-canvas') as HTMLCanvasElement
const experience = new AppExperience(canvasElement);

(window as any).experience = experience;


