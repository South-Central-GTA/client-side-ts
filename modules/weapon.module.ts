import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {EventModule} from "./event.module";
import {LoggerModule} from "./logger.module";

@singleton()
export class WeaponModule {

    constructor(private readonly event: EventModule, private readonly logger: LoggerModule) {
    }

    public static getWeaponOfAmmoType(name: string): number {
        switch (name) {
            case "AMMO_PISTOL":
                return 0x1B06D571 // pistol

            case "AMMO_MACHINE_GUN":
                return 0x2BE6766B // smg

            case "AMMO_ASSAULT":
                return 0xBFEFFF6D // assault rifle

            case "AMMO_SNIPER":
                return 0x05FC3C11 // sniper

            case "AMMO_SHOTGUN":
                return 0x1D073A89 // shotgun

            case "AMMO_LIGHT_MACHINE_GUN":
                return 0x7FD62962 // combatmg

            default: {
                alt.logError("Kein Waffentyp mit den Namen " + name + " gefunden.")
                break;
            }
        }
    }
}