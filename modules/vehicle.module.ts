import {singleton} from "tsyringe";
import * as native from "natives";
import * as alt from "alt-client";
import {IVehicleMods} from "@interfaces/vehicle-mods.interface";
import {MathModule} from "./math.module";

@singleton()
export class VehicleModule {

    public constructor(private readonly math: MathModule) {
    }

    public fix(vehicle: alt.Vehicle, amount: number = 1000, fixCosmetics: boolean = false): void {
        for (let index = 0; index < vehicle.wheelsCount; index++) {
            native.setVehicleTyreFixed(vehicle.scriptID, index);
        }

        if (fixCosmetics) {
            native.setVehicleDeformationFixed(vehicle.scriptID);
        }
    }

    public createShowcaseVehicle(hash: number, x: number, y: number, z: number, heading: number, primColor: number, secColor: number): number {
        const vehicle = native.createVehicle(hash, x, y, z, heading, false, true, true);
        native.setEntityCollision(vehicle, false, false);
        native.freezeEntityPosition(vehicle, true);
        native.setVehicleNumberPlateText(vehicle, "");
        native.setVehicleColours(vehicle, primColor, secColor);
        native.setVehicleModKit(vehicle, 0);

        return vehicle;
    }

    public setTrunkState(vehicle: alt.Vehicle, state: boolean): void {
        if (state) {
            native.playVehicleDoorOpenSound(vehicle.scriptID, 5);
            native.setVehicleDoorOpen(vehicle.scriptID, 5, true, true);
        } else {
            native.playVehicleDoorCloseSound(vehicle.scriptID, 5);
            native.setVehicleDoorShut(vehicle.scriptID, 5, true);
        }
    }

    public removeMod(vehicle: number, mod: number) {
        native.removeVehicleMod(vehicle, mod);
    }

    public addMod(vehicle: number, mod: number, index: number) {
        native.setVehicleMod(vehicle, mod, index, false);
    }

    public addMods(vehicle: number, mods: IVehicleMods) {
        this.addMod(vehicle, 0, mods.spoilers);
        this.addMod(vehicle, 1, mods.frontBumper);
        this.addMod(vehicle, 2, mods.rearBumper);
        this.addMod(vehicle, 3, mods.sideSkirt);
        this.addMod(vehicle, 4, mods.exhaust);
        this.addMod(vehicle, 5, mods.frame);
        this.addMod(vehicle, 6, mods.grille);
        this.addMod(vehicle, 7, mods.bonnet);
        this.addMod(vehicle, 8, mods.leftWing);
        this.addMod(vehicle, 9, mods.rightWing);
        this.addMod(vehicle, 10, mods.roof);
        this.addMod(vehicle, 11, mods.engine);
        this.addMod(vehicle, 12, mods.brakes);
        this.addMod(vehicle, 13, mods.transmission);
        this.addMod(vehicle, 14, mods.horns);
        this.addMod(vehicle, 15, mods.suspension);
        this.addMod(vehicle, 16, mods.armor);
        this.addMod(vehicle, 18, mods.turbo);
        this.addMod(vehicle, 20, mods.tireSmoke);
        this.addMod(vehicle, 22, mods.xenon);
        this.addMod(vehicle, 23, mods.frontWheels);
        this.addMod(vehicle, 24, mods.backWheels);
        this.addMod(vehicle, 25, mods.plateHolders);
        this.addMod(vehicle, 26, mods.plateVanity);
        this.addMod(vehicle, 27, mods.trimDesign);
        this.addMod(vehicle, 28, mods.ornaments);
        this.addMod(vehicle, 30, mods.dialDesign);
        this.addMod(vehicle, 31, mods.doorInterior);
        this.addMod(vehicle, 32, mods.seats);
        this.addMod(vehicle, 33, mods.steeringWheel);
        this.addMod(vehicle, 34, mods.shiftLever);
        this.addMod(vehicle, 35, mods.plaques);
        this.addMod(vehicle, 36, mods.rearShelf);
        this.addMod(vehicle, 37, mods.trunk);
        this.addMod(vehicle, 38, mods.hydraulics);
        this.addMod(vehicle, 39, mods.engineBlock);
        this.addMod(vehicle, 40, mods.airFilter);
        this.addMod(vehicle, 41, mods.strutBar);
        this.addMod(vehicle, 42, mods.archCover);
        this.addMod(vehicle, 43, mods.antenna);
        this.addMod(vehicle, 44, mods.exteriorParts);
        this.addMod(vehicle, 45, mods.tank);
        this.addMod(vehicle, 46, mods.door);
        this.addMod(vehicle, 48, mods.livery);
    }

    public changePrimColor(vehicle: number, color: number) {
        const [_, primColor, secColor] = native.getVehicleColours(vehicle, null, null);
        native.setVehicleColours(vehicle, color, secColor);
    }

    public changeSecColor(vehicle: number, color: number) {
        const [_, primColor, secColor] = native.getVehicleColours(vehicle, null, null);
        native.setVehicleColours(vehicle, primColor, color);
    }

    public getColor(vehicle: number): [number, number] {
        const [_, primColor, secColor] = native.getVehicleColours(vehicle, null, null);
        return [primColor, secColor];
    }

    public getClass(vehicle: number): number {
        return native.getVehicleClass(vehicle);
    }

    // We need to devide by one to get the correct index on client side.
    // Mod indexes are shiftet by -1 on client side. So -1 is stock and 0 is the first mod.
    public convertToClient(mods: IVehicleMods): IVehicleMods {
        const returnMods: IVehicleMods = {
            spoilers: mods.spoilers - 1,
            frontBumper: mods.frontBumper - 1,
            rearBumper: mods.rearBumper - 1,
            sideSkirt: mods.sideSkirt - 1,
            exhaust: mods.exhaust - 1,
            frame: mods.frame - 1,
            grille: mods.grille - 1,
            bonnet: mods.bonnet - 1,
            leftWing: mods.leftWing - 1,
            rightWing: mods.rightWing - 1,
            roof: mods.roof - 1,
            engine: mods.engine - 1,
            brakes: mods.brakes - 1,
            transmission: mods.transmission - 1,
            horns: mods.horns - 1,
            suspension: mods.suspension - 1,
            armor: mods.armor - 1,
            turbo: mods.turbo - 1,
            tireSmoke: mods.tireSmoke - 1,
            xenon: mods.xenon - 1,
            frontWheels: mods.frontWheels - 1,
            backWheels: mods.backWheels - 1,
            plateHolders: mods.plateHolders - 1,
            plateVanity: mods.plateVanity - 1,
            trimDesign: mods.trimDesign - 1,
            ornaments: mods.ornaments - 1,
            dialDesign: mods.dialDesign - 1,
            doorInterior: mods.doorInterior - 1,
            seats: mods.seats - 1,
            steeringWheel: mods.steeringWheel - 1,
            shiftLever: mods.shiftLever - 1,
            plaques: mods.plaques - 1,
            rearShelf: mods.rearShelf - 1,
            trunk: mods.trunk - 1,
            hydraulics: mods.hydraulics - 1,
            engineBlock: mods.engineBlock - 1,
            airFilter: mods.airFilter - 1,
            strutBar: mods.strutBar - 1,
            archCover: mods.archCover - 1,
            antenna: mods.antenna - 1,
            exteriorParts: mods.exteriorParts - 1,
            tank: mods.tank - 1,
            door: mods.door - 1,
            livery: mods.livery - 1
        };
        return returnMods;
    }

    // We need to add by one to get the correct index on server side.
    // Mod indexes starting on server side at 0 so 0 is stock and 1 is the first mod.
    public convertToServer(mods: IVehicleMods): IVehicleMods {
        const returnMods: IVehicleMods = {
            spoilers: mods.spoilers + 1,
            frontBumper: mods.frontBumper + 1,
            rearBumper: mods.rearBumper + 1,
            sideSkirt: mods.sideSkirt + 1,
            exhaust: mods.exhaust + 1,
            frame: mods.frame + 1,
            grille: mods.grille + 1,
            bonnet: mods.bonnet + 1,
            leftWing: mods.leftWing + 1,
            rightWing: mods.rightWing + 1,
            roof: mods.roof + 1,
            engine: mods.engine + 1,
            brakes: mods.brakes + 1,
            transmission: mods.transmission + 1,
            horns: mods.horns + 1,
            suspension: mods.suspension + 1,
            armor: mods.armor + 1,
            turbo: mods.turbo + 1,
            tireSmoke: mods.tireSmoke + 1,
            xenon: mods.xenon + 1,
            frontWheels: mods.frontWheels + 1,
            backWheels: mods.backWheels + 1,
            plateHolders: mods.plateHolders + 1,
            plateVanity: mods.plateVanity + 1,
            trimDesign: mods.trimDesign + 1,
            ornaments: mods.ornaments + 1,
            dialDesign: mods.dialDesign + 1,
            doorInterior: mods.doorInterior + 1,
            seats: mods.seats + 1,
            steeringWheel: mods.steeringWheel + 1,
            shiftLever: mods.shiftLever + 1,
            plaques: mods.plaques + 1,
            rearShelf: mods.rearShelf + 1,
            trunk: mods.trunk + 1,
            hydraulics: mods.hydraulics + 1,
            engineBlock: mods.engineBlock + 1,
            airFilter: mods.airFilter + 1,
            strutBar: mods.strutBar + 1,
            archCover: mods.archCover + 1,
            antenna: mods.antenna + 1,
            exteriorParts: mods.exteriorParts + 1,
            tank: mods.tank + 1,
            door: mods.door + 1,
            livery: mods.livery + 1
        };

        return returnMods;
    }

    public getCurrentSpeed(vehicle: alt.Vehicle): number {
        return native.getEntitySpeed(vehicle.scriptID) * 3.6;
    }

    public getClosestVehicle(): alt.Vehicle | null {
        const obj: { distance: null | number, vehicle: null | alt.Vehicle } = {
            distance: null, vehicle: null
        };

        for (const vehicle of alt.Vehicle.streamedIn) {
            const distance = this.math.distance(alt.Player.local.pos, vehicle.pos);
            if (obj.distance == null || obj.distance > distance) {
                obj.distance = distance;
                obj.vehicle = vehicle;
            }
        }

        return obj.vehicle;
    }

    public getClosestVehicleDoor(vehicle?: alt.Vehicle): number {
        const _vehicle = vehicle == null ? this.getClosestVehicle() : vehicle;
        if (!_vehicle) {
            return -1;
        }

        const obj: { distance: null | number, door: number } = {distance: null, door: -1};

        for (let i = 0, l = native.getNumberOfVehicleDoors(_vehicle); i < l; i++) {
            const distance = this.math.distance(alt.Player.local.pos, native.getEntryPositionOfDoor(_vehicle, i));
            if (obj.distance == null || obj.distance > distance) {
                obj.distance = distance;
                obj.door = i;
            }
        }

        return obj.door;
    }
}