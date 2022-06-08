import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EventModule} from "../../modules/event.module";
import {onServer, on, onGui} from "../../decorators/events";
import {CameraModule} from "../../modules/camera.module";
import {UpdateModule} from "../../modules/update.module";
import {VehicleModule} from "../../modules/vehicle.module";
import {NotificationModule} from "../../modules/notification.module";
import {CharCreatorModule} from "../../modules/char-creator.module";
import {LoggerModule} from "../../modules/logger.module";
import {loadModel, UID} from "../../helpers";
import {CatalogVehicleInterface} from "@interfaces/vehicles/catalog-vehicle.interface";
import {NotificationTypes} from "@enums/notification.types";
import {CharacterCreatorPurchaseType} from "@enums/character-creator-purchase.type";

@foundation()
@singleton()
export class VehicleSelectorHandler {
    private updateId: string;
    private showcaseVehicle: number = null;
    private currentIndex: number = 0;
    private vehicles: CatalogVehicleInterface[] = [];

    public constructor(
        private readonly camera: CameraModule,
        private readonly event: EventModule,
        private readonly update: UpdateModule,
        private readonly vehicle: VehicleModule,
        private readonly logger: LoggerModule,
        private readonly notification: NotificationModule,
        private readonly charCreator: CharCreatorModule
    ) {
    }

    @onServer("vehicleselector:open")
    public async onOpen(vehicles: CatalogVehicleInterface[]): Promise<void> {
        this.createCamera();

        this.vehicles = vehicles;

        if (this.vehicles.length > 0) {
            await this.changeVehicle(this.vehicles[this.currentIndex]);

            if (this.updateId) {
                this.update.remove(this.updateId);
                this.updateId = null;
            }

            this.updateId = this.update.add(() => this.tick());
        }
    }

    @onGui("vehicleselector:close")
    @on("disconnect")
    public close(): void {
        this.update.remove(this.updateId);
        this.updateId = null;

        native.deleteVehicle(this.showcaseVehicle);
        this.showcaseVehicle = null;
        this.currentIndex = 0;
    }

    @onGui("vehicleselector:change")
    public onChange(direction: number): void {
        this.currentIndex += direction;

        if (this.currentIndex < 0) {
            this.currentIndex = this.vehicles.length - 1;
        }

        if (this.currentIndex > this.vehicles.length - 1) {
            this.currentIndex = 0;
        }

        this.changeVehicle(this.vehicles[this.currentIndex]);

        alt.setTimeout(() => {
            this.event.emitGui("vehicleselector:unlocksetfree");
        }, 500);
    }

    @onGui("vehicleselector:order")
    public onOrder(model: string): void {
        const vehicle: CatalogVehicleInterface = this.vehicles.find(
            (v) => v.model === model
        );

        if (this.charCreator.orderVehicleLimit()) {
            this.notification.sendNotification({
                type: NotificationTypes.ERROR,
                text: "Du kannst nicht mehr als zwei Fahrzeuge bestellen.",
            });
            return;
        }

        this.charCreator.addPurchase({
            id: UID(),
            type: CharacterCreatorPurchaseType.VEHICLE,
            name: vehicle.displayName,
            description: `Fahrzeug Klasse: ${vehicle.displayClass}`,
            southCentralPoints: vehicle.southCentralPoints,
            removeable: true,
            orderedVehicle: vehicle,
        });
    }

    private createCamera(): void {
        const pos = new alt.Vector3(
            171.6923065185547,
            -1000.2988891601562,
            -98.0146484375
        );
        const rot = new alt.Vector3(-20, 0, 200);

        this.camera.createCamera(pos, rot, 60);
    }

    private async changeVehicle(vehicle: CatalogVehicleInterface): Promise<void> {
        if (this.showcaseVehicle) {
            native.deleteVehicle(this.showcaseVehicle);
            this.showcaseVehicle = null;
        }

        await this.createVehicle(vehicle).then(() => {
            this.updateStats(vehicle);
            this.updateInfo(vehicle);
        });
    }

    private async createVehicle(vehicle: CatalogVehicleInterface): Promise<void> {
        if (this.showcaseVehicle) return;

        const hash = alt.hash(vehicle.model);
        await loadModel(hash);

        this.showcaseVehicle = this.vehicle.createShowcaseVehicle(
            hash,
            173.129,
            -1004.294,
            -100.0,
            -12.533,
            111,
            111
        );
    }

    private updateStats(vehicle: CatalogVehicleInterface): void {
        if (!this.showcaseVehicle) return;

        const vehicleClass = native.getVehicleClass(this.showcaseVehicle);

        const speed = native.getVehicleEstimatedMaxSpeed(this.showcaseVehicle);
        const maxSpeed = native.getVehicleClassEstimatedMaxSpeed(vehicleClass);
        const speedPercent = (speed / maxSpeed) * 100;

        const acceleration = native.getVehicleAcceleration(this.showcaseVehicle);
        const maxAcceleration = native.getVehicleClassMaxAcceleration(vehicleClass);
        const accelerationPercent = (acceleration / maxAcceleration) * 100;

        const breaks = native.getVehicleMaxBraking(this.showcaseVehicle);
        const maxBreaks = native.getVehicleClassMaxBraking(vehicleClass);
        const breaksPercent = (breaks / maxBreaks) * 100;

        const vehicleStats = {
            speed: speedPercent,
            acceleration: accelerationPercent,
            breaks: breaksPercent,
        };

        const hash = alt.hash(vehicle.model);
        const vehicleName = native.getDisplayNameFromVehicleModel(hash);
        const localName = native.getLabelText(vehicleName);

        this.event.emitGui("vehicle:updatestats", vehicleStats, localName);
    }

    private updateInfo(vehicle: CatalogVehicleInterface): void {
        this.event.emitGui("vehicleselector:setvehicleinfo", vehicle);
    }

    private tick(): void {
        if (!this.showcaseVehicle) return;

        let heading = native.getEntityHeading(this.showcaseVehicle);
        let newHeading = (heading += 0.1);

        const rot = new alt.Vector3(0, 0, newHeading);
        native.setEntityRotation(
            this.showcaseVehicle,
            rot.x,
            rot.y,
            rot.z,
            0,
            false
        );
    }
}
