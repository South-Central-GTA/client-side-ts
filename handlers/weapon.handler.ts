import alt from "alt-client";
import native from "natives";
import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {GuiModule} from "../modules/gui.module";
import {EventModule} from "../modules/event.module";
import {onServer} from "../decorators/events";
import {WeaponModule} from "../modules/weapon.module";
import {Player} from "@extensions/player.extensions";
import {UpdateModule} from "../modules/update.module";
import {LoggerModule} from "../modules/logger.module";

@foundation() @singleton()
export class WeaponHandler {
    private wasShooting = false;

    public constructor(private readonly gui: GuiModule, private readonly event: EventModule, private readonly player: Player, private readonly update: UpdateModule, private readonly logger: LoggerModule) {
        this.update.add(() => this.tick());
    }

    @onServer("weapon:giveammo")
    public onGiveAmmo(name: string, ammo: number): void {
        native.addAmmoToPed(alt.Player.local.scriptID, WeaponModule.getWeaponOfAmmoType(name), ammo);
    }

    @onServer("weapon:removeammo")
    public onRemoveAmmo(name: string, ammo: number): void {
        native.addAmmoToPed(alt.Player.local.scriptID, WeaponModule.getWeaponOfAmmoType(name), -ammo);
    }

    private tick(): void {
        if (native.isPedShooting(alt.Player.local)) {
            this.wasShooting = true;
        } else {
            if (this.wasShooting) {
                this.wasShooting = false;
                this.updateAmmoMeta();
            }
        }
    }

    private updateAmmoMeta(): void {
        let pistolAmmo = native.getAmmoInPedWeapon(alt.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_PISTOL"));
        let machineGunAmmo = native.getAmmoInPedWeapon(alt.Player.local,
                WeaponModule.getWeaponOfAmmoType("AMMO_MACHINE_GUN"));
        let assaultAmmo = native.getAmmoInPedWeapon(alt.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_ASSAULT"));
        let sniperAmmo = native.getAmmoInPedWeapon(alt.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_SNIPER"));
        let shotgunAmmo = native.getAmmoInPedWeapon(alt.Player.local, WeaponModule.getWeaponOfAmmoType("AMMO_SHOTGUN"));
        let lightMachineGunAmmo = native.getAmmoInPedWeapon(alt.Player.local,
                WeaponModule.getWeaponOfAmmoType("AMMO_LIGHT_MACHINE_GUN"));

        // thorwables 
        let baseballAmmo = native.getAmmoInPedWeapon(alt.Player.local, 0x23C9F95C);
        let bzgasAmmo = native.getAmmoInPedWeapon(alt.Player.local, 0xA0973D5E);
        let flareAmmo = native.getAmmoInPedWeapon(alt.Player.local, 0x497FACC3);
        let grenadeAmmo = native.getAmmoInPedWeapon(alt.Player.local, 0x93E220BD);
        let molotovAmmo = native.getAmmoInPedWeapon(alt.Player.local, 0x24B17070);
        let snowballAmmo = native.getAmmoInPedWeapon(alt.Player.local, 0x787F0BB);

        this.event.emitServer("weapon:sendammo", JSON.stringify({
            PistolAmmo: pistolAmmo,
            MachineGunAmmo: machineGunAmmo,
            AssaultAmmo: assaultAmmo,
            SniperAmmo: sniperAmmo,
            ShotgunAmmo: shotgunAmmo,
            LightMachineGunAmmo: lightMachineGunAmmo,
            BaseballAmmo: baseballAmmo,
            BzgasAmmo: bzgasAmmo,
            FlareAmmo: flareAmmo,
            GrenadeAmmo: grenadeAmmo,
            MolotovAmmo: molotovAmmo,
            SnowballAmmo: snowballAmmo,
        }));
    }
}