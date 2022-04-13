import alt from "alt-client";
import {Vector3} from "../../extensions/vector3.extensions";

export class ServerPedInterface {
    id: number;
    model: string;
    position: Vector3;
    heading: number;
    
    vehicle?: alt.Vehicle;
    seat?: number;

    entity?: number; //Only clientside
}
