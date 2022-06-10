import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EntityType} from "@enums/entity.type";
import {Vector3} from "../../extensions/vector3.extensions";
import {BlipSyncModule} from "../../modules/blip-sync.module";
import {on} from "../../decorators/events";

@foundation() @singleton()
export class BlipSyncHandler {

    constructor(private readonly blipSync: BlipSyncModule) {

        alt.onServer("entitySync:create",
                (id: number, entityType: EntityType, position: Vector3, currEntityData: { [name: string]: any }) => {
                    if (currEntityData) {
                        const data = currEntityData;
                        if (data != undefined) {
                            if (entityType === EntityType.Blip) {
                                blipSync.add(id, position, data.name, data.sprite, data.color, data.scale,
                                        data.shortRange, data.player, data.blipType, data.radius, data.alpha);
                            }
                        }
                    } else {
                        if (entityType === EntityType.Blip) {
                            blipSync.restore(id);
                        }
                    }
                });

        alt.onServer("entitySync:remove", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Blip) {
                blipSync.remove(id);
            }
        });

        alt.onServer("entitySync:clearCache", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Blip) {
                blipSync.clear(id);
            }
        });

        alt.onServer("entitySync:updatePosition", (id: number, entityType: EntityType, position: Vector3) => {
            if (entityType === EntityType.Blip) {
                blipSync.setPosition(id, position);
            }
        });

        alt.onServer("entitySync:updateData",
                (id: number, entityType: EntityType, newEntityData: { [name: string]: any }) => {
                    if (entityType === EntityType.Blip) {
                        // if (newEntityData.hasOwnProperty("locked")) {
                        //     blipSync.setLockState(id, newEntityData.locked);
                        // }
                    }
                });
    }

    @on("disconnect")
    public onPlayerDisconnect(): void {
        this.blipSync.clearAll();
    }
}