import {Vector3} from "@extensions/vector3.extensions";
import {MarkerType} from "@enums/marker.type";
import {RGBAInterface} from "./rgba.interface";

export interface ServerMarkerInterfaces {
    id: number;
    markerType: MarkerType;
    position: Vector3;
    direction: Vector3;
    rotation: Vector3;
    scale: Vector3;
    color: RGBAInterface;
    onDisplay: boolean;
    bobUpDown: boolean;
    text?: string;
    ownerName?: string;
    createdAtJson?: string;
}
