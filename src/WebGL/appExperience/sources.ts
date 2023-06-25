/**
 * THIS FILE CONTAINS ALL THE ASSESTS e.g textures, THAT WILL BE USED IN THE LOGIN PAGE EXPERIENCE
 */
import carModel from "@/assets/model/car.glb";
import carFloorTexture from "@/assets/car-floor-texture.png"



import { Sources } from '../utils/types'

const sources: Sources[] = [
    {
        name: 'carModel',
        type: 'gltfModel',
        path: carModel,
        useDraco: true,
        groupName: "carModelGroup",
        totalGroupMember: 2
    },
    {
        name: 'carFloorTexture',
        type: 'texture',
        path: carFloorTexture,
        useDraco: false,
        groupName: "carModelGroup",
        totalGroupMember: 2
    },
]


export default sources