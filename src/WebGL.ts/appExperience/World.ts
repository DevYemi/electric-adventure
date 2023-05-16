// import * as THREE from 'three'
// import { MouseCursorPosition } from "../utils/types";
// import gsap from 'gsap'
import AppExperience from '.';
import DebugUI from '../utils/DebugUI';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


export default class World {
    experience: AppExperience;
    loadedResource: any;
    debugUI: DebugUI;
    orbitControls!: OrbitControls;

    constructor(experience: AppExperience) {
        // Initialize
        this.experience = experience
        this.loadedResource = experience.resourcesLoader?.items
        this.debugUI = experience.debugUI;

        this.setDefault();

    }

    initiateOrbitControls() {
        this.orbitControls = new OrbitControls(this.experience.camera.cameraInstance, this.experience.canvas);

        this.orbitControls.enableDamping = true;
    }

    setDefault() {
        this.initiateOrbitControls();
    }


    update = () => {
        // update on each tick
        if (this.orbitControls) this.orbitControls.update()
    }

    destroy = () => {
    }
}