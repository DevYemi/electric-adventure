/**
 * THIS FILE CONTAINS ALL THE ASSESTS e.g textures, THAT WILL BE USED IN THE LOGIN PAGE EXPERIENCE
 */
import carModel from "@/assets/model/car.glb";
import carFloorTexture from "@/assets/car-floor-texture.png"
import carLaneTexture from "@/assets/car-lane-texture.jpg"



import { Sources } from '../utils/types'

const sources: Sources[] = [
    {
        name: 'carModel',
        type: 'gltfModel',
        path: carModel,
        useDraco: true,
        groupName: "carModelGroup",
        totalGroupMember: 3
    },
    {
        name: 'carFloorTexture',
        type: 'texture',
        path: carFloorTexture,
        useDraco: false,
        groupName: "carModelGroup",
        totalGroupMember: 3
    },
    {
        name: 'carLaneTexture',
        type: 'texture',
        path: carLaneTexture,
        useDraco: false,
        groupName: "carModelGroup",
        totalGroupMember: 3
    },
]


export default sources