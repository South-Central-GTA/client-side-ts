import {VehicleInterface} from "./vehicle.interface";

export interface CatalogVehicleInterface extends VehicleInterface {
    classId: string;
    maxTank: number;
    fuelType: number;
    price: number;
    southCentralPoints: number;
    amountOfOrderableVehicles: number;
    dlcName: string;
    isOrderable: boolean;
}