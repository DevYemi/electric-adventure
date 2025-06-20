import DebugUI from "@/WebGL/utils/DebugUI";
import AppExperience from "..";
import * as THREE from "three"
import { VivianiCurve } from 'three/examples/jsm/curves/CurveExtras.js';
import gsap from "gsap";

interface LerpType {
    progress: number,
    smoothness: number
}

interface CurveType {
    path: VivianiCurve,
    mesh: THREE.Line,
    scale: number,
}

interface Camera {
    instance: THREE.PerspectiveCamera;
    initialPosition: THREE.Vector3,
    isDisableOnCurve: boolean
}

export default class Controls {
    experience: AppExperience;
    camera: Camera;
    scene: THREE.Scene;
    debugUI: DebugUI;
    curve!: CurveType;
    lerp: LerpType;

    positionVector: THREE.Vector3;
    constructor(experience: AppExperience) {
        this.experience = experience;
        this.scene = experience.scene;
        this.debugUI = experience.debugUI;

        this.camera = {
            instance: experience.camera.cameraInstance,
            initialPosition: experience.camera.cameraInstance.position.clone(),
            isDisableOnCurve: false
        }

        this.positionVector = new THREE.Vector3();
        this.lerp = {
            progress: 0,
            smoothness: 0.0005
        }

        this.setupPath();
    }


    setupPath() {

        const curve = new VivianiCurve(70);

        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: 0xff0000, });

        // Create the final object to add to the scene
        const curveMesh = new THREE.Line(geometry, material);


        this.curve = {
            path: curve,
            mesh: curveMesh,
            scale: 0.05,
        }

        this.curve.mesh.visible = false;
        this.curve.mesh.scale.set(this.curve.scale, this.curve.scale, this.curve.scale);

        this.scene.add(curveMesh);

        // update camera position with curve coord
        this.curve.path.getPointAt(this.lerp.progress, this.positionVector)
        this.positionVector.multiplyScalar(this.curve.scale)
        this.camera.instance.position.copy(this.positionVector)

        this.addDebugUI()

    }

    disableCameraOnCurveView() {
        const tl = gsap.timeline();

        // console.log(this.camera.initialPosition)

        tl.to(
            this.lerp,
            {
                smoothness: 0,
                duration: 2,
                onComplete: () => { this.camera.isDisableOnCurve = true; }
            }
        ).to(this.camera.instance.position,
            {
                x: this.camera.initialPosition.x,
                y: this.camera.initialPosition.y,
                z: this.camera.initialPosition.z,
                duration: 2
            },
        ).then(() => {
            this.experience.world.carModel.accelerateCarModel()
        })
    }

    update() {

        if (!this.camera.isDisableOnCurve) {
            this.lerp.progress += this.lerp.smoothness;
            this.curve.path.getPointAt(this.lerp.progress % 1, this.positionVector);

            // adjust vector to curve mesh offsets
            this.positionVector.multiplyScalar(this.curve.scale);

            this.camera.instance.position.copy(this.positionVector)
        }

    }

    addDebugUI() {
        if (this.debugUI.isActive && this.debugUI.ui) {
            const controlFolder = this.debugUI.ui.addFolder({ title: "Controls", expanded: true });
            const controlsParams = {
                curvePosition: { x: this.curve.mesh.position.x, y: this.curve.mesh.position.y, z: this.curve.mesh.position.z },
                curveRotation: { x: this.curve.mesh.rotation.x, y: this.curve.mesh.rotation.y, z: this.curve.mesh.rotation.z },
            }

            controlFolder.addInput(controlsParams, "curvePosition").on("change", () => {
                this.curve.mesh.position.x = controlsParams.curvePosition.x;
                this.curve.mesh.position.y = controlsParams.curvePosition.y;
                this.curve.mesh.position.z = controlsParams.curvePosition.z;
            })

            controlFolder.addInput(controlsParams, "curveRotation").on("change", () => {
                this.curve.mesh.rotation.x = controlsParams.curveRotation.x;
                this.curve.mesh.rotation.y = controlsParams.curveRotation.y;
                this.curve.mesh.rotation.z = controlsParams.curveRotation.z;
            })
        }
    }


}