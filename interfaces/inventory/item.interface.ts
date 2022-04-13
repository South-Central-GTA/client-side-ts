import { ItemState } from "../../enums/item.state";
import { CatalogItemInterface } from "./catalog-item.interface";

export interface ItemInterface {
    id: number;
    catalogItemName: string;
    catalogItem: CatalogItemInterface;
    slot?: number;
    droppedByCharacter?: string;
    customData: string;
    note: string;
    amount: number;
    condition: number;
    isBought: boolean;
    itemState: ItemState;
    positionX?: number;
    positionY?: number;
    positionZ?: number;
    lastUsage?: string;

    entity?: number; // only clientside
    
    // only for weapon attachments
    attachedToWeaponItem?: number;
}