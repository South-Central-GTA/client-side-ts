import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {on, onServer} from "../decorators/events";
import {FreeCamModule} from "../modules/free-cam.module";

@foundation() @singleton()
export class FreeCamHandler {

    public constructor(private readonly freecam: FreeCamModule) {
    }

    @on("streamSyncedMetaChange")
    private onStreamSyncedMetaChange(entity: alt.Entity, key: string, value: any, oldValue: any): void {
        native.setEntityAlpha(entity.scriptID, entity.hasStreamSyncedMeta("FREECAM") ? 0 : 255, false);
        native.setEntityCollision(entity.scriptID, !entity.hasStreamSyncedMeta("FREECAM"), false);
        native.freezeEntityPosition(entity.scriptID, entity.hasStreamSyncedMeta("FREECAM"));
        native.setPedCanBeTargetted(entity.scriptID, !entity.hasStreamSyncedMeta("FREECAM"));
        native.removeAllPedWeapons(entity.scriptID, true);
    }

    @on("gameEntityCreate")
    private onGameEntityCreate(entity: alt.Entity): void {
        native.setEntityAlpha(entity.scriptID, entity.hasStreamSyncedMeta("FREECAM") ? 0 : 255, false);
        native.setEntityCollision(entity.scriptID, !entity.hasStreamSyncedMeta("FREECAM"), false);
        native.freezeEntityPosition(entity.scriptID, entity.hasStreamSyncedMeta("FREECAM"));
        native.setPedCanBeTargetted(entity.scriptID, !entity.hasStreamSyncedMeta("FREECAM"));
    }

    @onServer("freecam:open")
    private onOpen(): void {
        const camPos = alt.Player.local.pos;
        const camRot = alt.Player.local.rot;

        this.freecam.start(camPos, camRot);
    }

    @onServer("freecam:setpos")
    private onSetPos(pos: alt.Vector3): void {
        this.freecam.setPos(pos);
    }

    @onServer("freecam:close")
    private onClose(teleportToPosition: boolean): void {
        this.freecam.stop(teleportToPosition);
    }
}