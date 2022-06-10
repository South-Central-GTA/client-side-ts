import {EventModule} from "../modules/event.module";
import {Player} from "@extensions/player.extensions";
import {KeyCodes} from "@enums/keycode.type";
import {foundation} from "../decorators/foundation";
import {singleton} from "tsyringe";
import {on, onServer} from "../decorators/events";
import {GuiModule} from "../modules/gui.module";
import {LoggerModule} from "../modules/logger.module";
import {PlayerInterface} from "@interfaces/player.interface";

@foundation() @singleton()
export class PlayersListHandler {
    private isMenuOpen: boolean = false;

    public constructor(private readonly event: EventModule, private readonly player: Player, private readonly gui: GuiModule, private readonly logger: LoggerModule,) {
    }

    @on("keydown")
    public onKeydown(key: number): void {
        if (!this.player.isSpawnedCharacter) {
            return;
        }

        if (key === KeyCodes.O) {
            if (this.isMenuOpen) {
                this.setMenuState(false);
            } else {
                if (this.player.getIsAnyTextOpen) {
                    return;
                }

                this.event.emitServer("playerslist:requestmenu");
            }
        }
    }

    @onServer("playerslist:show")
    private onShowMenu(players: []): void {
        this.setMenuState(true, players);
    }

    private setMenuState(state: boolean, players: PlayerInterface[] = []): void {
        if (this.player.getIsAnyMenuOpen && !this.isMenuOpen) {
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

        this.event.emitGui("playerslist:toggle", this.isMenuOpen, players);
    }
}
