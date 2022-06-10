import * as alt from "alt-client";

import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {Player} from "@extensions/player.extensions";
import {LoggerModule} from "../modules/logger.module";
import {CameraModule} from "../modules/camera.module";
import {GuiModule} from "../modules/gui.module";
import {MarkerModule} from "../modules/marker.module";
import {BlipModule} from "../modules/blip.module";
import {UpdateModule} from "../modules/update.module";
import {MathModule} from "../modules/math.module";
import {Vector3} from "@extensions/vector3.extensions";

@foundation() @singleton()
export class FriskHandler {
    private tickId: string | undefined;
    private searchedByPlayerId: number | undefined;
    private openPosition: Vector3;

    constructor(private readonly event: EventModule, private readonly logger: LoggerModule, private readonly camera: CameraModule, private readonly gui: GuiModule, private readonly marker: MarkerModule, private readonly blip: BlipModule, private readonly update: UpdateModule, private readonly math: MathModule, private readonly player: Player) {
    }

    @onServer("frisk:start")
    private onStart(searchedByPlayerId: number): void {
        if (this.tickId !== undefined) {
            this.update.remove(this.tickId);
            this.tickId = undefined;
        }

        this.searchedByPlayerId = searchedByPlayerId;
        this.tickId = this.update.add(() => this.tick());
        this.openPosition = alt.Player.local.pos;
    }

    private tick(): void {
        if (this.math.distance(alt.Player.local.pos, this.openPosition) > 0.5) {
            this.close();
        }
    }

    private close(): void {
        this.event.emitServer("frisk:interrupt", this.searchedByPlayerId);
    }
}