import * as alt from "alt-client";
import * as native from "natives";
import { singleton } from "tsyringe";
import { foundation } from "../decorators/foundation";
import { EventModule } from "../modules/event.module";
import { Player } from "../extensions/player.extensions";
import { KeyCodes } from "../enums/keycode.type";
import { UpdateModule } from "../modules/update.module";
import {on, onGui, onServer} from "../decorators/events";
import { InputType } from "../enums/input.type";
import { TextModule } from "../modules/text.module";
import { LoggerModule } from "../modules/logger.module";
import { VehicleModule } from "../modules/vehicle.module";
import { getGroundZ } from "../helpers";
import {GuiModule} from "../modules/gui.module";

@foundation()
@singleton()
export class VehicleHandler {
    private drivingTickId: string;
    private tickId: string;
    private maxFuel: number;
    private wasLastFrameInVehicle: boolean;
    
    public constructor(
        private readonly player: Player,
        private readonly event: EventModule,
        private readonly update: UpdateModule,
        private readonly text: TextModule,
        private readonly logger: LoggerModule,
        private readonly vehicle: VehicleModule,
        private readonly gui: GuiModule) {
        this.tickId = this.update.add(() => this.tick());
    }

    @on('keydown')
    public onKeydown(key: number): void {
        const vehicle = alt.Player.local.vehicle;
        if (vehicle instanceof alt.Vehicle) {
            if (key === KeyCodes.Y) {
                if (this.player.getIsAnyTextOpen || native.getVehicleClass(vehicle.scriptID) === 13)
                    return;

                this.event.emitServer("vehicle:toggleengine");
            } 
        }
    }

    @onServer("vehicle:entering")
    public onEnteringVehicle(vehicle: alt.Vehicle): void {
        if (native.getVehicleDoorLockStatus(vehicle.scriptID) === 2) {
            let i = 0;
            const interval = alt.setInterval(() => {
                if (i === 15) {
                    alt.clearInterval(interval);
                    return;
                }
                
                if (native.getVehicleDoorLockStatus(vehicle.scriptID) === 1) {
                    this.overrideVehicleEntrance();
                    alt.clearInterval(interval);
                    return;
                }

                i++
            }, 200);
        }                                                        
    }

    @on("enteredVehicle")
    public onEnteredVehicle(vehicle: alt.Vehicle, oldSeat: number, seat: number): void {
        if (vehicle.hasSyncedMeta("MAX_FUEL")) {
            this.maxFuel = vehicle.getSyncedMeta("MAX_FUEL");
        } else {
            this.maxFuel = 0;
        }

        this.updateUI(vehicle);
        this.drivingTickId = this.update.add(() => this.drivingTick(vehicle));

        if (!this.player.getIsInventoryOpen && native.getVehicleClass(vehicle.scriptID) != 13) {
            this.event.emitGui("speedo:toggleui", true);

            this.player.showRadar();
        }
        
        this.wasLastFrameInVehicle = true;
    }

    @on("leftVehicle")
    public onLeftVehicle(vehicle: alt.Vehicle, seat: number): void {
        this.update.remove(this.drivingTickId);
        
        this.event.emitGui("speedo:toggleui", false);

        this.player.hideRadar();
    }

    @onServer("vehicle:repair")
    public repairVehicle(vehicle: alt.Vehicle, vehicleDbId: number, amount: number, fixCosmetics: boolean):  void {
        if (vehicle === undefined) {
            return;
        }

        this.vehicle.fix(vehicle, amount, fixCosmetics);
    }

    @onServer("vehiclesellmenu:show")
    public onSellVehicleMenuShow(hasBankAccount: boolean, isInGroup: boolean): void {
        this.player.setIsAnyMenuOpen = true;
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();
        
        this.event.emitGui("vehiclesellmenu:show", hasBankAccount, isInGroup);
    }
    
    @onServer("vehiclesellmenu:close")
    @onGui("vehiclesellmenu:close")
    public onSellVehicleMenuClose(): void {
        this.player.setIsAnyMenuOpen = false;
        this.player.unfreeze();
        this.player.hideCursor();
        this.gui.unfocusView();
    }
    
    private overrideVehicleEntrance(): void {
        const vehicle = this.vehicle.getClosestVehicle();
        if (!vehicle) {
            return;
        }
        
        const vehicleDoor = this.vehicle.getClosestVehicleDoor(vehicle);
        if (vehicleDoor > -1) {
            native.taskEnterVehicle(alt.Player.local, vehicle, -1, vehicleDoor - 1, 1, 1, 0);
        }
    }

    private drivingTick(vehicle: alt.Vehicle): void {
        if (vehicle == null) {
            return;
        }
        
        if (!vehicle.valid) {
            return;
        }

        this.blockPlayerVehicleRollingOver(vehicle);
        this.updateUI(vehicle);
    }

    private tick(): void {
        alt.Vehicle.all.forEach((vehicle: alt.Vehicle) => {
            this.drawAdminDebug(vehicle);
        });
        
        if (this.wasLastFrameInVehicle) {
            if (alt.Player.local.vehicle === undefined) {
                this.event.emitGui("speedo:toggleui", false);
                this.wasLastFrameInVehicle = false;
            }
        }
    }

    private updateUI(vehicle: alt.Vehicle): void {
        if (vehicle == null || !vehicle.valid) {
            return;
        }
        
        if (native.getVehicleClass(vehicle.scriptID) === 13) {
            return;
        }

        let fuelPercentage: number = 1;
        let drivenKilometre: number = -1;
        
        if (vehicle.hasSyncedMeta("FUEL")) {
            const fuel = vehicle.getSyncedMeta("FUEL");
            fuelPercentage = fuel / this.maxFuel;
        }

        if (vehicle.hasSyncedMeta("DRIVEN_KILOMETRE")) {
            drivenKilometre = vehicle.getSyncedMeta("DRIVEN_KILOMETRE");
        }
        
        this.event.emitGui("speedo:getinformation", {
            speed: this.vehicle.getCurrentSpeed(vehicle),
            rpm: vehicle.rpm,
            gear: vehicle.gear,
            fuelPercentage: fuelPercentage,
            engine: native.getIsVehicleEngineRunning(vehicle.scriptID),
            drivenKilometre: drivenKilometre,
        });
    }

    private blockPlayerVehicleRollingOver(vehicle: alt.Vehicle): void {
        const roll = native.getEntityRoll(vehicle.scriptID);
        if (roll > 75 || roll < -75) {
            native.disableControlAction(2, InputType.VEH_MOVE_LR, true);
            native.disableControlAction(2, InputType.VEH_MOVE_UD, true);
        }
    }

    private drawAdminDebug(vehicle: alt.Vehicle): void {
        if (!this.player.isAduty || !vehicle.hasSyncedMeta("ID")) {
            return;
        }

        const id = vehicle.getSyncedMeta("ID");
        const owner = vehicle.getSyncedMeta("OWNER");
        const engineHealth = native.getVehicleEngineHealth(vehicle.scriptID);
        const bodyHealth = native.getVehicleBodyHealth(vehicle.scriptID);

        this.text.drawText3dWithDistance(
            `Id: ${id}\nEigentümer: ${owner}\nEngine Health: ${engineHealth.toFixed(2)}\nBody Health: ${bodyHealth.toFixed(2)}`,
            vehicle.pos.x, vehicle.pos.y, vehicle.pos.z + 0.5, 0.4, 0,
            41, 128, 185, 255, false, true, 5);
    }
}
