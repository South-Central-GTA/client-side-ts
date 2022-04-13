import { singleton } from "tsyringe";
import { foundation } from "../decorators/foundation";
import {on, onGui, onServer} from "../decorators/events";
import alt from "alt-client";
import native from "natives";
import {EventModule} from "../modules/event.module";
import {CharacterInterface} from "../interfaces/character/character.interface";
import {BankAccountInterface} from "../interfaces/bank/bank-account.interface";
import {HouseInterface} from "../interfaces/house.interface";
import {VehicleInterface} from "../interfaces/vehicle.interface";
import {CriminalRecordInterface} from "../interfaces/mdc/criminal-record.interface";
import {MdcNodeInterface} from "../interfaces/mdc/mdc-node.interface";
import {HouseModule} from "../modules/house.module";
import {KeyCodes} from "../enums/keycode.type";

@foundation()
@singleton()
export class VehicleSirenHandler {
    
    constructor(private readonly event: EventModule) {
    }

    @on("keydown")
    public keydown(key: number) {
        if (!alt.Player.local.vehicle) {
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
        
        const muted = entity.getStreamSyncedMeta("SIREN_MUTED");
        
        native.setVehicleHasMutedSirens(entity.scriptID, muted);
    }
}