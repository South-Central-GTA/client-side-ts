import { CharacterInterface } from "./character.interface";
import { CharacterCreatorPurchaseInterface } from "./character-creator-purchase.interface";

export interface CharacterCreatorDataInterface {
    character: CharacterInterface;
    startMoney: number;
    hasPhone: boolean;
    isRegistered: boolean;
    hasDrivingLicense: boolean;
    purchaseOrders: CharacterCreatorPurchaseInterface[];
    spawnId: number;
}