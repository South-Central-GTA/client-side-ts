import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {CharacterCreatorDataInterface} from "../interfaces/character/character-creator-data.interface";
import {CharacterInterface} from "../interfaces/character/character.interface";
import {CharacterFormInterface} from "../interfaces/character/character-form.interface";
import {CharacterCreatorPurchaseInterface} from "../interfaces/character/character-creator-purchase.interface";
import {CharacterCreatorPurchaseType} from "../enums/character-creator-purchase.type";
import {EventModule} from "./event.module";
import {ItemInterface} from "../interfaces/inventory/item.interface";
import {UID} from "../helpers";
import {ItemState} from "../enums/item.state";
import {LoggerModule} from "./logger.module";
import {ClothingInterface} from "../interfaces/character/clothing.interface";
import {ClothingModule} from "./clothing.module";

@singleton()
export class CharCreatorModule {
    get getCharacterData() {
        return this.characterCreatorData;
    }

    private characterCreatorData: CharacterCreatorDataInterface;
    
    private MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE: number = 0;

    constructor(
        private readonly event: EventModule,
        private readonly logger: LoggerModule,
        private readonly clothing: ClothingModule) { }

    public setup(character: CharacterInterface, moneyToSouthCentralPointsValue: number): void {
        this.characterCreatorData = {
            character: character,
            startMoney: 0,
            hasPhone: false,
            isRegistered: false,
            hasDrivingLicense: false,
            purchaseOrders: [],
            spawnId: 0
        }

        this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE = moneyToSouthCentralPointsValue;
    }

    public orderVehicleLimit(): boolean {
        return (this.characterCreatorData.purchaseOrders.filter(po => po.type === CharacterCreatorPurchaseType.VEHICLE).length > 1)
    }

    public addPurchase(purchase: CharacterCreatorPurchaseInterface): void {
        this.characterCreatorData.purchaseOrders.push(purchase);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);
    }

    public removePurchase(purchaseOrder: CharacterCreatorPurchaseInterface): void {
        this.characterCreatorData.purchaseOrders = this.characterCreatorData.purchaseOrders.filter(po => po.id !== purchaseOrder.id);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);
                
        switch (purchaseOrder.type) {
            case CharacterCreatorPurchaseType.HOUSE:
                this.event.emitServer("houseselector:unselect");
                this.event.emitGui("houseselector:select", null);
                break;
        }
    }

    public resetTypePurchaseOrders(type: CharacterCreatorPurchaseType): void {
        this.characterCreatorData.purchaseOrders = this.characterCreatorData.purchaseOrders.filter(po => po.type !== type);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);
    }

    public setSpawn(id: number): void {
        this.characterCreatorData.spawnId = id;
    }

    public setCharacter(character: CharacterInterface): void {
        this.characterCreatorData.character = character;
    }

    public setForm(form: CharacterFormInterface): void {
        this.characterCreatorData.character.firstName = form.profile.firstName;
        this.characterCreatorData.character.lastName = form.profile.lastName;
        this.characterCreatorData.character.origin = form.profile.origin;
        this.characterCreatorData.character.story = form.profile.story;
        this.characterCreatorData.character.age = form.profile.age;
        this.characterCreatorData.character.bodySize = form.profile.bodySize;
        this.characterCreatorData.character.physique = form.profile.physique;

        this.characterCreatorData.startMoney = form.startMoney;
        this.characterCreatorData.hasPhone = form.hasPhone;
        this.characterCreatorData.hasDrivingLicense = form.hasDrivingLicense;
        this.characterCreatorData.isRegistered = form.isRegistered;
    }

    public getInventoryClothingItems(character: CharacterInterface): ItemInterface[] {
        this.resetTypePurchaseOrders(CharacterCreatorPurchaseType.CLOTHINGS);

        character.inventory.items = [];

        if (character.clothes.hat) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_HAT", 0, character.clothes.hat));
        }

        if (character.clothes.glasses) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_GLASSES", 1, character.clothes.glasses));
        }

        if (character.clothes.ears) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_EARS", 2, character.clothes.ears));
        }

        if (character.clothes.mask) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_MASK", 1, character.clothes.mask));
        }

        if (character.clothes.top) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_TOP", 11, character.clothes.top));
        }

        if (character.clothes.backPack) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_BACKPACK", 5, character.clothes.backPack));
        }

        if (character.clothes.underShirt) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_UNDERSHIRT", 8, character.clothes.underShirt));
        }

        if (character.clothes.accessories) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_ACCESSORIES", 7, character.clothes.accessories));
        }

        if (character.clothes.watch) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_WATCH", 6, character.clothes.watch));
        }

        if (character.clothes.bracelets) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_BRACELET", 7, character.clothes.bracelets));
        }

        if (character.clothes.pants) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_PANTS", 4, character.clothes.pants));
        }

        if (character.clothes.bodyArmor) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_BODY_ARMOR", 9, character.clothes.bodyArmor));
        }

        if (character.clothes.shoes) {
            character.inventory.items.push(this.getClothingItem("CLOTHING_SHOES", 6, character.clothes.shoes));
        }

        return character.inventory.items;
    }
    
    private getClothingItem(catalogItemName: string, compId: number, clothing: ClothingInterface): ItemInterface {
        const price = this.clothing.getClothCategoryPrice(catalogItemName, compId);
        
        this.addPurchase({
            id: UID(),
            type: CharacterCreatorPurchaseType.CLOTHINGS,
            name: clothing.title,
            description: "Kleidungsstück",
            southCentralPoints: Number.parseInt((price * this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE).toFixed(0)),
            removeable: false,
            orderedVehicle: null
        });

        return {
            id: UID(),
            amount: 1,
            catalogItemName: catalogItemName,
            catalogItem: null,
            note: "",
            customData: JSON.stringify(clothing),
            condition: null,
            isBought: true,
            itemState: ItemState.EQUIPPED
        };
    }
}