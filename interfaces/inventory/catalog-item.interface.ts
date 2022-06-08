export interface CatalogItemInterface {
    id: number;
    name: string;
    image: string;
    description: string;
    rarity: number;
    weight: number;
    equippable: boolean;
    stackable: boolean;
    buyable: boolean;
    sellable: boolean;
    price: number;
    sellPrice: number;
}