import ResourcesLoader from "@/WebGL/utils/ResourcesLoader";
import AppExperience from "..";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import DebugUI from "@/WebGL/utils/DebugUI";
import * as THREE from "three"
import carFloorFragmentShader from "./shaders/carFloor/fragment.glsl"
import carFloorVertexShader from "./shaders/carFloor/vertex.glsl"
import gsap from "gsap"
import Controls from "./Controls";
import Time from "@/WebGL/utils/Time";


interface CarCompartmentTypes {
    carBody: THREE.Object3D | null,
    carBottom: THREE.Object3D | null,
    carTyres: THREE.Object3D[],
    carDoors: THREE.Object3D[],
    carScreenGlasses: THREE.Object3D[],
    carChairs: THREE.Object3D[],
    carShadowMesh: THREE.Object3D | null,
    carRoadLaneMesh: THREE.Object3D | null,
    positionOffset: number
}

type carSwerveDirectionType = "Left" | "Right"

interface CarType {
    mesh: THREE.Group | null,
    isAccelerating: boolean
}
export default class CarModel {
    experience: AppExperience;
    camera: THREE.PerspectiveCamera
    resourceLoader: ResourcesLoader;
    scene: THREE.Scene;
    debugUi: DebugUI;
    time: Time;
    controls: Controls;
    car: CarType;
    compactments: CarCompartmentTypes;

    constructor(experience: AppExperience, controls: Controls) {
        this.experience = experience;
        this.camera = experience.camera.cameraInstance;
        this.scene = experience.scene;
        this.resourceLoader = experience.resourcesLoader;
        this.debugUi = experience.debugUI;
        this.time = experience.time;
        this.controls = controls

        this.car = {
            mesh: null,
            isAccelerating: false
        }

        // --------- Car parts object -----------
        this.compactments = {
            carBody: null,
            carBottom: null,
            carShadowMesh: null,
            carRoadLaneMesh: null,
            carTyres: [],
            carChairs: [],
            carDoors: [],
            carScreenGlasses: [],
            positionOffset: 10
        }

        this.init();
        // this.dummyModel()
    }

    dummyModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: "red", depthWrite: false });

        const mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
    }

    init() {
        this.resourceLoader.on("carModelGroupReady", () => { // ----- Car model is done loading ------
            this.car.mesh = (this.resourceLoader.items.carModel as GLTF).scene
            this.car.mesh.rotation.y = 0.8;

            // ------- Extract all car compactments ----------
            this.car.mesh.traverse(child => {

                if (child.name.includes("car")) {
                    child.position.y += this.compactments.positionOffset;
                }

                if (child.name.includes("car-floor")) {
                    this.compactments.carShadowMesh = child;
                }
                if (child.name.includes("car-lane")) {
                    child.visible = false;
                    this.compactments.carRoadLaneMesh = child;
                }

                if (child.name.includes("car-body")) {
                    this.compactments.carBody = child
                }

                if (child.name.includes("car-bottom")) {
                    this.compactments.carBottom = child
                }

                if (child.name.includes("car-tyre")) {
                    this.compactments.carTyres.push(child);
                }

                if (child.name.includes("car-door")) {
                    this.compactments.carDoors.push(child)
                }

                if (child.name.includes("car-screen")) {
                    this.compactments.carScreenGlasses.push(child)
                }

                if (child.name.includes("car-chair")) {
                    this.compactments.carChairs.push(child);
                }
            })


            this.scene.add(this.car.mesh);
            this.setUpFloor();
            this.setUpRoadLane();
            this.transitionCompactmentIn();

            this.addDebugUi();
        })
    }

    transitionCompactmentIn() { // ------ animate car compactment into camera view ----------
        const tyreVectors = this.compactments.carTyres.map(tyre => tyre.position);
        const doorsVectors = this.compactments.carDoors.map(door => door.position);
        const screenVectors = this.compactments.carScreenGlasses.map(screen => screen.position);
        const chairVectors = this.compactments.carChairs.map(chair => chair.position);

        const tl = gsap.timeline({ defaults: { duration: 1 } })

        if (this.compactments.carBody) {
            tl.to(tyreVectors,
                {
                    y: `-=${this.compactments.positionOffset}`,
                    stagger: 0.2,
                    duration: 2,
                    ease: "Bounce.easeOut"
                }
            ).to([this.compactments.carShadowMesh?.position, this.compactments.carBottom?.position, this.compactments.carRoadLaneMesh?.position],
                {
                    y: `-=${this.compactments.positionOffset}`
                }
            ).to(chairVectors,
                {
                    y: `-=${this.compactments.positionOffset}`,
                    stagger: 0.3,
                }
            ).to(this.compactments.carBody.position,
                {
                    y: `-=${this.compactments.positionOffset}`
                }
            ).to(screenVectors,
                {
                    y: `-=${this.compactments.positionOffset}`,
                    stagger: 0.2
                }
            ).to(doorsVectors,
                {
                    y: `-=${this.compactments.positionOffset}`,
                    stagger: 0.2,
                }
            ).then(() => {
                this.controls.disableCameraOnCurveView();
            })
        }

    }

    accelerateCarModel() { // ------- car acceleration animation -------------
        this.car.isAccelerating = true;
        this.compactments.carRoadLaneMesh!.visible = true;

        //-------- Sweve the car either left or right --------------
        let swerveDirection: carSwerveDirectionType = "Right";
        const swerveCar = (dir: carSwerveDirectionType) => {
            const tl = gsap.timeline();
            const carRotation = Math.PI / 12;

            if (this.car.mesh) {
                tl.to(
                    this.car.mesh.rotation,
                    {
                        y: `${dir === "Right" ? "+" : "-"}=${carRotation}`,
                        ease: "power2.inOut",
                        duration: 5
                    },
                ).to(this.car.mesh.rotation,
                    {
                        y: `${dir === "Right" ? "-" : "+"}=${carRotation}`,
                        ease: "power2.inOut",
                        duration: 3
                    },
                ).then(() => {
                    if (dir === "Left") {
                        swerveDirection = "Right"
                    } else if (dir === "Right") {
                        swerveDirection = "Left"
                    }
                    swerveCar(swerveDirection)
                })
            }
        }

        swerveCar(swerveDirection)

    }

    setUpFloor() { // -------- set up car floor shadow -----------
        // --------- setup texture -------------
        const floorTexture = this.resourceLoader.items.carFloorTexture as THREE.Texture;
        floorTexture.flipY = false;
        floorTexture.colorSpace = THREE.SRGBColorSpace;

        //---------- set up floor material----------
        const floorMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uFloorTexture: { value: floorTexture }
            },
            fragmentShader: carFloorFragmentShader,
            vertexShader: carFloorVertexShader
        });

        (this.compactments.carShadowMesh as any).material = floorMaterial;
    }

    setUpRoadLane() {
        //--------- setup texture----------
        const laneTexture = this.resourceLoader.items.carLaneTexture as THREE.Texture;
        laneTexture.flipY = false;
        laneTexture.colorSpace = THREE.SRGBColorSpace;


        const laneMaterial = new THREE.MeshBasicMaterial({
            alphaMap: laneTexture,
            depthWrite: false,
            transparent: true
        });

        (this.compactments.carRoadLaneMesh as any).material = laneMaterial;
    }

    addDebugUi() { //---------- Add debug UI-------------
        if (this.debugUi.isActive && this.debugUi.ui) {
            const carFolder = this.debugUi.ui.addFolder({ title: "carModel", expanded: false });

            if (this.car.mesh) {
                const carParams = {
                    position: { x: this.car.mesh.position.x, y: this.car.mesh.position.y, z: this.car.mesh.position.z },
                    rotation: { x: this.car.mesh.rotation.x, y: this.car.mesh.rotation.y, z: this.car.mesh.rotation.z },
                    scale: { x: this.car.mesh.scale.x, y: this.car.mesh.scale.y, z: this.car.mesh.scale.z },
                }

                carFolder.addInput(carParams, "position").on("change", () => {
                    if (this.car.mesh) {
                        this.car.mesh.position.x = carParams.position.x;
                        this.car.mesh.position.y = carParams.position.y;
                        this.car.mesh.position.z = carParams.position.z;
                    }

                })

                carFolder.addInput(carParams, "rotation").on("change", () => {
                    if (this.car.mesh) {
                        this.car.mesh.rotation.x = carParams.rotation.x;
                        this.car.mesh.rotation.y = carParams.rotation.y;
                        this.car.mesh.rotation.z = carParams.rotation.z;
                    }

                })

                carFolder.addInput(carParams, "scale").on("change", () => {
                    if (this.car.mesh) {
                        this.car.mesh.scale.x = carParams.scale.x;
                        this.car.mesh.scale.y = carParams.scale.y;
                        this.car.mesh.scale.z = carParams.scale.z;
                    }

                })
            }


        }
    }

    update() {

        if (this.car.mesh) { //------------make camera look at car on each tick------------
            this.camera.lookAt(this.car.mesh.position)
        }


        if (this.car.isAccelerating) {
            //-------- Animate car tyres----------
            this.compactments.carTyres.forEach(tyre => {
                tyre.rotation.x += 0.1;
            })

            //-------------Animate Road Lane------------
            this.compactments.carRoadLaneMesh!.position.z -= 0.1;
            const rightOffset = 42069 * 500;
            this.compactments.carRoadLaneMesh!.position.z = (this.compactments.carRoadLaneMesh!.position.z + rightOffset) % 15 - 7.5;

        }


    }
} 