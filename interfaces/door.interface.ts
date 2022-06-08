import {Vector3} from "@extensions/vector3.extensions";

export interface DoorInterface {
    id: number;
    hash: number;
    locked: boolean;
    position: Vector3;
    heading: number,
}
