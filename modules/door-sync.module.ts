import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {DoorInterface} from "../interfaces/door.interface";
import {Vector3} from "../extensions/vector3.extensions";
import {LoggerModule} from "./logger.module";

@singleton()
export class DoorSyncModule {
    private doors: DoorInterface[] = [];
    
    public constructor(private logger: LoggerModule) {
    }
    
    public add(id: number, position: Vector3, heading: number, hash: number, locked: boolean): void {
        this.clear(id);
        
        this.doors[id] = {
            hash: hash, 
            locked: locked, 
            position: position,
            heading: heading, 
            id: id, 
        };
        
        this.setLockState(id, locked);
    }

    public getDoor(entityId: number): DoorInterface {
        if (this.doors.hasOwnProperty(entityId)) {
            return this.doors[entityId];
        }
        else {
            return null;
        }
    }
    
    public  restore(id: number): void {
        if (this.doors.hasOwnProperty(id)) {
            let door = this.doors[id];

            this.setLockState(id, door.locked);
        }
    }
    
    public remove(id: number): void {
        if (this.doors.hasOwnProperty(id)) {
            delete this.doors[id];
        }
    }

    public clear(id: number): void {
        if (this.doors.hasOwnProperty(id)) {
            delete this.doors[id];
        }
    }
    
    public clearAllDoor(): void {
        this.doors = [];
    }
    
    public setPosition(id: number, position: Vector3): void {
        if (this.doors.hasOwnProperty(id)) {
            this.doors[id].position = position;
        }
    }
    
    public setLockState(id: number, locked: boolean): void {
        if (this.doors.hasOwnProperty(id)) {
            this.doors[id].locked = locked;
            let door = this.doors[id];

            native.setStateOfClosestDoorOfType(door.hash, door.position.x, door.position.y, door.position.z, door.locked, door.heading, false);
            native.doorControl(door.hash, door.position.x, door.position.y, door.position.z, door.locked, 0.0, door.heading, 0.0);
        }
    }
}