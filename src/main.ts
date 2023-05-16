import "@/styles/style.scss"
import AppExperience from "./WebGL.ts/appExperience"


const canvasElement = document.querySelector('.webgl-canvas') as HTMLCanvasElement
const experience = new AppExperience(canvasElement);

(window as any).experience = experience;


