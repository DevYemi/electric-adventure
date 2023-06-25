import { Camera3dSpace } from './types'
import DefaultExperience from "./DefaultExperience";
import Sizes from './Sizes';
import * as THREE from 'three'
import DebugUI from './DebugUI';


interface CameraHelperType {
    main: THREE.CameraHelper,
    dummy: THREE.CameraHelper,
}
export default class Camera {
    experience: DefaultExperience
    cameraInstance!: THREE.PerspectiveCamera;
    cameraInstanceDummy!: THREE.PerspectiveCamera;
    sizes: Sizes;
    scene: THREE.Scene;
    canvas: HTMLCanvasElement;
    camera3dSpace: Camera3dSpace;
    private debugUI: DebugUI
    private cameraHelpers!: CameraHelperType;



    constructor(experience: DefaultExperience, camera3dSpace: Camera3dSpace) {
        // Initialize 
        this.experience = experience;
        this.sizes = experience.sizes;
        this.scene = experience.scene;
        this.canvas = experience.canvas;
        this.camera3dSpace = camera3dSpace;
        this.debugUI = experience.debugUI;


        // create camera instance
        this.setCameraInstance();

        this.addDebugUi();
    }

    private setCameraInstance(): void {
        // create camera instance with passed camera3DSpace details
        this.cameraInstance = new THREE.PerspectiveCamera(this.camera3dSpace.fov, this.sizes.width / this.sizes.height)
        this.cameraInstance.position.set(this.camera3dSpace.position.x, this.camera3dSpace.position.y, this.camera3dSpace.position.z)
        this.cameraInstance.rotation.set(this.camera3dSpace.rotation.x, this.camera3dSpace.rotation.y, this.camera3dSpace.rotation.z)
        this.cameraInstance.scale.set(this.camera3dSpace.scale.x, this.camera3dSpace.scale.y, this.camera3dSpace.scale.z)

        this.cameraInstanceDummy = this.cameraInstance.clone();
        this.scene.add(this.cameraInstance, this.cameraInstanceDummy);

        // setup camera helper
        this.cameraHelpers = {
            main: new THREE.CameraHelper(this.cameraInstance),
            dummy: new THREE.CameraHelper(this.cameraInstanceDummy),
        }
        this.toggleCameraHelper(false, false);

        this.scene.add(this.cameraHelpers.main, this.cameraHelpers.dummy)
    }

    private toggleCameraHelper(mainDisplay: boolean, dummyDisplay: boolean) {
        this.cameraHelpers.main.visible = mainDisplay;
        this.cameraHelpers.dummy.visible = dummyDisplay;

    }

    private addDebugUi() {
        if (this.debugUI.isActive && this.debugUI.ui) {
            const cameraFolder = this.debugUI.ui.addFolder({ title: "Camera", expanded: false })

            const cameraParams = {
                position: { x: this.cameraInstance.position.x, y: this.cameraInstance.position.y, z: this.cameraInstance.position.z },
                mainHelper: false,
                dummyHelper: false
            }
            cameraFolder.addInput(cameraParams, "position").on("change", () => {
                this.cameraInstance.position.x = cameraParams.position.x;
                this.cameraInstance.position.y = cameraParams.position.y;
                this.cameraInstance.position.z = cameraParams.position.z;
            })

            cameraFolder.addInput(cameraParams, "mainHelper").on("change", () => {
                this.toggleCameraHelper(cameraParams.mainHelper, cameraParams.dummyHelper)
            });

            cameraFolder.addInput(cameraParams, "dummyHelper").on("change", () => {
                this.toggleCameraHelper(cameraParams.mainHelper, cameraParams.dummyHelper)
            })


        }
    }
    resize(): void {
        // update camera on screen resize
        this.cameraInstance.aspect = this.sizes.width / this.sizes.height;
        this.cameraInstance.updateProjectionMatrix()
    }

    update() {
        console.log()
    }

    destroy() {
        console.log()
    }
}