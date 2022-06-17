import {singleton} from "tsyringe";
import {CharacterCreatorDataInterface} from "@interfaces/character/character-creator-data.interface";
import {CharacterCreatorPurchaseInterface} from "@interfaces/character/character-creator-purchase.interface";
import {EventModule} from "./event.module";
import {LoggerModule} from "./logger.module";
import {ClothingModule} from "./clothing.module";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {CharacterCreatorPurchaseType} from "@enums/character-creator-purchase.type";
import {UID} from "helpers";

@singleton()
export class CharCreatorModule {
    private characterCreatorData: CharacterCreatorDataInterface;
    private MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE: number = 0;
    private PHONE_POINTS_PRICE: number = 0;

    constructor(private readonly event: EventModule, private readonly logger: LoggerModule, private readonly clothing: ClothingModule) {
    }

    get getCharacterData() {
        return this.characterCreatorData;
    }

    public setup(character: CharacterInterface, moneyToSouthCentralPointsValue: number, phonePointsPrice: number): void {
        this.characterCreatorData = {
            character: character,
            clothes: {
                accessories: undefined,
                backPack: undefined,
                bodyArmor: undefined,
                bracelets: undefined,
                ears: undefined,
                glasses: undefined,
                hat: undefined,
                mask: undefined,
                pants: undefined,
                shoes: undefined,
                top: undefined,
                torso: undefined,
                underShirt: undefined,
                watch: undefined,
            },
            startMoney: 0,
            hasPhone: false,
            isRegistered: false,
            hasDrivingLicense: false,
            purchaseOrders: [],
            spawnId: 0
        }

        this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE = moneyToSouthCentralPointsValue;
        this.PHONE_POINTS_PRICE = phonePointsPrice;
    }

    public orderVehicleLimit(): boolean {
        return (this.characterCreatorData.purchaseOrders.filter(
                po => po.type === CharacterCreatorPurchaseType.VEHICLE).length > 1)
    }

    public addPurchase(purchase: CharacterCreatorPurchaseInterface): void {
        this.characterCreatorData.purchaseOrders.push(purchase);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);
    }

    public removePurchase(purchaseOrder: CharacterCreatorPurchaseInterface): void {
        this.characterCreatorData.purchaseOrders = this.characterCreatorData.purchaseOrders.filter(
                po => po.id !== purchaseOrder.id);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);

        switch (purchaseOrder.type) {
            case CharacterCreatorPurchaseType.HOUSE:
                this.event.emitServer("houseselector:unselect");
                this.event.emitGui("houseselector:select", null);
                break;
        }
    }

    public resetTypePurchaseOrders(type: CharacterCreatorPurchaseType): void {
        this.characterCreatorData.purchaseOrders = this.characterCreatorData.purchaseOrders.filter(
                po => po.type !== type);
        this.event.emitGui("charcreator:updatepurchaseorders", this.characterCreatorData.purchaseOrders);
    }

    public setSpawn(id: number): void {
        this.characterCreatorData.spawnId = id;
    }

    public updateData(data: CharacterCreatorDataInterface): void {
        this.characterCreatorData.character = data.character;
        this.characterCreatorData.clothes = data.clothes;
        this.characterCreatorData.hasPhone = data.hasPhone;
        this.characterCreatorData.isRegistered = data.isRegistered;
        this.characterCreatorData.hasDrivingLicense = data.hasDrivingLicense;


        this.resetTypePurchaseOrders(CharacterCreatorPurchaseType.MONEY);
        this.resetTypePurchaseOrders(CharacterCreatorPurchaseType.ITEM);

        if (data.startMoney > 0) {
            this.addPurchase({
                id: UID(),
                type: CharacterCreatorPurchaseType.MONEY,
                name: `$${data.startMoney} Startgeld`,
                description: "Geld im Inventar des Charakters",
                southCentralPoints: Number.parseInt(
                        (data.startMoney * this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE).toFixed(0)),
                removeable: false,
                orderedVehicle: null
            });
        }

        if (data.hasPhone) {
            this.addPurchase({
                id: UID(),
                type: CharacterCreatorPurchaseType.ITEM,
                name: `Handy`,
                description: "Item im Inventar des Charakters",
                southCentralPoints: Number.parseInt((this.PHONE_POINTS_PRICE).toFixed(0)),
                removeable: false,
                orderedVehicle: null
            });
        }
    }
}