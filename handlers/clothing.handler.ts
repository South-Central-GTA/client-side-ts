import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {EventModule} from "../modules/event.module";
import {ClothingModule} from "../modules/clothing.module";
import {onGui, onServer} from "../decorators/events";
import {CharacterModule} from "../modules/character.module";
import {GuiModule} from "../modules/gui.module";
import {Player} from "@extensions/player.extensions";
import native from "natives";

@foundation() @singleton()
export class ClothingHandler {
    private oldDrawableId: number = 0;
    private oldTextureId: number = 0;

    constructor(private readonly event: EventModule, private readonly clothing: ClothingModule, private readonly character: CharacterModule, private readonly player: Player, private readonly gui: GuiModule) {
    }

    @onServer("settorsomenu:show")
    private onSetTorsoMenuShow(): void {
        this.player.blockGameControls(true);
        this.player.showCursor();
        this.gui.focusView();

        this.oldDrawableId = this.character.getCachedCharacter.torso;
        this.oldTextureId = this.character.getCachedCharacter.torsoTexture;

        this.event.emitGui("settorsomenu:show", native.getNumberOfPedDrawableVariations(alt.Player.local.scriptID, 3),
                this.character.getCachedCharacter.gender);
    }

    @onGui("settorsomenu:updatetorso")
    private onUpdateTorso(drawableId: number, textureId: number): void {
        this.character.updateTorso(alt.Player.local.scriptID, drawableId, textureId);

        this.event.emitGui("settorsomenu:setmaxtextures",
                native.getNumberOfPedTextureVariations(alt.Player.local.scriptID, 3, drawableId) - 1);
    }

    @onGui("settorsomenu:savetorso")
    private onSaveTorso(drawableId: number, textureId: number): void {
        this.player.blockGameControls(false);
        this.player.hideCursor();
        this.gui.unfocusView();

        this.character.updateTorso(alt.Player.local.scriptID, drawableId, textureId);

        this.event.emitServer("settorsomenu:savetorso", drawableId, textureId);
    }

    @onGui("settorsomenu:close")
    private onClose(): void {
        this.player.blockGameControls(false);
        this.player.hideCursor();
        this.gui.unfocusView();

        this.character.updateTorso(alt.Player.local.scriptID, this.oldDrawableId, this.oldTextureId);
    }
}