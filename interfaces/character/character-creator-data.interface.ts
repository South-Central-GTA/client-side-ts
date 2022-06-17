import {CharacterCreatorPurchaseInterface} from "./character-creator-purchase.interface";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {ClothesInterface} from "@interfaces/character/clothes.interface";

export interface CharacterCreatorDataInterface {
    character: CharacterInterface;
    clothes: ClothesInterface; 
    startMoney: number;
    hasPhone: boolean;
    isRegistered: boolean;
    hasDrivingLicense: boolean;
    purchaseOrders: CharacterCreatorPurchaseInterface[];
    spawnId: number;
}