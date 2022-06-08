import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {LoggerModule} from "../../modules/logger.module";
import {CharacterModule} from "../../modules/character.module";
import {CameraModule} from "../../modules/camera.module";
import {EventModule} from "../../modules/event.module";
import {Player} from "../../extensions/player.extensions";
import {onServer, onGui, on} from "../../decorators/events";
import {foundation} from "../../decorators/foundation";
import {LoadingSpinnerModule} from "../../modules/loading-spinner.module";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {GenderType} from "@enums/gender.type";
import {loadModel} from "../../helpers";
import {GuiModule} from "../../modules/gui.module";
import {UpdateModule} from "../../modules/update.module";

@foundation()
@singleton()
export class CharacterSelectorHandler {
    private pedId: number;
    private characters: CharacterInterface[] = [];
    private lastSelectedCharacterId?: number;

    constructor(
        private readonly event: EventModule,
        private readonly logger: LoggerModule,
        private readonly character: CharacterModule,
        private readonly camera: CameraModule,
        private readonly player: Player,
        private readonly loading: LoadingSpinnerModule,
        private readonly gui: GuiModule,
        private readonly update: UpdateModule) {
    }

    @onServer("charselector:open")
    public async openCharSelector(characters: CharacterInterface[], lastSelectedCharacterId?: number): Promise<void> {
        this.characters = characters;

        this.player.showCursor();
        this.player.isSpawnedCharacter = false;
        this.player.hideRadarAndHud(true);
        this.player.blockGameControls(true);

        this.createCamera();
        this.lastSelectedCharacterId = lastSelectedCharacterId;

        if (this.characters.length !== 0 && this.lastSelectedCharacterId !== undefined) {
            const lastCharacter = this.characters.find(cc => cc.id === this.lastSelectedCharacterId);
            if (lastCharacter) {
                await this.loadPed(lastCharacter);
            }
        }

        this.event.emitGui("gui:routeto", "charselector");

        this.loading.show("Lade Charakterauswahl...");
        alt.setTimeout(() => {
            this.player.fadeIn(500);
            this.player.unblurScreen(500);
            this.loading.hide();
            this.gui.focusView();
        }, 700);
    }

    @onServer("charselector:close")
    public onClose(): void {
        this.resetCharacter();
    }

    @onServer("charselector:update")
    public onUpdateCharacters(characters: CharacterInterface[], lastSelectedCharacterId: number): void {
        this.characters = characters;
        this.lastSelectedCharacterId = lastSelectedCharacterId;

        if (this.characters.length !== 0 && this.lastSelectedCharacterId !== undefined) {
            const lastCharacter = this.characters.find(cc => cc.id === this.lastSelectedCharacterId);
            if (lastCharacter) {
                this.loadPed(lastCharacter);
            }
        } else {
            this.resetCharacter();
        }

        this.event.emitGui("charselector:setup", this.characters, this.lastSelectedCharacterId);
    }

    @onGui("charselector:ready")
    public onCharSelectorLoaded(): void {
        this.event.emitGui("charselector:setup", this.characters, this.lastSelectedCharacterId);
    }

    @onGui("charselector:reset")
    public resetCharacter(): void {
        if (this.pedId !== undefined) {
            native.deletePed(this.pedId);
            this.pedId = undefined;
        }
    }

    @onGui("charselector:select")
    public async selectCharacter(id: number): Promise<void> {
        await this.loadPed(this.characters.find(c => c.id === id));
    }

    @onGui("charselector:play")
    public onPlay(id: number): void {
        this.player.fadeOut(500);

        alt.setTimeout(() => {
            this.event.emitServer("charselector:play", id);
        }, 600);
    }

    @onGui("charselector:newchar")
    public onNewChar(): void {
        this.player.fadeOut(500);
        alt.setTimeout(() => {
            this.event.emitServer("charcreator:requestnewchar");
        }, 700);
    }

    private createCamera(): void {
        const pos = new alt.Vector3(402.7, -998.15, -98.18);
        const rot = new alt.Vector3(-26.96, 0, -3.85);

        this.camera.createCamera(pos, rot);
    }

    private async loadPed(character: CharacterInterface): Promise<void> {
        this.onClose();

        let modelId = 0;
        if (character.gender === GenderType.MALE) {
            modelId = 1885233650;
        }

        if (character.gender === GenderType.FEMALE) {
            modelId = 2627665880;
        }

        await loadModel(modelId);

        this.pedId = native.createPed(2, modelId, 402.7121, -996.778, -100, 180, false, false);
        this.character.apply(character, this.pedId);
    }
}