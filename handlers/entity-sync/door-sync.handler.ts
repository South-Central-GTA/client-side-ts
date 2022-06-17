import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EntityType} from "@enums/entity.type";
import {Vector3} from "../../extensions/vector3.extensions";
import {DoorSyncModule} from "../../modules/door-sync.module";
import {on} from "../../decorators/events";

@foundation() @singleton()
export class DoorSyncHandler {

    constructor(private readonly doorSync: DoorSyncModule) {
        alt.onServer("entitySync:create",
                (id: number, entityType: EntityType, position: Vector3, currEntityData: { [name: string]: any }) => {
                    if (currEntityData) {
                        const data = currEntityData;
                        if (data != undefined) {
                            if (entityType === EntityType.Door) {
                                doorSync.add(id, position, data.heading, data.hash, data.locked);
                            }
                        }
                    } else {
                        if (entityType === EntityType.Door) {
                            doorSync.restore(id);
                        }
                    }
                });

        alt.onServer("entitySync:remove", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Door) {
                doorSync.remove(id);
            }
        });

        alt.onServer("entitySync:clearCache", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Door) {
                doorSync.remove(id);
            }
        });

        alt.onServer("entitySync:updatePosition", (id: number, entityType: EntityType, position: Vector3) => {
            if (entityType === EntityType.Door) {
                doorSync.setPosition(id, position);
            }
        });

        alt.onServer("entitySync:updateData", (id: number, entityType: EntityType, newEntityData: { [name: string]: any }) => {
            if (entityType === EntityType.Door) {
                if (newEntityData.hasOwnProperty("locked")) {
                    doorSync.setLockState(id, newEntityData.locked);
                }
            }
        });
    }

    @on("disconnect")
    public onPlayerDisconnect(): void {
        this.doorSync.clearAll();
    }
}