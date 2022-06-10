import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onGui, onServer} from "../decorators/events";
import {Player} from "@extensions/player.extensions";
import {GuiModule} from "../modules/gui.module";
import {FactionType} from "@enums/faction.type";
import {EventModule} from "../modules/event.module";
import {LoggerModule} from "../modules/logger.module";

@foundation() @singleton()
export class MdcHandler {
    public constructor(private readonly player: Player, private readonly gui: GuiModule, private readonly event: EventModule, private readonly logger: LoggerModule,) {
    }

    @onServer("mdc:open")
    public onOpen(factionType: FactionType, canLogin: boolean, characterName: string, rankName: string): void {
        this.player.openMenu();
        this.player.setIsAnyTextFieldFocused = true;
        this.player.showCursor();
        this.player.blurScreen(250);
        this.gui.focusView();

        this.event.emitGui("mdc:open", factionType, canLogin, characterName, rankName);
    }

    @onGui("mdc:close")
    public onClose(): void {
        this.player.closeMenu();
        this.player.setIsAnyTextFieldFocused = false;
        this.player.hideCursor();
        this.player.unblurScreen(250);
        this.gui.unfocusView();

        this.event.emitGui("mdc:close");
    }
}