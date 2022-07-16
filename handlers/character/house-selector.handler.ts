import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {EventModule} from "../../modules/event.module";
import {CameraModule} from "../../modules/camera.module";
import {LoggerModule} from "../../modules/logger.module";
import {NotificationModule} from "../../modules/notification.module";
import {on, onGui, onServer} from "../../decorators/events";
import {Vector3} from "../../extensions/vector3.extensions";
import {MathModule} from "../../modules/math.module";
import {HouseModule} from "../../modules/house.module";
import {CharCreatorModule} from "../../modules/char-creator.module";
import {HouseInterface} from "@interfaces/house.interface";
import {CharacterCreatorPurchaseType} from "@enums/character-creator-purchase.type";
import {UID} from "../../helpers";
import {NotificationTypes} from "@enums/notification.types";

@foundation() @singleton()
export class HouseSelectorHandler {
    private houses: HouseInterface[]
    private currentIndex: number = 0;
    private currentHouseId: number = -1;
    private currentHouseIndex: number = -1;
    private stayedOnBuyedHouse: boolean = false;
    private cameraState: number = 0;
    private helicopterCamInt: number = 0;

    public constructor(private readonly camera: CameraModule, private readonly notification: NotificationModule, private readonly logger: LoggerModule, private readonly event: EventModule, private readonly math: MathModule, private readonly house: HouseModule, private readonly charCreator: CharCreatorModule) {
    }

    @onServer("houseselector:reset")
    @on("disconnect")
    public onReset(): void {
        this.currentIndex = 0;
        this.currentHouseId = -1;
        this.currentHouseIndex = -1;
        this.cameraState = 0;

        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }

        this.camera.destroyCamera();
    }

    @onServer("houseselector:open")
    public onOpen(maxPoints: number): void {
        this.houses = this.house.getHouses.filter(
                h => h.southCentralPoints <= maxPoints && h.ownerId === -1 && h.houseType === 0);
        this.selectHouse(this.houses[this.currentIndex]);
    }

    @onServer("houseselector:updatechunk")
    public onUpdate(houses: HouseInterface[]): void {
        // When the current house is no longer in the list of available houses.
        const currentHouse = houses.find(h => h.id == this.currentHouseId);
        if (currentHouse.ownerId && currentHouse.id !== this.currentHouseId) {
            this.notification.sendNotification({
                type: NotificationTypes.ERROR,
                text: "Diese Immobilie wurde gerade gekauft, tut uns leid. Die Auswahl an Immobilien wird in Echtzeit kalkuliert."
            });

            this.stayedOnBuyedHouse = true;
            this.event.emitGui("houseselector:block", true);
        } else {
            if (this.stayedOnBuyedHouse) {
                this.notification.sendNotification({
                    type: NotificationTypes.INFO, text: "Diese Immobilie wurde wieder auf dem Markt freigegeben."
                });

                this.event.emitGui("houseselector:block", false);
            }
        }

        this.houses = houses;
    }

    @onServer("houseselector:select")
    public onSelect(houseId: number): void {
        this.currentHouseIndex = this.houses.findIndex(h => h.id === houseId);
        this.currentHouseId = houseId;

        const houseData = this.houses.find(h => h.id === houseId);
        this.stayedOnBuyedHouse = false;

        this.charCreator.resetTypePurchaseOrders(CharacterCreatorPurchaseType.HOUSE);
        this.charCreator.addPurchase({
            id: UID(),
            type: CharacterCreatorPurchaseType.HOUSE,
            name: `${houseData.streetName} ${houseData.subName} ${houseData.houseNumber}`,
            description: "Eine Immobilie",
            southCentralPoints: houseData.southCentralPoints,
            removeable: true,
            orderedVehicle: null
        });

        this.event.emitGui("houseselector:select", houseData);
    }

    @onGui("houseselector:close")
    public onClose(): void {
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }
        this.stayedOnBuyedHouse = false;
    }

    @onGui("houseselector:change")
    public onChange(direction: number): void {
        this.currentIndex += direction;

        if (this.currentIndex < 0) {
            this.currentIndex = this.houses.length - 1;
        }

        if (this.currentIndex > this.houses.length - 1) {
            this.currentIndex = 0;
        }

        this.selectHouse(this.houses[this.currentIndex]);
    }

    @onGui("houseselector:tryselect")
    public onTrySelect(houseId: number): void {
        this.event.emitServer("houseselector:tryselect", houseId);
    }

    @onGui("houseselector:show")
    public onShow(): void {
        this.selectHouse(this.houses[this.currentHouseIndex]);
    }

    @onGui("houseselector:remove")
    public onRemove(): void {
        this.charCreator.resetTypePurchaseOrders(CharacterCreatorPurchaseType.HOUSE);

        this.event.emitServer("houseselector:unselect");
        this.event.emitGui("houseselector:select", null);
    }

    @onGui("houseselector:changecamera")
    public onChangeCamera(state: number): void {
        this.cameraState = state;

        const houseData = this.houses.find(h => h.id === this.currentHouseId);
        this.selectHouse(houseData);
    }

    private selectHouse(houseData: HouseInterface): void {
        const doorPos = new alt.Vector3(houseData.positionX, houseData.positionY, houseData.positionZ + 1);
        const rot = new alt.Vector3(this.math.radToDeg(houseData.roll), this.math.radToDeg(houseData.pitch),
                this.math.radToDeg(houseData.yaw));
        const dir = this.math.rotationToDirection(rot);
        const camPos = new alt.Vector3((dir.x * 3) + houseData.positionX, (dir.y * 3) + houseData.positionY,
                houseData.positionZ + 2);

        this.updateCamera(camPos, doorPos);

        this.currentHouseId = houseData.id;
        this.stayedOnBuyedHouse = false;

        this.updateInfo(houseData);
    }

    private updateCamera(camPos: alt.Vector3, doorPos: alt.Vector3) {
        if (this.helicopterCamInt) {
            alt.clearInterval(this.helicopterCamInt);
            this.helicopterCamInt = null;
        }

        if (this.cameraState === 0) {
            this.createDoorCam(camPos, doorPos);
        } else if (this.cameraState === 1) {
            this.createHelicopterCam(doorPos);
        }
    }

    private createDoorCam(camPos: Vector3, doorPos: Vector3): void {
        this.camera.createCamera(camPos, new Vector3(0, 0, 0));
        this.camera.pointAt(doorPos);
    }

    private createHelicopterCam(doorPos: Vector3): void {
        let angle = 0;
        const p = this.math.getPointAtPoint(doorPos, 30, angle);
        this.camera.createCamera(new Vector3(p.x, p.y, doorPos.z + 15), new Vector3(0, 0, 0));
        this.camera.pointAt(new Vector3(doorPos.x, doorPos.y, doorPos.z - 3));

        this.helicopterCamInt = alt.setInterval(() => {
            const p = this.math.getPointAtPoint(doorPos, 30, angle);

            this.camera.setPos(new Vector3(p.x, p.y, doorPos.z + 15));
            this.camera.pointAt(new Vector3(doorPos.x, doorPos.y, doorPos.z - 3));

            angle += 0.0009;
        }, 10);
    }

    private updateInfo(houseData: HouseInterface): void {
        houseData.streetName = this.house.getStreet(houseData.streetDirection,
                new alt.Vector3(houseData.positionX, houseData.positionY, houseData.positionZ));
        this.event.emitGui("houseselector:sethouseinfo", houseData);
    }
}