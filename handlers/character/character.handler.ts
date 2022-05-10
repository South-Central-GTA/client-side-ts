import * as alt from "alt-client";
import * as native from "natives";
import { singleton } from "tsyringe";
import { CharacterModule } from "../../modules/character.module";
import {on, onGui, onServer} from "../../decorators/events";
import { foundation } from "../../decorators/foundation";
import { Player } from "../../extensions/player.extensions";
import { CameraModule } from "../../modules/camera.module";
import { EventModule } from "../../modules/event.module";
import { GuiModule } from "../../modules/gui.module";
import { WeatherModule } from "../../modules/weather.module";
import { HouseModule } from "../../modules/house.module";
import { LoggerModule } from "../../modules/logger.module";
import {PhoneModule} from "../../modules/phone.module";
import {LoadingSpinnerModule} from "../../modules/loading-spinner.module";
import {CharacterInterface} from "../../interfaces/character/character.interface";
import {InventoryInterface} from "../../interfaces/inventory/inventory.interface";
import {KeyCodes} from "../../enums/keycode.type";

@foundation()
@singleton()
export class CharacterHandler {
    private isMenuOpen: boolean = false;

    constructor(
        private readonly character: CharacterModule,
        private readonly player: Player,
        private readonly camera: CameraModule,
        private readonly event: EventModule,
        private readonly gui: GuiModule,
        private readonly weather: WeatherModule,
        private readonly house: HouseModule,
        private readonly loading: LoadingSpinnerModule,
        private readonly logger: LoggerModule,
        private readonly phone: PhoneModule) { }
    
    @on("keydown")
    public onKeydown(key: number): void {
        if (this.player.isInAPrison || !this.player.isSpawnedCharacter) {
            return;
        }

        if (key === KeyCodes.F9) {
            if (this.isMenuOpen || this.player.getIsAnyMenuOpen) {
                this.setMenuState(false);
            } else {
                if (this.player.isSpawnedCharacter) {
                    this.event.emitServer("character:requestmenu");
                }
            }
        }
    }

    @onServer("character:showmenu")
    private onShowMenu(): void {
        this.setMenuState(true);
    }
    
    @onServer("character:apply")
    public updateModel(character: CharacterInterface): void {
        this.character.apply(character, alt.Player.local.scriptID);
    }

    @onServer("character:spawn")
    public spawn(character: CharacterInterface): void {
        const localPlayer = alt.Player.local;

        this.character.apply(character, localPlayer.scriptID);
        this.player.characterId = character.id;
        
        if (this.player.getIsPhoneOpen) {
            this.phone.close();
        }

        this.player.hideCursor();
        this.player.unfreeze();
        this.player.lockCamera(false, true);
        this.player.setVisible(true);
        this.player.showHud();
        this.player.isSpawnedCharacter = true;
        
        this.gui.unfocusView();
        this.camera.destroyCamera();
        this.loading.hide();

        this.weather.startSync();
        this.house.updateBlips();

        this.event.emitGui("gui:routeto", "game");

        alt.setTimeout(() => {
            this.player.fadeIn(500);
            this.player.updatePositionInHUD(true);
            this.player.updateHealthInHUD(true);
        }, 600);

        native.setPedConfigFlag(localPlayer, 35, false); // Disable Auto Helmet when your on a motorcycle 
        native.setPedConfigFlag(localPlayer, 241, true); // Disable Stopping Engine
        native.setPedConfigFlag(localPlayer, 429, true); // Disable Starting Engine
        native.setPedConfigFlag(localPlayer, 184, true); // Disable Seat Shuffling

        //Disable headshot
        native.setPedSuffersCriticalHits(localPlayer, false);

        native.setAudioFlag("DisableFlightMusic", true);

        alt.setStat(alt.StatName.Stamina, 100);
        alt.setStat(alt.StatName.LungCapacity, 100);
        alt.setStat(alt.StatName.Shooting, 100);
        alt.setStat(alt.StatName.Flying, 100);
    }

    @onServer("character:sync")
    public onSync(character: CharacterInterface): void {
        this.event.emitGui("character:sync", character.id);
        this.character.apply(character, alt.Player.local.scriptID);
    }
    
    @onServer("character:updatetorso")
    public onUpdateTorso(torso: number): void {
        this.character.updateTorso(alt.Player.local.scriptID, torso, 0);
    }

    @onServer("character:updateclothes")
    public onUpdateClothes(inventory: InventoryInterface): void {
        this.character.createClothesBasedOnInventory(inventory, alt.Player.local.scriptID, this.character.getCachedCharacter.gender);
    }
    
    @onGui("charactermenu:requestclose")
    public onRequestClose(): void {
        this.setMenuState(false);
    }

    private setMenuState(state: boolean): void {
        if (!this.player.isSpawnedCharacter) {
            return;
        }

        if (this.player.getIsAnyMenuOpen && !this.isMenuOpen || this.player.getIsInventoryOpen) {
            return;
        }

        this.isMenuOpen = state;
        if (state) {
            this.player.openMenu();
        } else {
            this.player.closeMenu();
        }
        this.player.blockGameControls(this.isMenuOpen);

        if (this.isMenuOpen) {
            this.player.showCursor();
            this.gui.focusView();
        } else {
            this.player.hideCursor();
            this.gui.unfocusView();
        }

        this.event.emitGui("charactermenu:toggle", this.isMenuOpen);
    }
}