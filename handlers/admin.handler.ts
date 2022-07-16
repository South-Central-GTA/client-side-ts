import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {on, onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {Player} from "@extensions/player.extensions";
import {GuiModule} from "../modules/gui.module";
import {AccountModule} from "../modules/account.module";
import {KeyCodes} from "@enums/keycode.type";

@foundation() @singleton()
export class AdminHandler {
    private isMenuOpen: boolean = false;

    constructor(private readonly event: EventModule, private readonly player: Player, private readonly gui: GuiModule, private readonly account: AccountModule) {
    }

    @on("keydown")
    public onKeydown(key: number): void {
        if (this.player.isInAPrison || !this.player.isSpawnedCharacter || !this.player.isControlsEnabled) {
            return;
        }

        if (key === KeyCodes.F11) {
            if (this.isMenuOpen || this.player.getIsAnyMenuOpen) {
                this.setMenuState(false);
            } else {
                this.event.emitServer("admin:requestmenu");
            }
        }
    }

    @onServer("admin:showmenu")
    private onShowMenu(): void {
        this.setMenuState(true);
    }

    private setMenuState(state: boolean): void {
        if (!this.player.isSpawnedCharacter) {
            return;
        }

        if (this.player.getIsAnyMenuOpen && !this.isMenuOpen || this.player.getIsInventoryOpen) {
            return;
        }

        this.isMenuOpen = state;

        if (state) {
            this.player.openMenu();
        } else {
            this.player.closeMenu();
        }
        this.player.blockGameControls(this.isMenuOpen);

        if (this.isMenuOpen) {
            this.player.showCursor();
            this.gui.focusView();
        } else {
            this.player.hideCursor();
            this.gui.unfocusView();
        }

        this.event.emitGui("adminmenu:toggle", this.isMenuOpen);
    }
}