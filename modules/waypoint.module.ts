import * as native from "natives";
import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {MathModule} from "./math.module";
import {BlipModule} from "./blip.module";
import {UpdateModule} from "./update.module";
import {LoggerModule} from "./logger.module";

@singleton()
export class WaypointModule {
    private updateId: string;
    private currentWaypointBlip: number;
    private currentTargetPos: alt.Vector3;

    public constructor(private readonly logger: LoggerModule, private readonly update: UpdateModule, private readonly blip: BlipModule, private readonly math: MathModule) {
    }

    public set(x: number, y: number, z: number, color: number, sprite: number): void {
        if (this.currentWaypointBlip !== undefined) {
            this.destroy();
        }

        this.currentTargetPos = new alt.Vector3(x, y, z);
        this.currentWaypointBlip = this.blip.createBlip(this.currentTargetPos, color, sprite, "", true);

        native.setBlipRoute(this.currentWaypointBlip, true);
        native.setBlipRouteColour(this.currentWaypointBlip, color);

        this.updateId = this.update.add(() => this.tick());
    }

    public destroy(): void {
        this.update.remove(this.updateId);
        this.blip.destroyBlip(this.currentWaypointBlip);
    }

    private tick(): void {
        if (this.math.distance(alt.Player.local.pos, this.currentTargetPos) < 4) {
            this.destroy();
        }
    }
}