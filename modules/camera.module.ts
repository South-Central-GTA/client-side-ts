import * as alt from "alt-client";
import {IVector3} from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {LoggerModule} from "./logger.module";

@singleton()
export class CameraModule {
    private camera: number | undefined;
    private isCamMoving: boolean;

    public constructor(private logger: LoggerModule) {
    }

    get hasCamera() {
        return this.camera !== undefined;
    }

    get getCamera() {
        return this.camera;
    }

    get camPos() {
        return native.getCamCoord(this.camera);
    }

    get camRot() {
        return native.getCamRot(this.camera, 0);
    }

    public createCamera(pos: alt.Vector3, rot: alt.Vector3 = new alt.Vector3(0, 0, 0), fov: number = 70): void {
        if (this.camera) {
            this.destroyCamera();
        }

        native.setFocusPosAndVel(pos.x, pos.y, pos.z, 0.0, 0.0, 0.0);
        native.setHdArea(pos.x, pos.y, pos.z, 30)

        this.camera = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
        native.setCamActive(this.camera, true);
        native.renderScriptCams(true, true, 0, false, false, 0);
        native.setCamCoord(this.camera, pos.x, pos.y, pos.z);
        native.setCamRot(this.camera, rot.x, rot.y, rot.z, 0);
        native.setCamFov(this.camera, fov);
    }

    public destroyCamera(): void {
        native.renderScriptCams(false, false, 0, false, false, 0);

        if (this.camera !== undefined && native.doesCamExist(this.camera)) {
            native.destroyCam(this.camera, true);
        }

        native.setFollowPedCamViewMode(1);
        native.clearFocus();
        native.clearHdArea();
        this.camera = undefined;
    }

    public moveCamera(pos: alt.Vector3, rot: alt.Vector3 = new alt.Vector3(0, 0,
            0), duration: number = 1000, override: boolean = false): void {
        if (this.isCamMoving && !override) return;

        const targetPosCam = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
        native.setCamCoord(targetPosCam, pos.x, pos.y, pos.z);
        native.setCamRot(targetPosCam, rot.x, rot.y, rot.z, 0);

        native.setFocusPosAndVel(pos.x, pos.y, pos.z, 0.0, 0.0, 0.0);
        native.setHdArea(pos.x, pos.y, pos.z, 30)

        native.setCamActiveWithInterp(targetPosCam, this.camera, duration, 0, 0);
        this.isCamMoving = true;

        alt.setTimeout(() => {
            native.setCamCoord(this.camera, pos.x, pos.y, pos.z);
            native.setCamRot(this.camera, rot.x, rot.y, rot.z, 0);
            native.destroyCam(targetPosCam, true);

            this.isCamMoving = false;
        }, duration + 10);
    }

    public setPos(pos: IVector3): void {
        native.setCamCoord(this.camera, pos.x, pos.y, pos.z);
        native.setFocusPosAndVel(pos.x, pos.y, pos.z, 0.0, 0.0, 0.0);
        native.setHdArea(pos.x, pos.y, pos.z, 30)
    }

    public pointAt(pos: alt.Vector3): void {
        native.pointCamAtCoord(this.camera, pos.x, pos.y, pos.z);
    }
}