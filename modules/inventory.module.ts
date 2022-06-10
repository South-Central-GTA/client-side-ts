import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {EventModule} from "./event.module";
import {UpdateModule} from "./update.module";
import {Player} from "@extensions/player.extensions";
import {InventoryInterface} from "@interfaces/inventory/inventory.interface";
import {LoggerModule} from "./logger.module";
import {getGroundZ} from "../helpers";
import {InventoryDropInterface} from "@interfaces/inventory/inventory-drop.interface";
import {MathModule} from "./math.module";
import {NotificationModule} from "./notification.module";
import {GuiModule} from "./gui.module";
import {FreeCamModule} from "./free-cam.module";

@singleton()
export class InventoryModule {
    public inventories: InventoryInterface[] = [];

    public blocked: boolean = false;

    public constructor(private readonly event: EventModule, private readonly update: UpdateModule, private readonly gui: GuiModule, private readonly player: Player, private readonly logger: LoggerModule, private readonly math: MathModule, private readonly notification: NotificationModule, private readonly freecam: FreeCamModule) {
    }

    public setup(inventories: InventoryInterface[]): void {
        this.inventories = inventories;
    }

    public open(): void {
        if (this.player.getIsAnyMenuOpen || this.player.isInAPrison || !this.player.isSpawnedCharacter || this.freecam.isActive || this.player.isInvBlocked || this.player.getIsAnyTextOpen) {
            return;
        }

        this.event.emitServer("inventory:request");
    }

    public close(): void {
        if (!this.player.getIsInventoryOpen || this.blocked) return;

        this.player.setIsInventoryOpen = false;

        this.gui.unfocusView();

        this.player.hideCursor();
        this.player.lockCamera(false);
        this.player.blockGameControls(false);
        this.blocked = false;

        this.event.emitGui("inventory:toggleui", false);

        alt.setTimeout(() => {
            this.player.blockESC(false);
        }, 100);
    }

    public splitItem(itemId: number, amountToSplit: number): void {
        this.event.emitServer("inventory:splititem", itemId, amountToSplit);
    }

    public giveItemToCharacter(characterId: number, itemId: number) {
        this.event.emitServer("item:giveitemtocharacter", characterId, itemId);
    }

    public swapItem(draggingItemId: number, droppedItemId: number): void {
        this.event.emitServer("inventory:swapitem", draggingItemId, droppedItemId);
    }

    public switchItem(invId: number, itemId: number): void {
        this.event.emitServer("inventory:switchitem", invId, itemId);
    }

    public placeItem(itemId: number): void {
        const local = alt.Player.local;
        const frontPos = this.math.getEntityFrontPosition(local.scriptID, 0.5);
        const pos = new alt.Vector3(frontPos.x, frontPos.y, local.pos.z - 1);
        const z = getGroundZ(pos.x, pos.y, pos.z, 10);
        const itemPosition = new alt.Vector3(pos.x, pos.y, z);

        if (this.math.distance(alt.Player.local.pos, itemPosition) > 2) {
            return;
        }

        const inventoryDrop: InventoryDropInterface = {
            itemId: itemId, position: itemPosition
        }

        this.event.emitServer("placeableitem:place", JSON.stringify(inventoryDrop));
    }
}