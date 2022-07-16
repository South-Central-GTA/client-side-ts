import {VehicleServicePriceTable} from "@interfaces/vehicles/vehicle-service-price-table.interface";

export interface VehicleServiceInfoDataInterface {
    productCount: number;
    currentProductPrice: number;
    vehiclePrice: number;
    vehicleModelName: string;
    primaryColor: number;
    secondaryColor: number;
    vehicleDamagePercentage: number;
    priceTable: VehicleServicePriceTable;
}