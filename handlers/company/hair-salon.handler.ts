import alt from "alt-client";
import native from "natives";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {LoggerModule} from "../../modules/logger.module";
import {on, onGui, onServer} from "../../decorators/events";
import {Player} from "../../extensions/player.extensions";
import {GuiModule} from "../../modules/gui.module";
import {EventModule} from "../../modules/event.module";
import {CameraModule} from "../../modules/camera.module";
import {loadModel} from "../../helpers";
import {CharacterModule} from "../../modules/character.module";
import {UpdateModule} from "../../modules/update.module";
import {AppearancesInterface} from "@interfaces/character/appearances.interface";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {GenderType} from "@enums/gender.type";

@foundation() @singleton()
export class HairSalonHandler {
    private everyTickRef: string;
    private pedId: number;
    private newAppearances: AppearancesInterface;

    constructor(private readonly logger: LoggerModule, private readonly player: Player, private readonly gui: GuiModule, private readonly event: EventModule, private readonly camera: CameraModule, private readonly character: CharacterModule, private readonly update: UpdateModule) {
    }

    @onServer("hairsalon:open")
    private async onOpen(character: CharacterInterface): Promise<void> {
        this.player.openMenu();
        this.player.freeze();
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.hideRadarAndHud();
        this.player.setVisible(false);
        this.player.blockGameControls(true);
        this.gui.focusView();

        await this.loadPed(character);
        this.createCamera();

        this.event.emitGui("gui:routeto", "hairsalon");
    }

    @onServer("hairsalon:reset")
    @on("disconnect")
    private onReset(): void {
        native.deletePed(this.pedId);
    }

    @onGui("hairsalon:getcharacter")
    private onGetCharacter(): void {
        this.event.emitGui("hairsalon:setcharacter", this.character.getCachedCharacter);
    }

    @onGui("hairsalon:updatechar")
    private onUpdateCharacter(appearances: AppearancesInterface): void {
        this.newAppearances = appearances;
        this.character.updateAppearance(appearances, this.character.getCachedCharacter.gender, this.pedId);
    }

    @onGui("hairsalon:rotatecharacter")
    private onRotateCharacter(dir: number): void {
        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick(dir));
    }

    @onGui("hairsalon:rotatestop")
    private onRotateStop(): void {
        this.update.remove(this.everyTickRef);
    }

    @onGui("hairsalon:close")
    private onClose(): void {
        this.event.emitServer("hairsalon:cancel");
        this.close();
    }

    @onGui("hairsalon:buy")
    private onBuy(): void {
        this.event.emitServer("hairsalon:requestbuydialog", JSON.stringify(this.newAppearances));
        this.close();
    }

    private close(): void {
        this.onReset();
        this.player.closeMenu();
        this.player.unfreeze();
        this.player.hideCursor();
        this.player.lockCamera(false);
        this.player.showRadarAndHud();
        this.player.setVisible(true);
        this.player.blockGameControls(false);
        this.gui.unfocusView();
        native.deletePed(this.pedId);

        this.camera.destroyCamera();

        this.event.emitGui("gui:routeto", "game");
    }

    private createCamera(): void {
        const pos = new alt.Vector3(139.14793, -1708.0115, 29.952124);
        const rot = new alt.Vector3(-1, 0, -128.81789);

        this.camera.createCamera(pos, rot, 55);
    }

    private async loadPed(character: CharacterInterface): Promise<void> {
        let modelId = 0;
        if (character.gender === GenderType.MALE) {
            modelId = 1885233650;
        }

        if (character.gender === GenderType.FEMALE) {
            modelId = 2627665880;
        }

        await loadModel(modelId);

        this.pedId = native.createPed(2, modelId, 139.76703, -1708.5758, 28.313599, 35, false, false);
        this.character.apply(character, this.pedId);
    }

    private tick(dir: number): void {
        let heading = native.getEntityHeading(this.pedId);
        const newHeading = (heading += dir);

        native.setEntityHeading(this.pedId, newHeading);
    }
}