import * as native from "natives";
import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {EventModule} from "./event.module";
import {InputType} from "@enums/input.type";
import {Player} from "@extensions/player.extensions";
import {UpdateModule} from "./update.module";
import {MathModule} from "./math.module";
import {RaycastResultInterface} from "@interfaces/raycastresult.interface";
import {RGBInterface} from "@interfaces/rgb.interface";
import {LoggerModule} from "./logger.module";
import {CameraModule} from "./camera.module";
import {GuiModule} from "./gui.module";
import {InVehicleMenu} from "./contextmenus/inVehicle.menu";
import {PlayerMenu} from "./contextmenus/player.menu";
import {PedMenu} from "./contextmenus/ped.menu";
import {ObjectMenu} from "./contextmenus/object.menu";
import {VehicleMenu} from "./contextmenus/vehicle.menu";
import {ContextModule} from "./context.module";
import {KeyCodes} from "@enums/keycode.type";

@singleton()
export class InteractModule {
    private MAX_DISTANCE: number = 2;

    private everyTickRef: string;
    private endPoint: alt.Vector3;
    private lastRaycast: number = Date.now();
    private clickCooldown: number = Date.now();
    private currentPlayerPos: alt.Vector3;

    constructor(private readonly event: EventModule, private readonly player: Player, private readonly update: UpdateModule, private readonly math: MathModule, private readonly camera: CameraModule, private readonly gui: GuiModule, private readonly logger: LoggerModule, private readonly inVehicleMenu: InVehicleMenu, private readonly playerMenu: PlayerMenu, private readonly pedMenu: PedMenu, private readonly objectMenu: ObjectMenu, private readonly vehicleMenu: VehicleMenu, private readonly contextMenu: ContextModule) {
    }

    public startInteract(): void {
        this.player.showCursor();
        
        if (this.everyTickRef) {
            this.update.remove(this.everyTickRef);
            this.everyTickRef = null;
        }

        this.everyTickRef = this.update.add(() => this.tick());
        

        this.player.hasInteractionOpen = true;
    }

    public stopInteraction(): void {
        this.contextMenu.close();
        this.player.hasInteractionOpen = false;

        if (this.everyTickRef) {
            this.update.remove(this.everyTickRef);
            this.everyTickRef = null;
        }
    }

    private tick(): void {
        this.drawMenu();

        if (!alt.isKeyDown(KeyCodes.ALT) || (this.contextMenu.getIsOpen && this.player.getIsAnyTextOpen)) {
            this.stopInteraction();
        }
    }

    private drawMenu(): void {
        const x = alt.getCursorPos().x;
        const y = alt.getCursorPos().y;

        if (Date.now() > this.lastRaycast) {
            this.lastRaycast = Date.now();

            const result = this.math.screenToWorld(x, y, 22);
            const entityType = native.getEntityType(result.entity);

            if (!result.isHit || entityType === 0) {
                this.endPoint = undefined;
                return;
            }

            this.endPoint = result.pos;
        }

        this.drawVisualLine();

        if (native.isDisabledControlJustPressed(0, InputType.AIM)) {
            if (Date.now() < this.clickCooldown) {
                return;
            }

            this.clickCooldown = Date.now() + 100;

            const result = this.math.screenToWorld(x, y, 22);
            const entityType = native.getEntityType(result.entity);

            if (!result.isHit || entityType === 0) {
                this.endPoint = undefined;
                return;
            }

            const rayCastInfo: RaycastResultInterface = {
                isHit: result.isHit, pos: result.pos, normal: result.normal, entity: result.entity,
            };

            if (this.math.distance(alt.Player.local.pos, rayCastInfo.pos) > this.MAX_DISTANCE) {
                return;
            }

            // We have to reset the ui.
            this.event.emitGui("contextmenu:close");

            this.gui.focusView();
            this.currentPlayerPos = alt.Player.local.pos;

            switch (entityType) {
                case 1:
                    this.openPedMenu(rayCastInfo.entity, rayCastInfo.pos);
                    break;
                case 2:
                    this.openVehicleMenu(rayCastInfo.entity, rayCastInfo.pos);
                    break;
                case 3:
                    this.openObjectMenu(rayCastInfo.entity, rayCastInfo.pos);
                    break;
            }
        }

        if (this.currentPlayerPos !== undefined) {
            if (this.math.distance(alt.Player.local.pos, this.currentPlayerPos) > 1) {
                this.event.emitGui("contextmenu:close");
            }
        }
    }

    private drawVisualLine(): void {
        if (this.endPoint === undefined) {
            return;
        }

        let lineColor: RGBInterface;

        if (this.math.distance(alt.Player.local.pos, this.endPoint) > this.MAX_DISTANCE) {
            lineColor = {red: 255, green: 25, blue: 25};
        } else {
            lineColor = {red: 255, green: 255, blue: 255};
        }

        native.drawLine(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, this.endPoint.x,
                this.endPoint.y, this.endPoint.z, lineColor.red, lineColor.green, lineColor.blue, 50);
    }

    private openPedMenu(entityId: number, coords: alt.Vector3): void {
        if (entityId === alt.Player.local.scriptID) {
            this.playerMenu.interact(entityId);
            return;
        } else {
            this.pedMenu.interact(entityId);
            return;
        }
    }

    private openObjectMenu(entityId: number, coords: alt.Vector3): void {
        if (alt.Player.local.vehicle) {
            return;
        }

        this.objectMenu.interact(entityId);
    }

    private openVehicleMenu(entityId: number, coords: alt.Vector3): void {
        if (alt.Player.local.vehicle) {
            this.inVehicleMenu.interact(alt.Player.local.vehicle);
            return;
        }
        
        this.vehicleMenu.interact(coords);
    }
}