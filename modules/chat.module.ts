import * as native from "natives";
import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {EventModule} from "./event.module";
import {FreeCamModule} from "./free-cam.module";
import {Player} from "@extensions/player.extensions";
import {UpdateModule} from "./update.module";
import {InputType} from "@enums/input.type";
import {GuiModule} from "./gui.module";
import {MessageInterface} from "@interfaces/message.interface";

@singleton()
export class ChatModule {
    public ready: boolean = false;
    public inputActive: boolean = false;
    public chatVisible: boolean = false;
    public showTimestamp: boolean = false;

    private updateId: string;

    constructor(private readonly event: EventModule, private readonly freecam: FreeCamModule, private readonly player: Player, private readonly gui: GuiModule, private readonly update: UpdateModule) {
    }

    public openChat(): void {
        if (!this.chatVisible || this.inputActive || this.player.getIsAnyTextOpen || this.player.getIsAnyTextOpen) return;

        if (this.freecam.isActive) {
            this.freecam.freeze();
        }

        this.player.showCursor();
        this.player.blockESC(true);
        this.gui.focusView();

        this.setChatInput(true);
    }

    public closeChat(delay: number = 0): void {
        if (!this.chatVisible) return;

        this.player.blockESC(false);
        this.setChatInput(false, delay);
    }

    public sendMessage(message: MessageInterface): void {
        this.event.emitGui("chat:pushmessage", message);
    }

    public toggleChatVisibility(): void {
        this.chatVisible = !this.chatVisible;
        this.event.emitGui("chat:togglevisibility", this.chatVisible);
    }

    public toggleTimestamp(): void {
        this.showTimestamp = !this.showTimestamp;
        this.event.emitGui("chat:toggletimestamp", this.showTimestamp);
    }

    public setChatInput(state: boolean, delay: number = 0): void {
        this.player.setIsChatting = state;
        this.inputActive = state;

        if (state) {
            if (!this.updateId) {
                this.updateId = this.update.add(() => this.toggleActions(false));
            }

            this.player.blockGameControls(true);
        } else {
            alt.setTimeout(() => {
                if (!this.player.getIsInventoryOpen && !this.player.getIsPhoneOpen) {
                    this.player.hideCursor();
                    this.gui.unfocusView();
                }

                this.update.remove(this.updateId);
                this.updateId = null;
                this.player.blockGameControls(false);
                this.toggleActions(true);
            }, delay);
        }

        this.event.emitGui("chat:toggleinput", this.inputActive);
    }

    private toggleActions(allowed: boolean) {
        native.disableControlAction(0, InputType.ENTER, allowed);
        native.disableControlAction(0, InputType.VEH_EXIT, allowed);
    }
}