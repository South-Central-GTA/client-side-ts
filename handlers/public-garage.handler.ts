import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {LoggerModule} from "../modules/logger.module";
import {UpdateModule} from "../modules/update.module";
import {TextModule} from "../modules/text.module";
import {BlipModule} from "../modules/blip.module";
import {EventModule} from "../modules/event.module";
import {Player} from "@extensions/player.extensions";
import {GuiModule} from "../modules/gui.module";
import {PublicGarageVehicleInterface} from "@interfaces/vehicles/public-garage-vehicle.interface";
import {VehicleInterface} from "@interfaces/vehicles/vehicle.interface";

@foundation() @singleton()
export class PublicGarageHandler {

    public constructor(private readonly text: TextModule, private readonly update: UpdateModule, private readonly blip: BlipModule, private readonly logger: LoggerModule, private readonly event: EventModule, private readonly player: Player, private readonly gui: GuiModule) {
    }

    @onServer("publicgarage:setupunpark")
    public onSetupUnpark(vehicles: PublicGarageVehicleInterface[]): void {
        this.player.openMenu();
        this.player.blockGameControls(true);
        this.player.showCursor();
        this.gui.focusView();

        this.event.emitGui("publicgarage:setupunpark", vehicles);
    }

    @onServer("publicgarage:showrespawnvehiclelist")
    private onShowRespawnVehicleList(vehicles: VehicleInterface[]): void {
        this.player.openMenu();
        this.player.blockGameControls(true);
        this.player.showCursor();
        this.gui.focusView();

        this.event.emitGui("publicgarage:showrespawnvehiclelist", vehicles);
    }
}