import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EventModule} from "../event.module";
import {ObjectSyncModule} from "../object-sync.module";
import {LoggerModule} from "../logger.module";
import {Player} from "../../extensions/player.extensions";

@foundation() @singleton()
export class ObjectMenu {
    constructor(private readonly event: EventModule, private readonly objectSync: ObjectSyncModule, private readonly logger: LoggerModule, private readonly player: Player) {
    }

    public interact(entityId: number): void {
        const model = native.getEntityModel(entityId);

        if (this.player.isAduty) {
            alt.logWarning("Id: " + model + ", Position: " + JSON.stringify(native.getEntityCoords(entityId, false)));
        }

        let droppedObjId = undefined;
        const object = this.objectSync.getObjectByEntity(entityId);
        if (object) {
            droppedObjId = object.id
        }

        this.event.emitServer("objectactions:get", entityId, model, droppedObjId);
    }
}