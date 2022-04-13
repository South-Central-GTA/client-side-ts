import * as alt from "alt-client";
import * as native from "natives";
import {EventModule} from "../modules/event.module";
import {Player} from "../extensions/player.extensions";
import {KeyCodes} from "../enums/keycode.type";
import {AnimationModule} from "../modules/animation.module";
import {UpdateModule} from "../modules/update.module";
import {InputType} from "../enums/input.type";
import {CameraModule} from "../modules/camera.module";
import {on, onGui, onServer} from "../decorators/events";
import {foundation} from "../decorators/foundation";
import {MathModule} from "../modules/math.module";
import {ChatModule} from "../modules/chat.module";
import {BlipModule} from "../modules/blip.module";
import {PericoIslandModule} from "../modules/perico-island.module";
import {singleton} from "tsyringe";
import {HouseModule} from "../modules/house.module";
import {Vector3} from "../extensions/vector3.extensions";
import {LoggerModule} from "../modules/logger.module";
import {AnimationFlag} from "../enums/animation.flag";

@foundation()
@singleton()
export class PlayerHandler {
    private cuffTick: string;
    private lastSeatShuffle = Date.now();
    private adutyPlayerBlips: number[] = [];
    private dutyInterval: number;

    public constructor(
        private readonly event: EventModule,
        private readonly player: Player,
        private readonly animation: AnimationModule,
        private readonly update: UpdateModule,
        private readonly math: MathModule,
        private readonly camera: CameraModule,
        private readonly chat: ChatModule,
        private readonly blip: BlipModule,
        private readonly pericoIsland: PericoIslandModule, 
        private readonly house: HouseModule,
        private readonly logger: LoggerModule) {
        this.update.add(() => this.tick());

        alt.setInterval(() => {
            native.invalidateIdleCam(); 
            native.invalidateVehicleIdleCam(); 
        }, 20000);

        alt.setInterval(() => {
            this.pericoIsland.loadIsland();
        }, 1000);
    }


    @on("keydown")
    public onKeydown(key: number): void {
        if (key === KeyCodes.G) {
            if (this.player.getIsAnyTextOpen) {
                return;
            }

            if (alt.Player.local.vehicle) {
                if (Date.now() < this.lastSeatShuffle)
                    return;

                if (native.canShuffleSeat(alt.Player.local.vehicle.scriptID, 0)) {
                    native.taskShuffleToNextVehicleSeat(alt.Player.local.vehicle.scriptID, alt.Player.local.vehicle.scriptID, 0);
                    this.lastSeatShuffle = Date.now() + 5;
                }
            } else {
                const vehicles: alt.Vehicle[] = alt.Vehicle.all;
                const playerPos = alt.Player.local.pos;
                let closestVehicle: alt.Vehicle;

                let lastDistance: number = 5;

                vehicles.forEach(vehicle => {
                    const vehiclePosition = vehicle.pos;
                    const distance = this.math.distance(playerPos, vehiclePosition);

                    if (distance < lastDistance) {
                        closestVehicle = vehicle;
                        lastDistance = distance;
                    }
                });

                if (closestVehicle === undefined)
                    return;

                const vehicle = closestVehicle.scriptID;
                const seats: number = native.getVehicleModelNumberOfSeats(closestVehicle.model);

                for (let i = 0; i < seats; i++) {
                    if (native.isVehicleSeatFree(vehicle, i, false)) {
                        break;
                    }

                    return;
                }

                const boneFRDoor = native.getEntityBoneIndexByName(vehicle, 'door_pside_f');//Front right
                const posFRDoor = native.getWorldPositionOfEntityBone(vehicle, boneFRDoor);
                const distFRDoor = this.math.distance(new alt.Vector3(posFRDoor.x, posFRDoor.y, posFRDoor.z), alt.Player.local.pos);

                const boneBLDoor = native.getEntityBoneIndexByName(vehicle, 'door_dside_r');//Back Left
                const posBLDoor = native.getWorldPositionOfEntityBone(vehicle, boneBLDoor);
                const distBLDoor = this.math.distance(new alt.Vector3(posBLDoor.x, posBLDoor.y, posBLDoor.z), alt.Player.local.pos);

                const boneBRDoor = native.getEntityBoneIndexByName(vehicle, 'door_pside_r');//Back Right
                const posBRDoor = native.getWorldPositionOfEntityBone(vehicle, boneBRDoor);
                const distBRDoor = this.math.distance(new alt.Vector3(posBRDoor.x, posBRDoor.y, posBRDoor.z), alt.Player.local.pos);

                let minDist = Math.min(distFRDoor, distBLDoor, distBRDoor);

                if (minDist == distFRDoor) {
                    if (minDist > 1.8)
                        return;

                    if (native.isVehicleSeatFree(vehicle, 0, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 0, 2, 1, 0);
                    } else if (native.isVehicleSeatFree(vehicle, 2, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 2, 2, 1, 0);
                    }
                }
                if (minDist == distBLDoor) {
                    if (minDist > 1.8)
                        return;

                    if (native.isVehicleSeatFree(vehicle, 1, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 1, 2, 1, 0);
                    }
                }
                if (minDist == distBRDoor) {
                    if (minDist > 1.8)
                        return;

                    if (native.isVehicleSeatFree(vehicle, 2, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 2, 2, 1, 0);
                    } else if (native.isVehicleSeatFree(vehicle, 0, false)) {
                        native.taskEnterVehicle(alt.Player.local.scriptID, vehicle, 5000, 0, 2, 1, 0);
                    }
                }
            }
        } 
    }

    @on("gameEntityCreate")
    public onGameEntityCreate(entity: alt.Entity): void {
        if (entity instanceof alt.Player) {
            if (this.player.isAduty) {
                this.updateBlips();
            }
        }
    }

    @on("gameEntityDestroy")
    public onGameEntityDestroy(entity: alt.Entity): void {
        if (entity instanceof alt.Player) {
            if (this.player.isAduty) {
                this.updateBlips();
            }
        }
    }

    @onServer("player:setaduty")
    public onSetAduty(state: boolean): void {
        this.player.isAduty = state;
        native.setPedCanRagdoll(alt.Player.local.scriptID, !state);

        if (state) {
            this.showDebugBlips();
            this.player.showRadar();
        } else {
            this.destroyDebugBlips();
            this.player.hideRadar();
        }
    }

    @onServer("player:setduty")
    public onSetDuty(state: boolean, houseId: number): void {
        this.player.isDuty = state;

        if (state) {
            const house = this.house.getHouses.find(h => h.id === houseId);
            this.dutyInterval = alt.setInterval(() => {
                if (this.math.distance(alt.Player.local.pos, new Vector3(house.positionX, house.positionY, house.positionZ)) > 30) {
                    // To far away from lease company house.
                    this.event.emitServer("player:clearduty", house.id);
                    this.player.isDuty = false;
                    alt.clearInterval(this.dutyInterval);
                }
            }, 1000);
        } else {
            alt.clearInterval(this.dutyInterval);
        }
    }
    
    @onServer("player:setinhouse")
    public onSetInHouse(state: boolean): void {
        this.player.isInHouse = state;
    }

    @onServer("player:fadescreenin")
    public onFadeScreenIn(fadeTime: number): void {
        this.player.fadeIn(fadeTime);
    }

    @onServer("player:fadescreenout")
    public onFadeScreenOut(fadeTime: number): void {
        this.player.fadeOut(fadeTime);
    }

    @onServer("player:cleartaskimmediately")
    public onClearTasksImmediately(): void {
        this.player.clearTasksImmediately();
    }

    @onGui("player:blockcontrols")
    @onServer("player:blockcontrols")
    public onToggleControls(state: boolean): void {
        this.player.blockGameControls(state);
    }

    @onServer("player:adminfreeze")
    public onFreeze(state: boolean): void {
        if (state) {
            this.player.freeze(true);
        } else {
            this.player.unfreeze(true);
        }
    }

    @onGui("player:togglecamera")
    @onServer("player:togglecamera")
    public onToggleCamera(state: boolean): void {
        this.player.lockCamera(state);
    }

    @onServer("player:switchout")
    public switchOut(): void {
        this.player.freeze();
        this.player.switchOut();
    }

    @onServer("player:switchin")
    public switchIn(): void {
        this.player.switchIn();
        this.player.unfreeze();
    }

    @onServer("player:cuff")
    public async onCuffPlayer(): Promise<void> {
        await this.animation.load("mp_arresting");
        
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 41, 0, 5);
        native.setPedCanSwitchWeapon(alt.Player.local.scriptID, false);
        native.setPlayerCanDoDriveBy(alt.Player.local.scriptID, false);
        native.setCurrentPedWeapon(alt.Player.local.scriptID, 0xA2719263, true);
        
        this.cuffTick = this.update.add(() => {
            if (!this.animation.isPlaying("mp_arresting", "idle")) {
                this.animation.play("mp_arresting", "idle", {
                    flag: AnimationFlag.Loop | AnimationFlag.OnlyAnimateUpperBody | AnimationFlag.AllowPlayerControl
                });
            }
            
            native.disableControlAction(0, InputType.ENTER, true);
            native.disableControlAction(0, InputType.ATTACK, true);
            native.disableControlAction(0, InputType.ATTACK2, true);
            native.disableControlAction(0, InputType.AIM, true);
            native.disableControlAction(0, InputType.JUMP, true);
        });
    }

    @onServer("player:uncuff")
    public onUncuffPlayer(): void {
        this.animation.clear();

        native.setPedComponentVariation(alt.Player.local.scriptID, 7, -1, 0, 5);
        native.setPedCanSwitchWeapon(alt.Player.local.scriptID, true);
        native.setPlayerCanDoDriveBy(alt.Player.local.scriptID, true);

        this.update.remove(this.cuffTick);
    }

    @onServer("player:getcamerainfo")
    public getCameraInfo(name: string): void {
        const pos = this.camera.camPos;
        const rot = this.camera.camRot;

        this.event.emitServer("data:sendcamerainfo", name, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
    }

    @onGui("player:focusinput")
    public onFocusInput(state: boolean): void {
        this.player.setIsAnyTextFieldFocused = state;
    }

    public updateBlips(): void {
        this.destroyDebugBlips();
        this.showDebugBlips();
    }

    private showDebugBlips(): void {       
        alt.Player.all.forEach((otherPlayer: alt.Player) => {
            if (otherPlayer !== alt.Player.local) {
                this.adutyPlayerBlips.push(this.blip.createBlipForEntity(otherPlayer.scriptID, 5, 1, "", true));
            }
        });
    }

    private destroyDebugBlips(): void {
        this.adutyPlayerBlips.forEach((blip: number) => {
            this.blip.destroyBlip(blip);
        });
    }

    private tick(): void {
        //Marker and Webview Fix:
        native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false);

        if (!this.player.isSpawnedCharacter) {
            return;
        }

        this.player.updatePositionInHUD();
        this.player.updateHealthInHUD();
        this.disableOneHitMelee();
        this.leftClickOnlyWithRightClick();

        // hide default health bar
        alt.beginScaleformMovieMethodMinimap('SETUP_HEALTH_ARMOUR');
        native.scaleformMovieMethodAddParamInt(3);
        native.endScaleformMovieMethod();

        native.hideHudComponentThisFrame(6);
        native.hideHudComponentThisFrame(7);
        native.hideHudComponentThisFrame(8);
        native.hideHudComponentThisFrame(9);
    }

    private disableOneHitMelee(): void {
        if (native.isPedArmed(alt.Player.local.scriptID, 6)) {
            native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_HEAVY, true);
            native.disableControlAction(0, InputType.MELEE_ATTACK_ALTERNATE, true); 
        }
    }

    private leftClickOnlyWithRightClick(): void {
        native.disableControlAction(0, InputType.ATTACK, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);

        if (native.isControlPressed(0, InputType.AIM)) {
            native.enableControlAction(0, InputType.ATTACK, true);
            native.enableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
        }
    }
}
