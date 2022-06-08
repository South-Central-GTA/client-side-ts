import {Vector3} from "@extensions/vector3.extensions";

export interface ServerObjectInterfaces {
    id: number;
    model: string;
    name: string;
    entity: number;
    freeze: boolean;
    position: Vector3;
    rotation: Vector3;
    fireEntity?: number;
    onFire: boolean;
    itemId?: number;

    // optionals
    ownerName?: string;
    createdAtJson?: string;
}
