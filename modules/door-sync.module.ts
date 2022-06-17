import * as native from "natives";
import {singleton} from "tsyringe";
import {DoorInterface} from "@interfaces/door.interface";
import {Vector3} from "@extensions/vector3.extensions";
import {LoggerModule} from "./logger.module";

@singleton()
export class DoorSyncModule {
    private doors: Map<number, DoorInterface> = new Map();

    public constructor(private logger: LoggerModule) {
    }

    public add(id: number, position: Vector3, heading: number, hash: number, locked: boolean): void {
        this.remove(id);

        this.doors.set(id, {
            hash: hash, locked: locked, position: position, heading: heading, id: id,
        });

        this.setLockState(id, locked);
    }

    public restore(id: number): void {
        if (this.doors.has(id)) {
            let door = this.doors.get(id);

            this.setLockState(id, door.locked);
        }
    }

    public remove(id: number): void {
        if (this.doors.has(id)) {
            this.doors.delete(id);
        }
    }

    public clearAll(): void {
        this.doors = new Map();
    }

    public setPosition(id: number, position: Vector3): void {
        if (this.doors.has(id)) {
            this.doors.get(id).position = position;
        }
    }

    public setLockState(id: number, locked: boolean): void {
        if (this.doors.has(id)) {
            this.doors.get(id).locked = locked;
            let door = this.doors.get(id);
            
            native.setStateOfClosestDoorOfType(door.hash, door.position.x, door.position.y, door.position.z,
                    door.locked, door.heading, false);
            native.doorControl(door.hash, door.position.x, door.position.y, door.position.z, door.locked, 0.0,
                    door.heading, 0.0);
        }
    }
}