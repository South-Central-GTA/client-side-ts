import {ItemInterface} from "./item.interface";
import {InventoryType} from "@enums/inventory.type";

export interface InventoryInterface {
    id: number;
    inventoryType: InventoryType;
    items: ItemInterface[];
    maxWeight: number;
    name: string;
}