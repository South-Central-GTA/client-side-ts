import alt from "alt-client";
import native from "natives";
import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {on, onGui, onServer} from "../decorators/events";
import {CameraModule} from "modules/camera.module";
import {Player} from "@extensions/player.extensions";
import {EventModule} from "modules/event.module";
import {GuiModule} from "modules/gui.module";
import {VehicleServiceInfoDataInterface} from "@interfaces/vehicles/vehicle-service-info-data.interface";
import {VehicleModType} from "@enums/vehicle-mod.type";
import {LoggerModule} from "modules/logger.module";
import {UpdateModule} from "modules/update.module";
import {InputType} from "@enums/input.type";
import {VehicleModule} from "modules/vehicle.module";
import {loadModel} from "helpers";

@foundation() @singleton()
export class VehicleServiceHandler {
    private data: VehicleServiceInfoDataInterface;
    private primColor: number = 0;
    private secColor: number = 0;
    private isRotating: boolean;
    private dir: number;
    private everyTickRef: string;
    private showcaseVehicle: number | undefined = undefined;

    constructor(
            private readonly camera: CameraModule, 
            private readonly player: Player, 
            private readonly event: EventModule,
            private readonly logger: LoggerModule,
            private readonly update: UpdateModule,
            private readonly gui: GuiModule,
            private readonly vehicle: VehicleModule) {
    }
    
    @onServer("vehicleservice:start")
    private async onStart(data: VehicleServiceInfoDataInterface): Promise<void> {
        this.data = data;

        this.player.isSpawnedCharacter = false;
        this.player.showCursor();
        this.player.hideRadarAndHud(true);

        
        this.event.emitGui("gui:routeto", "vehicleservice");
        this.gui.focusView();
        
        await this.createVehicle(data);

        this.update.remove(this.everyTickRef);
        this.everyTickRef = this.update.add(() => this.tick());
    }
    
    @onServer("vehicleservice:updateproducts")
    private onUpdateProducts(products: number): void {
        this.data.productCount = products;
        this.event.emitGui("vehicleservice:updateproducts", products);
    }
    
    @onGui("vehicleservice:ready")
    private onReady(): void {
        this.event.emitGui("vehicleservice:setup", this.data);
    }
    
    @onGui("vehicleservice:close")
    private onClose(): void {
        this.close();
        
        this.event.emitServer("vehicleservice:close");
    }
    
    @onGui("vehicleservice:requestpurchase")
    private onRequestPurchase(orderJson: string): void {
        this.close();
        
        this.event.emitServer("vehicleservice:requestpurchase", orderJson);
    }
    
    @onGui("vehicleservice:updatetuningpart")
    private onUpdateTuningPart(type: VehicleModType, value: number): void {
        if (this.showcaseVehicle === undefined) {
            return;
        }
        
        if (type === VehicleModType.Colour1) {
            this.primColor = value;
        }
        
        if (type === VehicleModType.Colour2) {
            this.secColor = value;
        }
        
        if (type === VehicleModType.Colour1 || type === VehicleModType.Colour2) {
            native.setVehicleColours(this.showcaseVehicle, this.primColor, this.secColor);
        }
        
        native.setVehicleMod(this.showcaseVehicle, type, value, false);
    }

    @onGui("vehicleservice:rotate")
    public onRotate(dir: number): void {
        this.isRotating = true;
        this.dir = dir;
    }

    @onGui("vehicleservice:rotatestop")
    public onRotateStop(): void {
        this.isRotating = false
    }

    private tick(): void {
        if (this.isRotating) {
            if (this.showcaseVehicle === undefined) {
                return;
            }

            let heading = native.getEntityHeading(this.showcaseVehicle);
            const newHeading = (heading += this.dir);

            native.setEntityHeading(this.showcaseVehicle, newHeading);
        }

        const scriptID = alt.Player.local.scriptID;
        native.setEntityAlpha(scriptID, 0, false);
        native.setEntityCollision(scriptID, false, false);
        native.freezeEntityPosition(scriptID, true);
        native.setPedCanBeTargetted(scriptID, false);
        native.removeAllPedWeapons(scriptID, true);
        
        native.disableControlAction(0, InputType.NEXT_CAMERA, true);

        const rightClicked = native.getDisabledControlNormal(0, InputType.AIM);
        if (rightClicked) {
            this.player.hideCursor();
        } else {
            this.player.showCursor();
        }
    }
    
    private async createVehicle(data: VehicleServiceInfoDataInterface): Promise<void> {
        if (this.showcaseVehicle) {
            return;
        }
        
        const hash = alt.hash(data.vehicleModelName);
        await loadModel(hash);

        const pos = alt.Player.local.pos;
        this.showcaseVehicle = this.vehicle.createShowcaseVehicle(hash, pos.x, pos.y, pos.z, 0, data.primaryColor, data.secondaryColor);

        native.networkSetInSpectatorMode(true, this.showcaseVehicle);
    }
    
    private close(): void {
        this.camera.destroyCamera();

        this.player.isSpawnedCharacter = true;
        this.player.hideCursor();
        this.player.showRadarAndHud(true);

        native.resetEntityAlpha(alt.Player.local.scriptID);
        native.setEntityCollision(alt.Player.local.scriptID, true, true);
        native.freezeEntityPosition(alt.Player.local.scriptID, false);

        this.event.emitGui("gui:routeto", "game");
        this.gui.unfocusView();

        native.deleteVehicle(this.showcaseVehicle);
        this.showcaseVehicle = undefined;
        this.update.remove(this.everyTickRef);
    }
}