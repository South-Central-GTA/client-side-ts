import { Vector3 } from "alt-client";

export class RaycastResultInterface {
    isHit: boolean;
    pos: Vector3;
    normal: Vector3;
    entity: number;
}
