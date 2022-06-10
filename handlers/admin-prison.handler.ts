import * as alt from "alt-client";
import {IVector3} from "alt-client";

import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onGui, onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {Player} from "@extensions/player.extensions";
import {LoggerModule} from "../modules/logger.module";
import {CameraModule} from "../modules/camera.module";
import {GuiModule} from "../modules/gui.module";
import {MarkerModule} from "../modules/marker.module";
import {BlipModule} from "../modules/blip.module";
import {UpdateModule} from "../modules/update.module";
import {MathModule} from "../modules/math.module";

@foundation() @singleton()
export class AdminPrisonHandler {
    private checkpointPositions: IVector3[] = [{x: 395.86813, y: 6493.1343, z: 27.049805}, {
        x: 394.6022,
        y: 6546.58,
        z: 26.460083
    }, {x: 309.25714, y: 6546.5933, z: 28.111328}, {x: 306.30328, y: 6492.949, z: 28.380981}, {
        x: 303.3231,
        y: 6447.798,
        z: 31.161133
    }, {x: 392.84836, y: 6458.492, z: 29.189697}];
    private index: number = 0;
    private currentCheckpointPos: IVector3 | undefined;
    private tickId: string | undefined;
    private reachedCheckpoint: boolean;
    private currentBlip: number | undefined;
    private totalCheckpoints: number;

    constructor(private readonly event: EventModule, private readonly logger: LoggerModule, private readonly camera: CameraModule, private readonly gui: GuiModule, private readonly marker: MarkerModule, private readonly blip: BlipModule, private readonly update: UpdateModule, private readonly math: MathModule, private readonly player: Player) {
    }

    @onServer("adminprison:start")
    private onStart(totalCheckpoints: number): void {
        this.player.isInAPrison = true;

        this.event.emitGui("gui:routeto", "adminprison");

        this.player.fadeIn(500);
        this.player.unblurScreen(500);
        this.player.showRadar();
        this.player.hideHud();
        this.player.hideCursor();
        this.player.unfreeze();
        this.player.lockCamera(false);
        this.player.setVisible(true);
        this.player.blockGameControls(false);

        this.camera.destroyCamera();
        this.gui.unfocusView();

        this.index = 0;
        this.reachedCheckpoint = false;
        this.currentCheckpointPos = this.checkpointPositions[this.index];

        if (this.tickId != undefined) {
            this.update.remove(this.tickId);
        }

        this.tickId = this.update.add(() => this.tick());

        if (this.currentBlip != undefined) {
            this.blip.destroyBlip(this.currentBlip);
        }

        this.currentBlip = this.blip.createBlip(this.checkpointPositions[this.index], 1, 1, "", true);

        this.totalCheckpoints = totalCheckpoints;
    }

    @onServer("adminprison:stop")
    private onStop(): void {
        this.blip.destroyBlip(this.currentBlip);
        this.currentBlip = undefined;
        this.currentCheckpointPos = undefined;
        this.update.remove(this.tickId);
        this.tickId = undefined;

        this.player.isInAPrison = false;
    }

    @onServer("adminprison:sendnextcheckpoint")
    private onSendNextCheckpoint(leftCheckpoints: number): void {
        this.reachedCheckpoint = false;

        this.index++;
        if (this.index >= this.checkpointPositions.length) {
            this.index = 0;
        }

        this.currentCheckpointPos = this.checkpointPositions[this.index];

        this.blip.destroyBlip(this.currentBlip);
        this.currentBlip = this.blip.createBlip(this.checkpointPositions[this.index], 1, 1, "", true);

        this.event.emitGui("adminprison:update", leftCheckpoints);
    }

    @onGui("adminprison:ready")
    private OnUiReady(): void {
        this.event.emitGui("adminprison:start", this.totalCheckpoints);
    }

    private tick(): void {
        if (this.currentCheckpointPos !== undefined && !this.reachedCheckpoint) {
            if (this.math.distance(alt.Player.local.pos, this.currentCheckpointPos) <= 1) {
                this.event.emitServer("adminprison:requestnextcheckpoint");
                this.reachedCheckpoint = true;
            }

            this.marker.drawMarker({
                positionX: this.currentCheckpointPos.x,
                positionY: this.currentCheckpointPos.y,
                positionZ: this.currentCheckpointPos.z,
                sizeX: 1,
                sizeY: 1,
                sizeZ: 1,
                text: "",
                hasText: false,
                red: 192,
                green: 57,
                blue: 43,
                alpha: 100,
                type: 1,
                bobUpAndDown: false
            });
        }
    }
}