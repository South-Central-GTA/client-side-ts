import {CatalogItemInterface} from "./catalog-item.interface";
import {ItemState} from "@enums/item.state";
import {GenderType} from "@enums/gender.type";

export interface ItemInterface {
    id: number;
    catalogItemName: string;
    catalogItem: CatalogItemInterface;
    slot?: number;
    droppedByCharacter?: string;
    customData: string;
    note: string;
    amount: number;
    isBought: boolean;
    itemState: ItemState;
    positionX?: number;
    positionY?: number;
    positionZ?: number;
    lastUsageJson?: string;

    entity?: number; // only clientside

    // only for cloth items
    genderType?: GenderType;
    drawableId?: number;
    textureId?: number;
    title?: string;
    
    // only for weapon attachments
    attachedToWeaponItem?: number;
    attachmentItems?: ItemInterface[];
}