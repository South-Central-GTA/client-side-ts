import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {LoggerModule} from "../logger.module";
import * as alt from "alt-client";
import {EventModule} from "../event.module";
import {MathModule} from "../math.module";

@foundation() @singleton()
export class VehicleMenu {
    constructor(private readonly logger: LoggerModule, private readonly event: EventModule, private readonly math: MathModule) {
    }

    public interact(coords: alt.Vector3): void {
        let closestVehicle: alt.Vehicle;
        let lastDistance: number = 5;

        alt.Vehicle.all.forEach(vehicle => {
            const vehiclePosition = vehicle.pos;
            const distance = this.math.distance(coords, vehiclePosition);

            if (distance < lastDistance) {
                closestVehicle = vehicle;
                lastDistance = distance;
            }
        });

        if (closestVehicle === undefined) {
            return;
        }

        if (closestVehicle.hasSyncedMeta("ID")) {
            const id = closestVehicle.getSyncedMeta<number>("ID");
            this.event.emitServer("vehicleactions:get", id);
        }
    }
}