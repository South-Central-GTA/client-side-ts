import * as alt from "alt-client";
import {Vector3} from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EventModule} from "../../modules/event.module";
import {CameraModule} from "../../modules/camera.module";
import {LoggerModule} from "../../modules/logger.module";
import {NotificationModule} from "../../modules/notification.module";
import {on, onGui, onServer} from "../../decorators/events";
import {MathModule} from "../../modules/math.module";
import {CharCreatorModule} from "../../modules/char-creator.module";
import {SpawnInterface} from "@interfaces/spawn.interface";

@foundation() @singleton()
export class SpawnSelectorHandler {
    private spawns: SpawnInterface[] = [];
    private currentIndex: number = 0;
    private currentSpawnIndex: number = 0;
    private helicopterCamInt: number = 0;

    public constructor(private readonly camera: CameraModule, private readonly notification: NotificationModule, private readonly logger: LoggerModule, private readonly event: EventModule, private readonly math: MathModule, private readonly charCreator: CharCreatorModule) {
    }

    @onServer("spawnselector:reset")
    @on("disconnect")
    public onReset(): void {
        this.currentIndex = 0;
        this.currentSpawnIndex = this.currentIndex;

        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }

        this.camera.destroyCamera();
    }

    @onServer("spawnselector:open")
    public onOpen(spawns: SpawnInterface[]): void {
        this.spawns = spawns;

        this.event.emitGui("spawnselector:defaultselect", this.spawns[this.currentIndex]);

        this.selectSpawn(this.spawns[this.currentIndex]);
    }

    @onGui("spawnselector:change")
    public onChange(direction: number): void {
        this.currentIndex += direction;

        if (this.currentIndex < 0) {
            this.currentIndex = this.spawns.length - 1;
        }

        if (this.currentIndex > this.spawns.length - 1) {
            this.currentIndex = 0;
        }

        this.selectSpawn(this.spawns[this.currentIndex]);
    }

    @onGui("spawnselector:close")
    public onClose(): void {
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }
    }

    @onGui("spawnselector:select")
    public onSelect(spawnId: number): void {
        this.currentSpawnIndex = this.currentIndex;
        this.event.emitServer("charcreatorspawn:select", spawnId);
    }

    @onGui("spawnselector:show")
    public onShow(): void {
        this.currentIndex = this.currentSpawnIndex;
        this.selectSpawn(this.spawns[this.currentIndex]);
    }

    private selectSpawn(spawn: SpawnInterface): void {
        let pos = new alt.Vector3(spawn.x, spawn.y, spawn.z);

        if (spawn.id === 0) { // LS Airport
            pos = new alt.Vector3(spawn.x, spawn.y, spawn.z + 25);
        }

        this.charCreator.setSpawn(spawn.id);
        this.event.emitGui("spawnselector:setinfo", spawn);

        this.updateCamera(pos);
    }

    private updateCamera(spawnPos: alt.Vector3): void {
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }

        this.createHelicopterCam(spawnPos);
    }

    private createHelicopterCam(pos: Vector3): void {
        let angle = 0;

        const p = this.math.getPointAtPoint(pos, 25, angle);

        this.camera.createCamera(new Vector3(p.x, p.y, pos.z + 15), new Vector3(0, 0, 0));
        this.camera.pointAt(new Vector3(pos.x, pos.y, pos.z - 5));

        this.helicopterCamInt = alt.setInterval(() => {
            const p = this.math.getPointAtPoint(pos, 25, angle);

            this.camera.setPos(new Vector3(p.x, p.y, pos.z + 15));
            this.camera.pointAt(new Vector3(pos.x, pos.y, pos.z - 5));

            angle += 0.0009;
        }, 10);
    }
}