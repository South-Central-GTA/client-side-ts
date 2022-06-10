import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {LoggerModule} from "../logger.module";
import * as alt from "alt-client";
import {EventModule} from "../event.module";

@foundation() @singleton()
export class InVehicleMenu {
    constructor(private readonly logger: LoggerModule, private readonly event: EventModule) {
    }

    public interact(currentVehicle: alt.Vehicle) {
        this.event.emitServer("invehicleactions:get");
    }
}