import * as alt from "alt-client";
import * as native from "natives";
import { container, singleton } from "tsyringe";
import {PrototypeFor} from "../decorators/prototype-for";
import {UpdateModule} from "../modules/update.module";
import {EventModule} from "../modules/event.module";
import {LoggerModule} from "../modules/logger.module";
import {CameraModule} from "../modules/camera.module";
import {InputType} from "../enums/input.type";

@PrototypeFor(alt.Player)
@singleton()
export class Player extends alt.Player {
    private directions = [0, 45, 90, 135, 180, 225, 270, 315, 360];
    private directionNames = ["N", "NW", "W", "SW", "S", "SO", "O", "NO", "N"];
    private directionNamesLong = ["Nördlich", "Nord-westlich", "Westlich", "Süd-westlich", "Südlich", "Süd-westlich", "Östlich", "Nord-östlich", "Nördlich"];
    private oldStreet: string = null;
    private oldDirection: string = null;

    private oldHealth: number = null;
    private oldArmour: number = null;
    
    private isInInterior: boolean = false;
    
    set setIsInInterior(isInInterior: boolean) {
        this.isInInterior = isInInterior;
    }

    get getIsInInterior() {
        return this.isInInterior;
    }
   
    set setIsChatting(state: boolean) {
        this.isChatting = state;
    };

    get getIsChatting() {
        return this.isChatting;
    };

    set setIsInventoryOpen(state: boolean) {
        this.isInventoryOpen = state;
        this.event.emitServer("player:setinventorystate", this.isInventoryOpen);
    }

    get getIsInventoryOpen() {
        return this.isInventoryOpen;
    }

    set setIsPhoneOpen(state: boolean) {
        this.isPhoneOpen = state;
        this.event.emitServer("player:setphonestate", this.isPhoneOpen);
    }

    get getIsPhoneOpen() {
        return this.isPhoneOpen;
    }
  
    set setIsAnyTextFieldFocused(state: boolean) {
        this.isAnyTextFieldFocused = state;
        this.blockGameControls(state);
    }

    get getIsAnyTextFieldFocused() {
        return this.isAnyTextFieldFocused || this.isChatting;
    }

    get getIsAnyTextOpen() {
        return this.isAnyTextFieldFocused || this.isChatting || this.openMenuCount;
    }

    get getIsCursorVisible() {
        return this.isCursorVisible
    }
    
    get getIsAnyMenuOpen() {
        return this.openMenuCount > 0 || this.getIsInventoryOpen
    }

    public characterId: number;

    public isFreezed: boolean;
    public adminFreezed: boolean;
    public isCrouched: boolean;
    public isSpawnedCharacter: boolean;
    public isAduty: boolean;
    public isDuty: boolean;
    public isInAPrison: boolean;
    public isInHouse: boolean;
    public isControlsEnabled: boolean = true;
    public hasInteractionOpen: boolean;

    public isInvBlocked: boolean;

    private isCursorVisible: boolean;
    private isChatting: boolean;
    private isInventoryOpen: boolean;
    private isPhoneOpen: boolean;
    private isAnyTextFieldFocused: boolean;
    private openMenuCount: number = 0;

    private cameraLocked: boolean = true;
    private escBlocked: boolean = false;

    public constructor(
        private readonly update: UpdateModule,
        private readonly event: EventModule,
        private readonly logger: LoggerModule) {
        super();

        this.update.add(() => this.tick());
    }

    public openMenu(): void {
        this.openMenuCount ++;
    }
    
    public closeMenu(): void {
        this.openMenuCount --;
        if (this.openMenuCount < 0) {
            this.openMenuCount = 0;
        }
    }
    
    public setVisible(state: boolean): void {
        native.setEntityVisible(alt.Player.local.scriptID, state, false);
    }

    public showCursor(): void {
        if (this.isCursorVisible)
            return;

        alt.showCursor(true);
        const [, x, y] = native.getActiveScreenResolution(0, 0);
        const pos = new alt.Vector3(x * 0.5, y * 0.5, 0);
        alt.setCursorPos(pos);

        this.isCursorVisible = true;
    }

    public hideCursor(force: boolean = false): void {
        if (!force) {
            if (!this.isCursorVisible || this.getIsInventoryOpen || this.getIsPhoneOpen || this.getIsAnyMenuOpen) {
                return;
            }
        }

        alt.showCursor(false);
        this.isCursorVisible = false;
    }

    public blurScreen(time = 0): void {
        native.triggerScreenblurFadeIn(time);
        
        const int = alt.setInterval(() => {
            if (!native.isScreenblurFadeRunning()) {
                native.triggerScreenblurFadeIn(time);
                alt.clearInterval(int);
            }
        }, 1);
    }

    public unblurScreen(time = 0): void {
        native.triggerScreenblurFadeOut(time);

        const int = alt.setInterval(() => {
            if (!native.isScreenblurFadeRunning()) {
                native.triggerScreenblurFadeOut(time);
                alt.clearInterval(int);
            }
        }, 1);
    }

    public fadeOut(time = 0): void {
        native.doScreenFadeOut(time);
        alt.setTimeout(() => {
            this.event.emitGui("screen:disable");
        }, time);
    }

    public fadeIn(time = 0): void {
        native.doScreenFadeIn(time);
        alt.setTimeout(() => {
            this.event.emitGui("screen:enable");
        }, time * 0.9);
    }

    public showRadarAndHud(force: boolean = false): void {
        if (alt.Player.local.vehicle !== null || this.isAduty || force) {
            this.event.emitGui("hud:moveup");
            native.displayRadar(true);
        }
        
        native.displayHud(true);

    }

    public hideRadarAndHud(force: boolean = false): void {
        if (this.isAduty && !force 
            || alt.Player.local.vehicle !== null && !force) {
            return;
        }

        native.displayRadar(false);
        native.displayHud(false);
    }

    public showHud(): void {
        native.displayHud(true);

        this.event.emitGui("hud:toggleui", true);
    }

    public hideHud(): void {
        native.displayHud(false);
    }

    public showRadar(): void {
        this.event.emitGui("hud:moveup");
        native.displayRadar(true);
    }

    public hideRadar(): void {
        if (this.isAduty || alt.Player.local.vehicle !== null) {
            return;
        }
        
        native.displayRadar(false);
        this.event.emitGui("hud:movedown");
    }

    public blockGameControls(state: boolean): void {
        if (!state && this.getIsAnyTextOpen) {
            return;
        }

        this.isControlsEnabled = !state;
        alt.toggleGameControls(!state);
    }

    public lockCamera(state: boolean, force: boolean = false): void {
        if (!force) {
            if (!state && (this.getIsInventoryOpen || this.getIsPhoneOpen)) {
                return;
            }
        }

        this.cameraLocked = state;
    }

    public blockESC(state: boolean): void {
        if (!state && (this.getIsInventoryOpen || this.getIsPhoneOpen)) {
            return;
        }
        
        this.escBlocked = state;
    }

    public freeze(administrative: boolean = false): void {
        this.isFreezed = true;
        
        if (!administrative && this.adminFreezed) {
            return;
        }

        if (administrative) {
            this.adminFreezed = true;
        }
        
        alt.toggleGameControls(false);

        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        if (alt.Player.local.vehicle) {
            native.freezeEntityPosition(alt.Player.local.vehicle.scriptID, true);
        }
    }

    public unfreeze(administrative: boolean = false): void {
        this.isFreezed = false;

        if (!administrative && this.adminFreezed) {
            return;
        }

        if (administrative) {
            this.adminFreezed = false;
        }
        
        alt.toggleGameControls(true);

        native.freezeEntityPosition(alt.Player.local.scriptID, false);

        if (alt.Player.local.vehicle) {
            native.freezeEntityPosition(alt.Player.local.vehicle.scriptID, false);
        }
    }

    public switchOut(): void {
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        native.switchOutPlayer(alt.Player.local.scriptID, 0, 1);
    }

    public switchIn(): void {
        native.switchInPlayer(alt.Player.local.scriptID);
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
    }

    public getBoneIndex(boneID: number): number {
        return native.getPedBoneIndex(alt.Player.local.scriptID, boneID);
    }

    public loadPlayerHead(): Promise<string> {
        return new Promise(resolve => {
                const interval = alt.setInterval(() => {
                if (native.isPedheadshotReady(this.scriptID) && native.isPedheadshotValid(this.scriptID)) {
                    alt.clearInterval(interval);
                    return resolve(native.getPedheadshotTxdString(this.scriptID));
                }
            }, 0);
        });
    }

    public showLoginCam(): void {
        const camera = container.resolve(CameraModule);
        camera.createCamera(new alt.Vector3(-102, -1315, 60), new alt.Vector3(0, 0, 208));

        native.setEntityCoords(alt.Player.local.scriptID, -124.1021, -1298.052, 29.37553, false, false, false, false);
    }

    public updatePositionInHUD(force: boolean = false): void {
        const getStreet = native.getStreetNameAtCoord(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 0, 0);
        const streetName = native.getStreetNameFromHashKey(getStreet[1]);
        const crossingStreetName = native.getStreetNameFromHashKey(getStreet[2]);
        const zone = native.getLabelText(native.getNameOfZone(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z));
        let direction = null;

        for (let index = 0; index < this.directions.length; index++) {
            const element = this.directions[index];
            const heading = native.getEntityHeading(alt.Player.local.scriptID);

            if (Math.abs(heading - element) < 22.5) {
                direction = this.directionNamesLong[index];
            }
        }

        if (force || this.oldStreet !== streetName || this.oldDirection !== direction) {
            this.oldDirection = direction;
            this.oldStreet = streetName;
            this.event.emitGui("hud:sendposition", zone, direction, streetName, crossingStreetName);
        }
    }

    public updateHealthInHUD(force: boolean = false): void {
        if (force
            || this.oldHealth != alt.Player.local.health
            || this.oldArmour != alt.Player.local.armour) {

            this.oldHealth = alt.Player.local.health;
            this.oldArmour = alt.Player.local.armour;

            this.event.emitGui("hud:updatehealth", this.oldHealth, this.oldArmour);
        }
    }

    public clearTasksImmediately(): void {
        native.clearPedTasksImmediately(alt.Player.local.scriptID);
    }

    private tick(): void {
        if (this.cameraLocked) {
            native.disableControlAction(0, InputType.LOOK_LR, true);
            native.disableControlAction(0, InputType.LOOK_UD, true);
        }

        if (this.isCursorVisible) {
            native.disableControlAction(0, InputType.LOOK_LR, true);
            native.disableControlAction(0, InputType.LOOK_UD, true);
            native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_X, true);
            native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_Y, true);
            native.disableControlAction(0, InputType.WEAPON_WHEEL_NEXT, true);
            native.disableControlAction(0, InputType.WEAPON_WHEEL_PREV, true);
            native.disableControlAction(0, InputType.SELECT_NEXT_WEAPON, true);
            native.disableControlAction(0, InputType.SELECT_PREV_WEAPON, true);
            native.disableControlAction(0, InputType.SELECT_WEAPON, true);
            native.disableControlAction(0, InputType.NEXT_WEAPON, true);
            native.disableControlAction(0, InputType.PREV_WEAPON, true);
            native.disableControlAction(0, InputType.AIM, true);
            native.disableControlAction(0, InputType.ATTACK, true);
            native.disableControlAction(0, InputType.ATTACK2, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_HEAVY, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_ALTERNATE, true);
            native.disableControlAction(0, InputType.RADIO_WHEEL_LR, true);
            native.disableControlAction(0, InputType.RADIO_WHEEL_UD, true);
            native.disableControlAction(0, InputType.VEH_NEXT_RADIO_TRACK, true);
            native.disableControlAction(0, InputType.VEH_PREV_RADIO_TRACK, true);
            native.disableControlAction(0, InputType.VEH_RADIO_WHEEL, true);
            native.disableControlAction(0, InputType.ENTER, true);
            native.disableControlAction(0, InputType.VEH_EXIT, true);
        }
        
        native.setPedCanSwitchWeapon(alt.Player.local.scriptID, !this.isCursorVisible);

        if (this.escBlocked) {
            native.disableControlAction(0, InputType.FRONTEND_PAUSE, true);
            native.disableControlAction(0, InputType.FRONTEND_PAUSE_ALTERNATE, true);
        }
    }
}
