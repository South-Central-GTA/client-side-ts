import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {UpdateModule} from "./update.module";
import {MathModule} from "./math.module";

enum DriftEndReason {
    LowSpeed = 0, LowAngle = 1, DamageDetected = 2, OutOfVehicle = 3
}

enum DriftTypes {
    Drifting = 0, GoodDrift = 1, PerfectDrift = 2, PowerSlide = 3
}

@singleton()
export class DriftModule {
    private healthSnapshot: number;
    private startTime: Date;
    private isDrifting: boolean;
    private updateId: string;
    private badAngleSince: number;
    private driftType: DriftTypes = 0;
    private driftScore: number = 0;
    private MIN_ANGLE: number = 20.0;
    private MAX_ANGLE: number = 80.0;
    private MIN_SPEED: number = 6.0;

    public constructor(private readonly update: UpdateModule, private readonly math: MathModule) {
    }

    get getDriftType() {
        return this.driftType;
    }

    get getDriftScore() {
        return this.driftScore;
    }

    public startTracking(vehicle: alt.Vehicle) {
        if (!this.updateId) {
            this.updateId = this.update.add(() => this.tick(vehicle));
        }
    }

    public stopTracking() {
        this.update.remove(this.updateId);
        this.updateId = null;
    }

    private tick(vehicle: alt.Vehicle) {
        const velocity = native.getEntityVelocity(vehicle.scriptID);
        const speed = native.getEntitySpeed(vehicle.scriptID);
        const health = native.getEntityHealth(vehicle.scriptID);
        const forward = native.getEntityForwardVector(vehicle.scriptID);
        const normalForward = this.math.normalize2d(forward.x, forward.y);
        const normalVelocity = this.math.normalize2d(velocity.x, velocity.y);

        const driftAngle = native.getAngleBetween2dVectors(normalForward.x, normalForward.y, normalVelocity.x,
                normalVelocity.y);

        const angleOk = (driftAngle >= this.MIN_ANGLE && driftAngle <= this.MAX_ANGLE);
        const speedOk = (speed >= this.MIN_SPEED);
        const damageOk = this.isDrifting ? (health >= this.healthSnapshot) : true;

        const isDriftingNow = (angleOk && speedOk && damageOk);

        if (this.isDrifting) {
            if (isDriftingNow) {
                this.badAngleSince = 0;
                this.driftProcessed(driftAngle, speed, true);
            } else {
                let end = true;
                let treshhold = false;

                if (!angleOk && speedOk && damageOk) {
                    if (this.badAngleSince === 0) {
                        this.badAngleSince = Date.now();
                        end = false;
                    } else if ((Date.now() - this.badAngleSince) < 2000) {
                        end = false;
                        treshhold = true;
                    }
                }

                if (end) {
                    this.driftEnded(
                            !angleOk ? DriftEndReason.LowAngle : (!speedOk ? DriftEndReason.LowSpeed : DriftEndReason.DamageDetected));
                } else {
                    this.driftProcessed(driftAngle, speed, false, treshhold);
                }
            }
        } else if (isDriftingNow) {
            this.driftStarted(vehicle);
        } else if (this.isDrifting) {
            this.driftEnded(DriftEndReason.OutOfVehicle);
        }
    }

    private driftStarted(vehicle: alt.Vehicle) {
        this.healthSnapshot = native.getEntityHealth(vehicle.scriptID);
        this.startTime = new Date();
        this.isDrifting = true;
    }

    private driftProcessed(angle: number, speed: number, init: boolean, trehshold: boolean = false) {
        if (trehshold) return;

        const currentDate = new Date();
        const diff = currentDate.getTime() - this.startTime.getTime();
        const activeSeconds = Math.floor(diff / 1000);

        if (activeSeconds <= 2) {
            this.driftType = DriftTypes.Drifting;
            this.driftScore += 1;
        } else if (activeSeconds <= 4) {
            this.driftType = DriftTypes.GoodDrift;
            this.driftScore += 2;

        } else if (activeSeconds <= 5) {
            this.driftType = DriftTypes.PerfectDrift;
            this.driftScore += 5;
        }

        if (activeSeconds >= 4) {
            if (speed >= 50) {
                this.driftType = DriftTypes.PowerSlide;
                this.driftScore += 10;
            }
        }
    }

    private driftEnded(reason: DriftEndReason) {
        this.isDrifting = false;
        this.driftScore = 0;
        const currentDate = new Date();
        const diff = currentDate.getTime() - this.startTime.getTime();
        const seconds = Math.floor(diff / 1000);
    }
}