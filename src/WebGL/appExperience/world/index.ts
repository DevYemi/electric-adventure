import * as THREE from 'three'
import AppExperience from '..';
import DebugUI from '../../utils/DebugUI';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import CarModel from './CarModel';
import Environment from './Environment';
import Controls from './Controls';


export default class World {
    experience: AppExperience;
    loadedResource: any;
    debugUI: DebugUI;
    orbitControls!: OrbitControls;
    scene: THREE.Scene;
    carModel: CarModel;
    environment: Environment;
    controls: Controls;

    constructor(experience: AppExperience) {
        // Initialize
        this.experience = experience
        this.loadedResource = experience.resourcesLoader?.items
        this.debugUI = experience.debugUI;
        this.scene = experience.scene;

        this.environment = new Environment(experience);
        this.controls = new Controls(experience);
        this.carModel = new CarModel(experience, this.controls);

        // this.setDefault();
        this.initiateOrbitControls();

    }

    initiateOrbitControls() {
        this.orbitControls = new OrbitControls(this.experience.camera.cameraInstanceDummy, this.experience.canvas);

        this.orbitControls.enableDamping = true;
    }

    setDefault() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: "red" });

        const boxMesh = new THREE.Mesh(geometry, material);

        this.scene.add(boxMesh);


    }


    update = () => {
        // update on each tick
        if (this.orbitControls) this.orbitControls.update();
        this.controls.update();
        this.carModel.update()
    }

    destroy() {
        console.log("world destroyed")
    }

}