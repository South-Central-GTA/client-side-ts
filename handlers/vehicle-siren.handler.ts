import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {on} from "../decorators/events";
import alt from "alt-client";
import native from "natives";
import {EventModule} from "../modules/event.module";
import {KeyCodes} from "@enums/keycode.type";
import {Player} from "@extensions/player.extensions";

@foundation() @singleton()
export class VehicleSirenHandler {

    constructor(private readonly event: EventModule, private readonly player: Player) {
    }

    @on("keydown")
    public keydown(key: number) {
        if (!alt.Player.local.vehicle || this.player.getIsAnyMenuOpen) {
            return;
        }

        if (key === KeyCodes.G) {
            this.event.emitServer("vehiclesiren:toggle");
        }
    }

    @on("streamSyncedMetaChange")
    private onStreamSyncedMetaChange(entity: alt.Entity, key: string, value: any, oldValue: any): void {
        if (!entity.hasStreamSyncedMeta("SIREN_MUTED")) {
            return
        }

        const muted = entity.getStreamSyncedMeta<boolean>("SIREN_MUTED");

        native.setVehicleHasMutedSirens(entity.scriptID, muted);
    }
}