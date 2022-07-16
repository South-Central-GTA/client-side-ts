import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EntityType} from "@enums/entity.type";
import {Vector3} from "../../extensions/vector3.extensions";
import {MarkerSyncModule} from "../../modules/marker-sync.module";
import {on} from "../../decorators/events";

@foundation() @singleton()
export class MarkerSyncHandler {

    constructor(private readonly markerSync: MarkerSyncModule) {
        alt.onServer("entitySync:create",
                (id: number, entityType: EntityType, position: Vector3, currEntityData: { [name: string]: any }) => {
                    if (currEntityData) {
                        const data = currEntityData;
                        if (data != undefined) {
                            if (entityType === EntityType.Marker) {
                                markerSync.add(id, data.markerType, position, data.direction, data.rotation, data.scale,
                                        data.color, data.bobUpDown, data.text, data.ownerName, data.createdAtJson);
                            }
                        }
                    } else {
                        if (entityType === EntityType.Marker) {
                            markerSync.restore(id);
                        }
                    }
                });

        alt.onServer("entitySync:remove", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Marker) {
                markerSync.remove(id);
            }
        });

        alt.onServer("entitySync:updatePosition", (id: number, entityType: EntityType, position: Vector3) => {
            if (entityType === EntityType.Marker) {
                markerSync.setPosition(id, position);
            }
        });

        alt.onServer("entitySync:clearCache", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Marker) {
                markerSync.clear(id);
            }
        });
    }

    @on("disconnect")
    public onPlayerDisconnect(): void {
        this.markerSync.clearAll();
    }
}