import {CharacterCreatorPurchaseType} from "@enums/character-creator-purchase.type";
import {CatalogVehicleInterface} from "@interfaces/vehicles/catalog-vehicle.interface";

export interface CharacterCreatorPurchaseInterface {
    id: number;
    type: CharacterCreatorPurchaseType;
    name: string;
    description: string;
    southCentralPoints: number;
    removeable: boolean;
    orderedVehicle: CatalogVehicleInterface;
}