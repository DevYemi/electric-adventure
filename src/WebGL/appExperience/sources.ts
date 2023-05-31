/**
 * THIS FILE CONTAINS ALL THE ASSESTS e.g textures, THAT WILL BE USED IN THE LOGIN PAGE EXPERIENCE
 */
import carModel from "@/assets/model/car.glb"

console.log(carModel)


import { Sources } from '../utils/types'

const sources: Sources[] = [
    {
        name: 'carModel',
        type: 'gltfModel',
        path: carModel,
        useDraco: true,
        groupName: 'carModel',
        totalGroupMember: 1,
    },
]


export default sources