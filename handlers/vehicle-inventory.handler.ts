import * as alt from "alt-client";
import { singleton } from "tsyringe";
import { foundation } from "../decorators/foundation";
import { onServer, on } from "../decorators/events";
import { InventoryModule } from "../modules/inventory.module";
import { KeyCodes } from "../enums/keycode.type";
import { Player } from "../extensions/player.extensions";
import { VehicleModule } from "../modules/vehicle.module";
import { LoggerModule } from "../modules/logger.module";
import { UpdateModule } from "../modules/update.module";
import { MathModule } from "../modules/math.module";
import {EventModule} from "../modules/event.module";
import {NotificationType} from "../enums/notification.type";
import {NotificationModule} from "../modules/notification.module";

@foundation()
@singleton()
export class VehicleInventoryHandler {
    private currentVehicle: alt.Vehicle;

    constructor(
        private readonly inventory: InventoryModule,
        private readonly player: Player,
        private readonly vehicle: VehicleModule,
        private readonly logger: LoggerModule,
        private readonly update: UpdateModule,
        private readonly math: MathModule,
        private readonly notification: NotificationModule,
        private readonly event: EventModule) { }

    @on('keydown')
    public onKeydown(key: number): void {
        if (key === KeyCodes.ESCAPE || key === KeyCodes.I) {
            if (this.currentVehicle === undefined) {
                return;
            }

            this.close();
        }
    }

    @onServer("vehicleinventory:interact")
    public onInteract(vehicle: alt.Vehicle): void {
        if (this.math.distance(this.math.getEntityRearPosition(vehicle.scriptID), alt.Player.local.pos) > 1) {
            this.notification.sendNotification({
                type: NotificationType.ERROR,
                text: "Dein Charakter befindet sich nicht am Kofferraum."
            });
            return;
        }
        
        this.currentVehicle = vehicle;
        this.vehicle.setTrunkState(vehicle, true);
        this.inventory.open();
    }

    private close() {
        this.vehicle.setTrunkState(this.currentVehicle, false);
        this.currentVehicle = undefined;
        this.event.emitServer("vehicleinventory:close");
    }
}