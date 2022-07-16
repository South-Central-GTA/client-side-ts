import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {on, onGui, onServer} from "../decorators/events";
import {Player} from "@extensions/player.extensions";
import {LoggerModule} from "../modules/logger.module";
import {EventModule} from "../modules/event.module";
import {KeyCodes} from "@enums/keycode.type";
import {InteractModule} from "../modules/interact.module";
import {ContextModule} from "../modules/context.module";
import {ActionInterface} from "@interfaces/action.interface";

@foundation() @singleton()
export class ContextMenuHandler {
    public constructor(private readonly interact: InteractModule, private readonly player: Player, private readonly logger: LoggerModule, private readonly event: EventModule, private readonly contextMenu: ContextModule) {
    }

    @on("keydown")
    public onKeydown(key: number): void {
        if (key === KeyCodes.ALT) {
            if (this.player.isInAPrison || !this.player.isSpawnedCharacter || !this.player.isControlsEnabled || this.player.hasInteractionOpen) {
                this.logger.info("this.player.isInAPrison: " + this.player.isInAPrison);
                this.logger.info("this.player.isSpawnedCharacter: " + this.player.isSpawnedCharacter);
                this.logger.info("this.player.isControlsEnabled: " + this.player.isControlsEnabled);
                this.logger.info("this.player.hasInteractionOpen: " + this.player.hasInteractionOpen);
                return;
            }
            
            this.interact.startInteract();
        }
    }

    @on("keyup")
    public keyup(key: number): void {
        if (this.player.isInAPrison || !this.player.isSpawnedCharacter || !this.player.isControlsEnabled) {
            return;
        }

        if (key === KeyCodes.ALT) {
            if (this.player.hasInteractionOpen) {
                this.interact.stopInteraction();
            }
        }
    }

    @onServer("contextmenu:open")
    public onOpen(title: string, actions: ActionInterface[]): void {
        this.contextMenu.open(title, actions);
    }

    @onGui("contextmenu:selectaction")
    public onSelectAction(action: ActionInterface): void {
        this.event.emitServer(action.event, action.customData);
        this.contextMenu.close();
    }
}