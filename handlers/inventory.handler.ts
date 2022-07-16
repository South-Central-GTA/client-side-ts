import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {EventModule} from "../modules/event.module";
import {KeyCodes} from "@enums/keycode.type";
import {on, onGui, onServer} from "../decorators/events";
import {Player} from "@extensions/player.extensions";
import {InventoryModule} from "../modules/inventory.module";
import {FreeCamModule} from "../modules/free-cam.module";
import {GuiModule} from "../modules/gui.module";
import {UpdateModule} from "../modules/update.module";
import alt from "alt-client";
import {MathModule} from "../modules/math.module";
import {Vector3} from "@extensions/vector3.extensions";
import {LoggerModule} from "../modules/logger.module";
import {InventoryInterface} from "@interfaces/inventory/inventory.interface";
import {InventoryType} from "@enums/inventory.type";

@foundation() @singleton()
export class InventoryHandler {
    private ready: boolean = false;
    private tickId: string | undefined;
    private openPosition: Vector3;

    public constructor(private readonly event: EventModule, private readonly player: Player, private readonly inventory: InventoryModule, private readonly freecam: FreeCamModule, private readonly gui: GuiModule, private readonly update: UpdateModule, private readonly math: MathModule, private readonly logger: LoggerModule) {
    }

    @on("keydown")
    public onKeydown(key: number): void {
        if (!this.ready || this.player.getIsAnyTextOpen) return;

        if (key === KeyCodes.I) {
            if (!this.player.getIsInventoryOpen) {
                this.inventory.open();
            } else {
                this.event.emitServer("inventory:requestclose");
            }
        }

        if (key === KeyCodes.ESCAPE) {
            if (this.player.getIsChatting) {
                return;
            }

            if (!this.player.getIsInventoryOpen) return;

            this.event.emitServer("inventory:requestclose");
        }
    }

    @onServer("inventory:open")
    public onInventoryOpen(inventories: InventoryInterface[]): void {
        this.player.lockCamera(true);
        this.player.blockESC(true);
        this.player.setIsInventoryOpen = true;
        this.player.showCursor();
        
        this.gui.focusView();
        this.event.emitGui("inventory:toggleui", true);
        
        if (inventories.some(
                i => i.inventoryType === InventoryType.GROUP_MEMBER || i.inventoryType === InventoryType.VEHICLE || i.inventoryType === InventoryType.FRISK)) {
            this.openPosition = alt.Player.local.pos;
            this.tickId = this.update.add(() => this.tick());
        }

        this.onInventoryUpdate(inventories);
    }

    @onServer("inventory:update")
    public onInventoryUpdate(inventories: InventoryInterface[]): void {
        this.inventory.setup(inventories);

        if (this.ready) {
            this.event.emitGui("inventory:setup", this.inventory.inventories);
        }
    }

    @onGui("inventory:ready")
    public onInventoryLoaded(): void {
        this.ready = true;
        this.event.emitGui("inventory:setup", this.inventory.inventories);
    }

    @onGui("inventory:splititem")
    public onSplitItem(itemId: number, amountToSplit: number): void {
        this.inventory.splitItem(itemId, amountToSplit);
    }

    @onGui("inventory:noteitem")
    public onNoteItem(itemId: number, note: string): void {
        this.event.emitServer("inventory:noteitem", itemId, note);
    }

    @onGui("inventory:renameitem")
    public onRenameItem(itemId: number, newName: string): void {
        this.event.emitServer("inventory:renameitem", itemId, newName);
    }

    @onGui("item:giveitemtocharacter")
    public onGiveItemToCharacter(characterId: number, itemId: number): void {
        this.inventory.giveItemToCharacter(characterId, itemId);
    }

    @onGui("inventory:swapitem")
    public onSwapItem(draggedItemId: number, droppedItemId: number): void {
        this.inventory.swapItem(draggedItemId, droppedItemId);
    }

    @onGui("inventory:switchitem")
    public onSwitchItem(invId: number, itemId: number): void {
        this.inventory.switchItem(invId, itemId);
    }

    @onGui("item:placeonground")
    public onItemPlace(itemId: number): void {
        this.inventory.placeItem(itemId);
    }

    @onServer("inventory:close")
    private onClose(): void {
        this.inventory.close();

        if (this.tickId !== undefined) {
            this.update.remove(this.tickId);
            this.tickId = undefined;
        }
    }

    private tick(): void {
        if (this.math.distance(alt.Player.local.pos, this.openPosition) > 0.5) {
            this.event.emitServer("inventory:requestclose");
        }
    }
}
