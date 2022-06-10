import * as alt from "alt-client";
import {IVector3} from "alt-client";

import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {LoggerModule} from "../modules/logger.module";
import {CameraModule} from "../modules/camera.module";
import {GuiModule} from "../modules/gui.module";
import {MarkerModule} from "../modules/marker.module";
import {UpdateModule} from "../modules/update.module";
import {MathModule} from "../modules/math.module";
import {WaypointModule} from "../modules/waypoint.module";
import {VehicleModule} from "../modules/vehicle.module";

@foundation() @singleton()
export class DrivingSchoolHandler {
    private checkpointPositions: IVector3[] = [{x: 262.02197, y: -1859.6176, z: 25.864}, {
        x: 413.2879,
        y: -1717.2395,
        z: 28.274
    }, {x: 445.37143, y: -1605.2307, z: 28.24}, {x: 385.91208, y: -1553.6044, z: 28.206}, {
        x: 348.72528,
        y: -1529.9473,
        z: 28.324
    }, {x: 142.86594, y: -1380, z: 28.308}, {x: -204.87033, y: -1418.6373, z: 30.33}, {
        x: -150.48792,
        y: -1518.2373,
        z: 33.093
    }, {x: -51.929672, y: -1601.4725, z: 28.274}, {x: -96.87033, y: -1685.1296, z: 28.324}, {
        x: -97.094505,
        y: -1773.4813,
        z: 28.358
    }, {x: -55.806595, y: -1809.4945, z: 26.016}, {x: -7.1340637, y: -1790.0967, z: 27.179}, {
        x: -50.228573,
        y: -1733.5253,
        z: 28.274
    }, {x: 30.276924, y: -1692.4352, z: 28.206}, {x: 90.14506, y: -1720.8, z: 27.92},];

    private MAX_SPEED = 80;

    private index: number = 0;
    private currentCheckpointPos: IVector3 | undefined;
    private startPos: IVector3 | undefined;
    private tickId: string;
    private reachedCheckpoint: boolean;
    private speedingReported: boolean;
    private speedingReports: number = 0;
    private lastCheckpoint: boolean;

    constructor(private readonly event: EventModule, private readonly logger: LoggerModule, private readonly camera: CameraModule, private readonly gui: GuiModule, private readonly marker: MarkerModule, private readonly waypoint: WaypointModule, private readonly update: UpdateModule, private readonly math: MathModule, private readonly vehicle: VehicleModule) {
    }

    @onServer("drivingschool:start")
    private onStart(startX: number, startY: number, startZ: number): void {
        this.onRestart(startX, startY, startZ, 0);
    }

    @onServer("drivingschool:stop")
    private onStop(): void {
        this.waypoint.destroy();
        this.currentCheckpointPos = undefined;
        this.update.remove(this.tickId);
        this.speedingReports = 0;
    }

    @onServer("drivingschool:restart")
    private onRestart(startX: number, startY: number, startZ: number, index: number): void {
        this.startPos = {x: startX, y: startY, z: startZ};
        this.index = index;

        this.reachedCheckpoint = false;
        this.lastCheckpoint = false;
        this.speedingReported = false;

        if (this.index >= this.checkpointPositions.length) {
            this.currentCheckpointPos = this.startPos;
            this.lastCheckpoint = true;
        } else {
            this.currentCheckpointPos = this.checkpointPositions[this.index];
        }

        this.tickId = this.update.add(() => this.tick());

        this.waypoint.set(this.checkpointPositions[this.index].x, this.checkpointPositions[this.index].y,
                this.checkpointPositions[this.index].z, 1, 1);
    }

    @onServer("drivingschool:sendnextcheckpoint")
    private onSendNextCheckpoint(): void {
        this.reachedCheckpoint = false;

        this.index++;
        if (this.index >= this.checkpointPositions.length) {
            this.currentCheckpointPos = this.startPos;
            this.lastCheckpoint = true;
        } else {
            this.currentCheckpointPos = this.checkpointPositions[this.index];
        }

        this.waypoint.set(this.currentCheckpointPos.x, this.currentCheckpointPos.y, this.currentCheckpointPos.z, 1, 1);
    }

    @onServer("drivingschool:resetlastcheckpoint")
    private onResetLastCheckpoint(): void {
        this.reachedCheckpoint = false;
    }

    @onServer("drivingschool:resetreportspeeding")
    private onResetReportSpeeding(): void {
        if (!this.speedingReported) {
            return;
        }

        alt.setTimeout(() => {
            this.speedingReported = false;
        }, 3000);
    }

    private tick(): void {
        if (alt.Player.local.vehicle) {
            if (this.vehicle.getCurrentSpeed(alt.Player.local.vehicle) > this.MAX_SPEED && !this.speedingReported) {
                this.speedingReports++;
                this.event.emitServer("drivingschool:reportspeeding", this.speedingReports);
                this.speedingReported = true;
            }

            if (this.currentCheckpointPos !== undefined && !this.reachedCheckpoint) {
                if (this.math.distance(alt.Player.local.pos, this.currentCheckpointPos) <= 4) {
                    this.event.emitServer("drivingschool:requestnextcheckpoint", this.index, this.lastCheckpoint);
                    this.reachedCheckpoint = true;
                }

                // ped sync for driving school ped
                if (this.math.distance(alt.Player.local.pos, this.currentCheckpointPos) > 500) {
                    this.event.emitServer("drivingschool:forcestop");
                }

                this.marker.drawMarker({
                    positionX: this.currentCheckpointPos.x,
                    positionY: this.currentCheckpointPos.y,
                    positionZ: this.currentCheckpointPos.z,
                    sizeX: 3,
                    sizeY: 3,
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
}