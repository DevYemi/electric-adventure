import DebugUI from "@/WebGL/utils/DebugUI";
import AppExperience from "..";
import * as THREE from "three"

export default class Environment {
    experience: AppExperience;
    scene: THREE.Scene;
    sunLight!: THREE.DirectionalLight;
    debugUI: DebugUI;
    constructor(experience: AppExperience) {
        this.experience = experience;
        this.scene = experience.scene;
        this.debugUI = experience.debugUI;

        this.init();
    }

    init() {
        this.setUpLight();
        this.addDebugUi();
    }


    setUpLight() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
        ambientLight.castShadow = true;


        // Sunlight Light
        this.sunLight = new THREE.DirectionalLight("#fff7cc", 1.0);
        this.sunLight.castShadow = true;

        this.scene.add(this.sunLight, ambientLight);
    }

    addDebugUi() {

        if (this.debugUI.isActive && this.debugUI.ui) {
            const sunlightFolder = this.debugUI.ui.addFolder({ title: "Sunlight", expanded: false });

            const sunlightParams = {
                position: { x: this.sunLight.position.x, y: this.sunLight.position.y, z: this.sunLight.position.z }
            }

            sunlightFolder.addInput(sunlightParams, "position").on("change", () => {
                this.sunLight.position.x = sunlightParams.position.x;
                this.sunLight.position.y = sunlightParams.position.y;
                this.sunLight.position.z = sunlightParams.position.z;
            })
        }

    }
}