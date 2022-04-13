import * as alt from "alt-client";
import * as native from "natives";
import { singleton } from "tsyringe";
import { foundation } from "../decorators/foundation";
import { onServer } from "../decorators/events";
import { CatalogVehicleInterface } from "../interfaces/catalog-vehicle.interface";
import { EventModule } from "../modules/event.module";

@foundation()
@singleton()
export class VehicleCatalogHandler {

    constructor(
        private readonly event: EventModule) { }

    @onServer("vehiclecatalog:getcatalogveh")
    public onGetCatalogVeh(catalogVehicle: CatalogVehicleInterface): void {
        if (alt.Player.local.vehicle == null) {
            return;
        }
        
        const vehicleName = native.getDisplayNameFromVehicleModel(alt.Player.local.vehicle.model);
        const classNumber = native.getVehicleClassFromName(alt.Player.local.vehicle.model);
        const localName = native.getLabelText(vehicleName);
        
        const vehicle: CatalogVehicleInterface = catalogVehicle;
        vehicle.model = vehicle.model == "" ? vehicleName.toLowerCase() : vehicle.model;
        vehicle.displayName = localName;
        vehicle.displayClass = this.getClassName(classNumber);
        
        this.event.emitServer("vehiclecatalog:saveveh", JSON.stringify(vehicle));
    }

    private getClassName (classId: number): string {
        switch (classId) {
            case 0:
                return "Compact";
            case 1:
                return "Sedan";
            case 2:
                return "SUV";
            case 3:
                return "Coupe";
            case 4:
                return "Muscle";
            case 5:
                return "Sport Classic";
            case 6:
                return "Sport";
            case 7:
                return "Super";
            case 8:
                return "Motorrad";
            case 9:
                return "Off-Road";
            case 10:
                return "Industrial";
            case 11:
                return "Utility";
            case 12:
                return "Vans";
            case 13:
                return "Fahrrad";
            case 14:
                return "Boot";
            case 15:
                return "Helikopter";
            case 16:
                return "Flugzeug";
            case 17:
                return "Module";
            case 18:
                return "Einsatzfahrzeug";
            case 19:
                return "Military";
            case 20:
                return "Commercial";
            case 21:
                return "Zug";

            default:
                break;
        }
    }
}