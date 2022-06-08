import * as alt from "alt-client";
import * as native from "natives";
import {injectable, singleton} from "tsyringe";
import {Player} from "../../extensions/player.extensions";
import {foundation} from "../../decorators/foundation";
import {onServer, onGui, on} from "../../decorators/events";
import {loadModel, UID} from "../../helpers";
import {DialogType} from "@enums/dialog.type";
import {CameraModule} from "../../modules/camera.module";
import {CharacterModule} from "../../modules/character.module";
import {EventModule} from "../../modules/event.module";
import {UpdateModule} from "../../modules/update.module";
import {LoggerModule} from "../../modules/logger.module";
import {LoadingSpinnerModule} from "../../modules/loading-spinner.module";
import {CharCreatorModule} from "../../modules/char-creator.module";
import {DialogModule} from "../../modules/dialog.module";
import {ClothingModule} from "../../modules/clothing.module";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {CharacterCreatorPurchaseType} from "@enums/character-creator-purchase.type";
import {CharacterFormInterface} from "@interfaces/character/character-form.interface";
import {GenderType} from "@enums/gender.type";
import {LocationInterface} from "@interfaces/location.interface";
import {CharacterCreatorPurchaseInterface} from "@interfaces/character/character-creator-purchase.interface";

@foundation()
@injectable()
export class CharacterCreatorHandler {
    private pedId: number;
    private everyTickRef: string;
    private isNewCharacter: boolean = false;
    private isTutorial: boolean = false;
    private setNudeMode: boolean = false;

    private camPortrait: LocationInterface = {
        pos: new alt.Vector3(403.16586, -998.3614, -98.53971),
        rot: new alt.Vector3(-14.409467, 4.2688686, 28.610905)
    }
    private camFace: LocationInterface = {
        pos: new alt.Vector3(402.86017, -997.1442, -98.344),
        rot: new alt.Vector3(1.4960656, -0, 16.131594)
    }
    private camTorso: LocationInterface = {
        pos: new alt.Vector3(402.92615, -997.37085, -98.78486),
        rot: new alt.Vector3(1.4960656, 0, 16.131594)
    }
    private camPants: LocationInterface = {
        pos: new alt.Vector3(402.92615, -997.37085, -99.574425),
        rot: new alt.Vector3(1.4960656, 0, 16.131594)
    }
    private camFeets: LocationInterface = {
        pos: new alt.Vector3(402.92615, -997.37085, -99.67937),
        rot: new alt.Vector3(-19.803135, 4.268868, 15.383445)
    }

    private characterPos: alt.Vector3 = new alt.Vector3(402.857, -996.672, -100);
    private lastIndex: number = 0;

    private MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE: number = 0;
    private PHONE_POINTS_PRICE: number = 0;

    public constructor(
        private readonly camera: CameraModule,
        private readonly character: CharacterModule,
        private readonly player: Player,
        private readonly event: EventModule,
        private readonly update: UpdateModule,
        private readonly logger: LoggerModule,
        private readonly loading: LoadingSpinnerModule,
        private readonly charCreator: CharCreatorModule,
        private readonly dialog: DialogModule,
        private readonly clothing: ClothingModule) {
    }

    @onServer("charcreator:open")
    public async onOpen(character: CharacterInterface, isTutorial: boolean, moneyToSouthCentralPointsValue: number,
                        baseCharacterCosts: number, phonePointsPrice: number): Promise<void> {
        this.isTutorial = isTutorial;

        this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE = moneyToSouthCentralPointsValue;
        this.PHONE_POINTS_PRICE = phonePointsPrice;

        if (this.isTutorial) {
            // this.dialog.create({
            //     Type: DialogTypes.ONE_BUTTON_DIALOG,
            //     Title: "Dein erster Charakter",
            //     Description: "Da du zum ersten Mal diese Charaktererstellung nutzt, werden wir dir mit ein paar Tipps zur Seite stehen! Wir freuen uns auf deine Kreativität.",
            //     HasBankAccountSelection: false,
            //     FreezeGameControls: false,
            //     PrimaryButton: "Okay",
            // });

            // TODO: Implement the tutorial tips for character creation.
        }

        native.setClockTime(12, 0, 0);

        this.createCamera();

        const mHash = native.getHashKey("mp_m_freemode_01");
        const fHash = native.getHashKey("mp_f_freemode_01");

        await loadModel(mHash);
        await loadModel(fHash);

        this.isNewCharacter = (character != null);

        this.pedId = native.createPed(2, mHash, this.characterPos.x, this.characterPos.y, this.characterPos.z, 180, false, false);

        this.charCreator.setup(character, this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE);

        this.charCreator.addPurchase({
            id: UID(),
            type: CharacterCreatorPurchaseType.CHARACTER,
            name: "Neuen Charakter",
            description: "Einen neuen Charakter erstellt",
            southCentralPoints: baseCharacterCosts,
            removeable: false,
            orderedVehicle: null
        });

        this.character.apply(character, this.pedId);

        this.event.emitGui("gui:routeto", "charcreator");

        this.loading.show("Lade Charaktererstellung...");
        alt.setTimeout(() => {
            this.player.fadeIn(500);
            this.player.unblurScreen(250);

            this.loading.hide();

        }, 1500);
    }

    @onServer("charcreator:resetcamera")
    public onResetCamera(): void {
        this.createCamera();
        this.onChangeCamPos(this.lastIndex, 0);
    }

    @onServer("charcreator:reset")
    public onReset(): void {
        native.deletePed(this.pedId);

        this.loading.hide();
    }

    @onServer("charcreator:cantfinishedcreation")
    @on("charcreator:cantfinishedcreation")
    public onCantFinishedCreation(): void {
        this.player.fadeIn(250);
        this.loading.hide();
        this.event.emitGui("charcreator:resetissaving");
    }

    @onGui("charcreator:removepurchaseorder")
    public onRemovePurchaseOrder(purchaseOrder: CharacterCreatorPurchaseInterface): void {
        if (!purchaseOrder.removeable) {
            return;
        }

        this.charCreator.removePurchase(purchaseOrder);
    }

    @onGui("charcreator:requestclose")
    public onRequestClose(): void {
        this.dialog.create({
            type: DialogType.TWO_BUTTON_DIALOG,
            title: "Charakter Erstellung verlassen",
            description: "Bist du dir sicher das du die Charakter Erstellung verlassen möchtest? Dein aktueller Charakter würde nicht gespeichert werden!",
            hasBankAccountSelection: false,
            hasInputField: false,
            dataJson: "[]",
            freezeGameControls: false,
            primaryButton: "Ja",
            secondaryButton: "Nein",
            primaryButtonClientEvent: "charcreator:close",
        });
    }

    @on("charcreator:close")
    public onClose(): void {
        native.deletePed(this.pedId);

        this.player.fadeOut(500);
        alt.setTimeout(() => {
            this.event.emitServer("charcreator:close");
            this.event.emitGui("charcreator:reset");
        }, 700);
    }

    @onGui("charcreator:getcharacter")
    public onGetCharacter(): void {
        this.event.emitGui("charcreator:setcharacter", this.character.getCachedCharacter, this.clothing.getMaxDrawableVariations(this.pedId), this.isNewCharacter);
    }

    @onGui("charcreator:setcamerapos")
    public onChangeCamPos(index: number, time: number = 850): void {
        let pos: alt.Vector3;
        let rot: alt.Vector3;
        this.lastIndex = index;

        switch (index) {
            case 0:
                pos = this.camPortrait.pos
                rot = this.camPortrait.rot;
                break;
            case 1:
                pos = this.camFace.pos
                rot = this.camFace.rot;
                break;
            case 2:
                pos = this.camTorso.pos
                rot = this.camTorso.rot;
                break;
            case 3:
                pos = this.camPants.pos
                rot = this.camPants.rot;
                break;
            case 4:
                pos = this.camFeets.pos
                rot = this.camFeets.rot;
                break;
            default:
                pos = this.camPortrait.pos
                rot = this.camPortrait.rot;
                break;
        }

        this.camera.moveCamera(pos, rot, time);

        alt.setTimeout(() => {
            this.event.emitGui("charcreator:resetcamerabuttons");
        }, time + 10);
    }

    @onGui("charcreator:rotatecharacter")
    public onRotateCharacter(dir: number): void {
        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick(dir));
    }

    @onGui("charcreator:rotatestop")
    public onRotateStop(): void {
        this.update.remove(this.everyTickRef);
    }

    @onGui("charcreator:setform")
    public onSetForm(form: CharacterFormInterface): void {
        this.charCreator.setForm(form);
        this.charCreator.resetTypePurchaseOrders(CharacterCreatorPurchaseType.MONEY);
        this.charCreator.resetTypePurchaseOrders(CharacterCreatorPurchaseType.ITEM);

        if (form.startMoney > 0) {
            this.charCreator.addPurchase({
                id: UID(),
                type: CharacterCreatorPurchaseType.MONEY,
                name: `$${form.startMoney} Startgeld`,
                description: "Geld im Inventar des Charakters",
                southCentralPoints: Number.parseInt((form.startMoney * this.MONEY_TO_SOUTH_CENTRAL_POINTS_VALUE).toFixed(0)),
                removeable: false,
                orderedVehicle: null
            });
        }

        if (form.hasPhone) {
            this.charCreator.addPurchase({
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

    @onGui("charcreator:updatechar")
    public onUpdateChar(character: CharacterInterface, genderChanged: boolean): void {
        if (genderChanged) {
            this.switchGender(character);
        }

        this.updateCharacter(character);

        this.event.emitGui("clothesmenu:setmaxtexturevariation", this.clothing.getMaxTextureVariations(this.pedId, character.clothes));

        if (this.setNudeMode) {
            this.character.setNude(this.pedId, character.gender);
        }
    }

    @onGui("charcreator:setnude")
    public onSetNude(): void {
        this.setNudeMode = true;
        this.character.setNude(this.pedId, this.charCreator.getCharacterData.character.gender);
    }

    @onGui("charcreator:loadclothes")
    public onLoadClothes(): void {
        this.setNudeMode = false;
        this.character.apply(this.charCreator.getCharacterData.character, this.pedId);
    }

    @onGui("charcreator:requestbuycharacter")
    public onRequestBuyCharacter(character: CharacterInterface): void {
        this.updateCharacter(character);

        this.dialog.create({
            type: DialogType.TWO_BUTTON_DIALOG,
            title: "Charakter kaufen",
            description: "Bist du dir sicher das du diesen Charakter so kaufen möchtest? Du kannst später einige Dinge nicht mehr anpassen! Beachte das du in allen Tabs oben was einstellen kannst, bist du dir sicher das du den Charakter so erstellen möchtest?",
            hasBankAccountSelection: false,
            hasInputField: false,
            dataJson: "[]",
            freezeGameControls: false,
            primaryButton: "Ja",
            secondaryButton: "Nein",
            primaryButtonClientEvent: "charcreator:buycharacter",
            secondaryButtonClientEvent: "charcreator:cantfinishedcreation",
            closeButtonClientEvent: "charcreator:cantfinishedcreation"
        });
    }

    @on("charcreator:buycharacter")
    public onBuyCharacter(): void {
        this.player.fadeOut(500);
        this.loading.show("Transaktion wird bearbeitet...");

        alt.setTimeout(() => {
            this.event.emitServer("charcreator:createcharacter", JSON.stringify(this.charCreator.getCharacterData));
        }, 600);
    }

    private createCamera(): void {
        this.camera.createCamera(this.camPortrait.pos, this.camPortrait.rot);
    }

    private tick(dir: number): void {
        let heading = native.getEntityHeading(this.pedId);
        const newHeading = (heading += dir);

        native.setEntityHeading(this.pedId, newHeading);
    }

    private switchGender(char: CharacterInterface): void {
        native.deletePed(this.pedId);

        if (char.gender == GenderType.MALE) {
            this.pedId = native.createPed(2, 1885233650, this.characterPos.x, this.characterPos.y, this.characterPos.z, 180, false, false);
        } else if (char.gender == GenderType.FEMALE) {
            this.pedId = native.createPed(2, -1667301416, this.characterPos.x, this.characterPos.y, this.characterPos.z, 180, false, false);
        }

        char.father = 0;
        char.mother = 21;
        char.similarity = (char.gender === GenderType.MALE) ? 0 : 1;
        char.skinSimilarity = (char.gender === GenderType.MALE) ? 0 : 1;
        char.appearances.hair = 0;

        this.event.emitGui("charcreator:setgender", char.gender, this.clothing.getMaxDrawableVariations(this.pedId));
    }

    private updateCharacter(character: CharacterInterface): void {
        // Generate cloth items based on the given cloth interface. 
        character.inventory.items = this.charCreator.getInventoryClothingItems(character);

        // Save the torso extra because its not a cloth item.
        if (character.clothes.torso) {
            character.torso = character.clothes.torso.drawableId;
            character.torsoTexture = character.clothes.torso.textureId;
        }

        this.charCreator.setCharacter(character);
        this.character.apply(character, this.pedId);
    }
}
