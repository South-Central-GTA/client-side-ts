import {VehicleInterface} from "./vehicle.interface";

export interface CatalogVehicleInterface extends VehicleInterface {
    classId: number;
    maxTank: number;
    fuelType: number;
    price: number;
    southCentralPoints: number;
    dlcName: string;
    isOrderable: boolean;
}