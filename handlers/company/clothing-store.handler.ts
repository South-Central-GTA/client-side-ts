import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {LoggerModule} from "../../modules/logger.module";
import {on, onGui, onServer} from "../../decorators/events";
import {Player} from "../../extensions/player.extensions";
import {GuiModule} from "../../modules/gui.module";
import {EventModule} from "../../modules/event.module";
import alt from "alt-client";
import {loadModel} from "../../helpers";
import native from "natives";
import {CameraModule} from "../../modules/camera.module";
import {CharacterModule} from "../../modules/character.module";
import {UpdateModule} from "../../modules/update.module";
import {ClothingModule} from "../../modules/clothing.module";
import {ClothesInterface} from "@interfaces/character/clothes.interface";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {GenderType} from "@enums/gender.type";

@foundation() @singleton()
export class ClothingStoreHandler {
    private everyTickRef: string;
    private pedId: number;
    private newClothes: ClothesInterface | undefined = undefined;

    constructor(private readonly logger: LoggerModule, private readonly player: Player, private readonly gui: GuiModule, private readonly event: EventModule, private readonly camera: CameraModule, private readonly character: CharacterModule, private readonly update: UpdateModule, private readonly clothing: ClothingModule) {
    }

    @onServer("clothingstore:startchangeclothes")
    private async onStartChangeClothes(character: CharacterInterface): Promise<void> {
        if (!this.player.getIsInInterior) {
            return;
        }
        
        this.newClothes = undefined;

        this.player.openMenu();
        this.player.freeze();
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.setVisible(false);
        this.player.blockGameControls(true);
        this.gui.focusView();

        await this.loadPed(character);
        this.createCamera();

        this.event.emitGui("gui:routeto", "clothingstore");
    }

    @onServer("clothingstore:reset")
    @on("disconnect")
    private onReset(): void {
        native.deletePed(this.pedId);
    }

    @onGui("clothingstore:getcharacter")
    private onGetCharacter(): void {
        this.event.emitGui("clothingstore:setcharacter", this.clothing.getMaxDrawableVariations(this.pedId),
                this.character.getCachedCharacter.gender);
    }

    @onGui("clothingstore:updatechar")
    private onUpdateCharacter(clothes: ClothesInterface): void {
        this.newClothes = clothes;

        this.event.emitGui("clothesmenu:setmaxtexturevariation",
                this.clothing.getMaxTextureVariations(this.pedId, clothes));

        this.character.updateClothes(clothes, this.pedId, this.character.getCachedCharacter.gender);
    }

    @onGui("clothingstore:rotatecharacter")
    private onRotateCharacter(dir: number): void {
        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick(dir));
    }

    @onGui("clothingstore:rotatestop")
    private onRotateStop(): void {
        this.update.remove(this.everyTickRef);
    }

    @onGui("clothingstore:close")
    private onClose(): void {
        this.event.emitServer("clothingstore:cancel");
        this.close();
    }

    @onGui("clothingstore:requestbuy")
    private onRequestBuy(): void {
        if (this.newClothes === undefined) {
            return;
        }
        
        this.event.emitServer("clothingstore:requestitems", JSON.stringify(this.newClothes));
        this.close();
    }

    private close(): void {
        this.onReset();
        this.player.closeMenu();
        this.player.unfreeze();
        this.player.hideCursor();
        this.player.lockCamera(false);
        this.player.setVisible(true);
        this.player.blockGameControls(false);
        this.gui.unfocusView();
        native.deletePed(this.pedId);

        this.camera.destroyCamera();

        this.event.emitGui("gui:routeto", "game");
    }

    private createCamera(): void {
        const pos = new alt.Vector3(71.12921, -1388.6207, 29.395094);
        const rot = new alt.Vector3(-2.91335, 0, 0);

        this.camera.createCamera(pos, rot);
    }

    private async loadPed(character: CharacterInterface): Promise<void> {
        let modelId = 0;
        if (character.gender === GenderType.MALE) {
            await loadModel(1885233650);
            modelId = 1885233650;
        }

        if (character.gender === GenderType.FEMALE) {
            await loadModel(2627665880);
            modelId = 2627665880;
        }

        this.pedId = native.createPed(2, modelId, 71.1033, -1387.0286, 28.364136, 178.58267, false, false);
        this.character.apply(character, this.pedId);
    }

    private tick(dir: number): void {
        let heading = native.getEntityHeading(this.pedId);
        const newHeading = (heading += dir);

        native.setEntityHeading(this.pedId, newHeading);
    }
}