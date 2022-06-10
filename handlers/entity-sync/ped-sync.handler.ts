import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EntityType} from "@enums/entity.type";
import {Vector3} from "../../extensions/vector3.extensions";
import {PedSyncModule} from "../../modules/ped-sync.module";
import {on} from "../../decorators/events";

@foundation() @singleton()
export class PedSyncHandler {

    constructor(private readonly pedSync: PedSyncModule) {
        alt.onServer("entitySync:create",
                (id: number, entityType: EntityType, position: Vector3, currEntityData: { [name: string]: any }) => {
                    if (currEntityData) {
                        const data = currEntityData;
                        if (data != undefined) {
                            if (entityType === EntityType.Ped) {
                                pedSync.add(id, data.model, position, data.heading, data.vehicle, data.seat,
                                        data.characterModel);
                            }
                        }
                    } else {
                        if (entityType === EntityType.Ped) {
                            pedSync.restore(id);
                        }
                    }
                });

        alt.onServer("entitySync:remove", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Ped) {
                pedSync.remove(id);
            }
        });

        alt.onServer("entitySync:updatePosition", (id: number, entityType: EntityType, position: Vector3) => {
            if (entityType === EntityType.Ped) {
                pedSync.setPosition(id, position);
            }
        });

        alt.onServer("entitySync:clearCache", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Ped) {
                pedSync.clear(id);
            }
        });

        alt.onServer("entitySync:updateData",
                (id: number, entityType: EntityType, newEntityData: { [name: string]: any }) => {
                    if (entityType === EntityType.Ped) {
                        if (newEntityData.hasOwnProperty("heading")) {
                            pedSync.setHeading(id, newEntityData.heading);
                        }
                    }
                });
    }

    @on("disconnect")
    public onPlayerDisconnect(): void {
        this.pedSync.clearAll();
    }
}