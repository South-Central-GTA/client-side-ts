import { ActionInterface } from "../action.interface";

export interface CatalogItemInterface {
    id: number;
    name: string;
    image: string;
    description: string;
    useValue: number;
    rarity: number;
    weight: number;
    equippable: boolean;
    stackable: boolean;
    buyable: boolean;
    sellable: boolean;
    price: number;
    sellPrice: number;
    actions: ActionInterface[];
}