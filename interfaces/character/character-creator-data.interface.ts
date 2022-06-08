import {CharacterCreatorPurchaseInterface} from "./character-creator-purchase.interface";
import {CharacterInterface} from "@interfaces/character/character.interface";

export interface CharacterCreatorDataInterface {
    character: CharacterInterface;
    startMoney: number;
    hasPhone: boolean;
    isRegistered: boolean;
    hasDrivingLicense: boolean;
    purchaseOrders: CharacterCreatorPurchaseInterface[];
    spawnId: number;
}