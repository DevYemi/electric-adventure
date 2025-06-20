import DefaultExperience from "./DefaultExperience";
import Sizes from './Sizes';
import * as THREE from 'three'
import Camera from "./Camera";
import DebugUI from "./DebugUI";

export default class Renderer {
    public rendererInstance!: THREE.WebGLRenderer
    public experience: DefaultExperience;
    public canvas: HTMLCanvasElement;
    public scene: THREE.Scene;
    public camera: Camera;
    public sizes: Sizes;
    private debugUI: DebugUI;
    private displayMiniScreen: boolean;

    constructor(experience: DefaultExperience) {
        // Initialize 
        this.experience = experience
        this.canvas = experience.canvas;
        this.scene = experience.scene;
        this.camera = experience.camera;
        this.sizes = experience.sizes;
        this.debugUI = experience.debugUI;

        this.displayMiniScreen = false;

        // create renderer Instance
        this.setRendererInstance()
    }

    private setRendererInstance() {
        this.rendererInstance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })
        this.rendererInstance.setSize(this.sizes.width, this.sizes.height);
        this.rendererInstance.setPixelRatio(this.sizes.pixelRatio);
        this.rendererInstance.outputColorSpace = THREE.SRGBColorSpace
        this.addDebugUI();
    }

    resize() {
        // Update Renderer on resize
        this.rendererInstance.setSize(this.sizes.width, this.sizes.height);
        this.rendererInstance.setPixelRatio(this.sizes.pixelRatio)
    }

    addDebugUI() {
        if (this.debugUI.isActive && this.debugUI.ui) {
            const folder = this.debugUI.ui.addFolder({ title: "Renderer" });
            const params = { displayMiniScreen: this.displayMiniScreen }

            folder.addInput(params, "displayMiniScreen").on("change", () => {
                if (params.displayMiniScreen) {
                    this.scene.add(this.experience.camera.cameraInstanceDummy)
                } else {
                    this.scene.remove(this.experience.camera.cameraInstanceDummy)
                }

                this.displayMiniScreen = params.displayMiniScreen;
            })
        }
    }

    update() {
        this.rendererInstance.setViewport(0, 0, this.sizes.width, this.sizes.height)
        // update renderer on each tick
        this.rendererInstance.render(this.scene, this.camera.cameraInstance);

        if (this.displayMiniScreen) {
            // Second Screen
            this.rendererInstance.setScissorTest(true)
            this.rendererInstance.setViewport(
                this.sizes.width - this.sizes.width / 3,
                this.sizes.height - this.sizes.height / 3,
                this.sizes.width / 3,
                this.sizes.height / 3
            );

            this.rendererInstance.setScissor(
                this.sizes.width - this.sizes.width / 3,
                this.sizes.height - this.sizes.height / 3,
                this.sizes.width / 3,
                this.sizes.height / 3
            );

            this.rendererInstance.render(this.scene, this.experience.camera.cameraInstanceDummy)

            this.rendererInstance.setScissorTest(false)
        }

    }

    destroy() {
        this.rendererInstance.dispose();
    }
}