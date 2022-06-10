import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EntityType} from "@enums/entity.type";
import {Vector3} from "../../extensions/vector3.extensions";
import {ObjectSyncModule} from "../../modules/object-sync.module";
import {on} from "../../decorators/events";

@foundation() @singleton()
export class ObjectSyncHandler {

    constructor(private readonly objectSync: ObjectSyncModule) {
        alt.onServer("entitySync:create",
                (id: number, entityType: EntityType, position: Vector3, currEntityData: { [name: string]: any }) => {
                    if (currEntityData) {
                        const data = currEntityData;
                        if (data != undefined) {
                            if (entityType === EntityType.Object) {
                                objectSync.add(id, data.model, data.name, position, data.rotation, data.freeze,
                                        data.onFire, data.itemId, data.ownerName, data.createdAtJson);
                            }
                        }
                    } else {
                        if (entityType === EntityType.Object) {
                            objectSync.restore(id);
                        }
                    }
                });

        alt.onServer("entitySync:remove", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Object) {
                objectSync.remove(id);
            }
        });

        alt.onServer("entitySync:clearCache", (id: number, entityType: EntityType) => {
            if (entityType === EntityType.Object) {
                objectSync.clear(id);
            }
        });
    }

    @on("disconnect")
    public onPlayerDisconnect(): void {
        this.objectSync.clearAll();
    }
}