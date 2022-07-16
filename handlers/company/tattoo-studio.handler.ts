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
import {TattoosInterface} from "@interfaces/character/tattoos.interface";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {GenderType} from "@enums/gender.type";

@foundation() @singleton()
export class TattooStudioHandler {
    private everyTickRef: string;
    private pedId: number;
    private newTattoos: TattoosInterface;

    constructor(private readonly logger: LoggerModule, private readonly player: Player, private readonly gui: GuiModule, private readonly event: EventModule, private readonly camera: CameraModule, private readonly character: CharacterModule, private readonly update: UpdateModule) {
    }

    @onServer("tattoostudio:open")
    private async onOpen(character: CharacterInterface): Promise<void> {
        this.player.openMenu();
        this.player.freeze();
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.setVisible(false);
        this.player.hideRadarAndHud();
        this.player.blockGameControls(true);
        this.gui.focusView();

        await this.loadPed(character);
        this.createCamera();

        this.event.emitGui("gui:routeto", "tattoostudio");
    }

    @onServer("tattoostudio:reset")
    @on("disconnect")
    private onReset(): void {
        native.deletePed(this.pedId);
    }

    @onGui("tattoostudio:getcharacter")
    private onGetCharacter(): void {
        this.event.emitGui("tattoostudio:setcharacter", this.character.getCachedCharacter);
    }

    @onGui("tattoostudio:updatechar")
    private onUpdateCharacter(tattoos: TattoosInterface): void {
        this.newTattoos = tattoos;

        this.character.updateAppearance(this.character.getCachedCharacter.appearances,
                this.character.getCachedCharacter.gender, this.pedId);
        this.character.updateTattoos(tattoos, this.pedId);
    }

    @onGui("tattoostudio:rotatecharacter")
    private onRotateCharacter(dir: number): void {
        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick(dir));
    }

    @onGui("tattoostudio:rotatestop")
    private onRotateStop(): void {
        this.update.remove(this.everyTickRef);
    }

    @onGui("tattoostudio:close")
    private onClose(): void {
        this.event.emitServer("tattoostudio:cancel");
        this.close();
    }

    @onGui("tattoostudio:buy")
    private onBuy(): void {
        this.event.emitServer("tattoostudio:requestbuydialog", JSON.stringify(this.newTattoos));
        this.close();
    }

    private close(): void {
        this.onReset();
        this.player.closeMenu();
        this.player.unfreeze();
        this.player.hideCursor();
        this.player.lockCamera(false);
        this.player.setVisible(true);
        this.player.showRadarAndHud();
        this.player.blockGameControls(false);
        this.gui.unfocusView();
        native.deletePed(this.pedId);

        this.camera.destroyCamera();

        this.event.emitGui("gui:routeto", "game");
    }

    private createCamera(): void {
        const pos = new alt.Vector3(1321.6317, -1652.8184, 52.647587);
        const rot = new alt.Vector3(-15.74, 0, -158.44);

        this.camera.createCamera(pos, rot, 60);
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

        this.pedId = native.createPed(2, modelId, 1321.7935, -1654.6022, 51.26306, 0, false, false);
        this.character.apply(character, this.pedId);
    }

    private tick(dir: number): void {
        let heading = native.getEntityHeading(this.pedId);
        const newHeading = (heading += dir);

        native.setEntityHeading(this.pedId, newHeading);
    }
}