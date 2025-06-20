import * as THREE from 'three';
import DefaultExperience from '../utils/DefaultExperience';
import { Camera3dSpace, DefaultExperienceOptions } from '../utils/types';
import sources from './sources';
import World from './world';
import UiAnimations from './uiAnimations';

const camera3dSpace: Camera3dSpace = {
    position: new THREE.Vector3(1.14, 0.09, 3.8),
    scale: new THREE.Vector3(1, 1, 1),
    rotation: new THREE.Vector3(0, 0, 0),
    fov: 75
}

const defaultExperienceOptions: DefaultExperienceOptions = {
    useWindowSizeOnResize: false
}

export default class AppExperience extends DefaultExperience {
    private static _instance: AppExperience | null;
    world!: World;
    uiAnimations!: UiAnimations;

    constructor(canvas: HTMLCanvasElement) {
        if (AppExperience._instance instanceof AppExperience) {
            return AppExperience._instance
        }
        super(canvas, camera3dSpace, defaultExperienceOptions, sources)

        this.world = new World(this);
        this.uiAnimations = new UiAnimations(this);


        // Create Singleton
        AppExperience._instance = this;

        //Time tick event
        this.time.on('tick', this.updateWithTick.bind(this))
    }

    updateWithTick() {
        this.performance.stats.begin();

        this.world.update()
        this.camera.update()
        this.renderer.update()

        this.performance.stats.end();
    }

    destroyExperience() {
        AppExperience._instance = null;
        this.destroyDefaultExperience();
        this.world.destroy();
    }
}
