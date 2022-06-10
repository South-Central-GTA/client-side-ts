import * as alt from "alt-client";
import {IVector3} from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {RaycastModule} from "./raycast.module";
import {CameraModule} from "./camera.module";
import {LoggerModule} from "./logger.module";
import {RaycastResultInterface} from "@interfaces/raycastresult.interface";

@singleton()
export class MathModule {
    public constructor(private raycast: RaycastModule, private camera: CameraModule, private logger: LoggerModule) {
    }

    // Get the direction based on rotation.
    public rotationToDirection(rotation: alt.Vector3): alt.Vector3 {
        const z = this.degToRad(rotation.z);
        const x = this.degToRad(rotation.x);
        const num = Math.abs(Math.cos(x));

        return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
    }

    // Get the distance between to vectors.
    public distance(vector1: IVector3, vector2: IVector3) {
        const x = vector1.x - vector2.x
        const y = vector1.y - vector2.y
        const z = vector1.z - vector2.z

        return Math.sqrt(x * x + y * y + z * z)
    }

    public screenToWorld(x: number, y: number, flags: number, ignore: number = 0, distance: number = 1000): RaycastResultInterface {
        const camera = this.camera.getCamera;
        let camPos: alt.Vector3;

        if (camera) {
            camPos = native.getCamCoord(this.camera.getCamera) as alt.Vector3;
        } else {
            camPos = native.getGameplayCamCoord() as alt.Vector3;
        }

        const processedCoords = this.processCoordinates(x, y);
        const target = this.s2w(camPos, processedCoords.x, processedCoords.y);

        const dir = this.subVector3(target, camPos);

        return this.raycast.line(camPos, dir, distance, flags, ignore);
    }

    public getEntityFrontPosition(entityHandle: number, distance: number = 0): alt.Vector3 {
        const modelDimensions = native.getModelDimensions(native.getEntityModel(entityHandle), undefined, undefined);
        return this.getOffsetPositionInWorldCoords(entityHandle,
                new alt.Vector3(0, modelDimensions[2].y + distance, 0));
    }

    public getEntityRearPosition(entityHandle: number): alt.Vector3 {
        const modelDimensions = native.getModelDimensions(native.getEntityModel(entityHandle), undefined, undefined);
        return this.getOffsetPositionInWorldCoords(entityHandle, new alt.Vector3(0, modelDimensions[1].y, 0));
    }

    public getOffsetPositionInWorldCoords(entityHandle: number, offset: alt.Vector3): alt.Vector3 {
        return native.getOffsetFromEntityInWorldCoords(entityHandle, offset.x, offset.y, offset.z) as alt.Vector3;
    }

    public worldToScreen(position: alt.Vector3): alt.Vector3 {
        let result = native.getScreenCoordFromWorldCoord(position.x, position.y, position.z, undefined, undefined);

        if (!result[0]) {
            return undefined;
        }

        return new alt.Vector3((result[1] - 0.5) * 2, (result[2] - 0.5) * 2, 0);
    }

    public degToRad(deg: number): number {
        return (deg * Math.PI) / 180.0;
    }

    public radToDeg(rad: number): number {
        return (rad * 180.0) / Math.PI;
    }

    public addVector3(vector1: alt.Vector3, vector2: alt.Vector3): alt.Vector3 {
        return new alt.Vector3(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
    }

    public subVector3(vector1: alt.Vector3, vector2: alt.Vector3): alt.Vector3 {
        return new alt.Vector3(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
    }

    public mulVector(vector1: alt.Vector3, value: number): alt.Vector3 {
        return new alt.Vector3(vector1.x * value, vector1.y * value, vector1.z * value);
    }

    public dot(vector1: alt.Vector3, vector2: alt.Vector3) {
        return (vector1.x * vector2.x) + (vector1.y * vector2.y) + (vector1.z * vector2.z);
    }

    public normalize2d(x: number, y: number): alt.Vector3 {
        const t = native.sqrt(x * x + y * y);

        if (t > 0.000001) {
            let fRcpt = 1 / t;

            x *= fRcpt;
            y *= fRcpt;
        }

        return new alt.Vector3(x, y, 0);
    }

    public getPointAtPoint(pos: alt.Vector3, radius: number, angle: number) {
        const p = {
            x: 0, y: 0
        };

        let s = radius * Math.sin(angle);
        let c = radius * Math.cos(angle);

        p.x = pos.x + s;
        p.y = pos.y + c;

        return p;
    }

    private processCoordinates(x, y) {
        var res = native.getActiveScreenResolution(0, 0);
        let screenX = res[1];
        let screenY = res[2];

        let relativeX = 1 - (x / screenX) * 1.0 * 2;
        let relativeY = 1 - (y / screenY) * 1.0 * 2;

        if (relativeX > 0.0) {
            relativeX = -relativeX;
        } else {
            relativeX = Math.abs(relativeX);
        }

        if (relativeY > 0.0) {
            relativeY = -relativeY;
        } else {
            relativeY = Math.abs(relativeY);
        }

        return {x: relativeX, y: relativeY};
    }

    private s2w(camPos, relX, relY) {
        let camRot: alt.Vector3;
        const camera = this.camera.getCamera;

        if (camera) camRot = native.getCamRot(this.camera.getCamera,
                2) as alt.Vector3; else camRot = native.getGameplayCamRot(2) as alt.Vector3;

        const camForward = this.rotationToDirection(camRot);

        const rotUp = this.addVector3(camRot, new alt.Vector3(10, 0, 0));
        const rotDown = this.addVector3(camRot, new alt.Vector3(-10, 0, 0));
        const rotLeft = this.addVector3(camRot, new alt.Vector3(0, 0, -10));
        const rotRight = this.addVector3(camRot, new alt.Vector3(0, 0, 10));

        let camRight = this.subVector3(this.rotationToDirection(rotRight), this.rotationToDirection(rotLeft));
        let camUp = this.subVector3(this.rotationToDirection(rotUp), this.rotationToDirection(rotDown));

        let rollRad = -this.degToRad(camRot.y);

        let camRightRoll = this.subVector3(this.mulVector(camRight, Math.cos(rollRad)),
                this.mulVector(camUp, Math.sin(rollRad)));
        let camUpRoll = this.addVector3(this.mulVector(camRight, Math.sin(rollRad)),
                this.mulVector(camUp, Math.cos(rollRad)));

        let point3D = this.addVector3(
                this.addVector3(this.addVector3(camPos, this.mulVector(camForward, 10.0)), camRightRoll), camUpRoll);

        let point2D = this.worldToScreen(point3D);

        if (point2D === undefined) {
            return this.addVector3(camPos, this.mulVector(camForward, 10.0));
        }

        let point3DZero = this.addVector3(camPos, this.mulVector(camForward, 10.0));
        let point2DZero = this.worldToScreen(point3DZero);

        if (point2DZero === undefined) {
            return this.addVector3(camPos, this.mulVector(camForward, 10.0));
        }

        let eps = 0.001;

        if (Math.abs(point2D.x - point2DZero.x) < eps || Math.abs(point2D.y - point2DZero.y) < eps) {
            return this.addVector3(camPos, this.mulVector(camForward, 10.0));
        }

        let scaleX = (relX - point2DZero.x) / (point2D.x - point2DZero.x);
        let scaleY = (relY - point2DZero.y) / (point2D.y - point2DZero.y);
        let point3Dret = this.addVector3(this.addVector3(this.addVector3(camPos, this.mulVector(camForward, 10.0)),
                this.mulVector(camRightRoll, scaleX)), this.mulVector(camUpRoll, scaleY));

        return point3Dret;
    }
}