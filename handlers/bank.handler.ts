import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {Player} from "@extensions/player.extensions";
import {GuiModule} from "../modules/gui.module";

@foundation() @singleton()
export class BankHandler {

    constructor(private readonly event: EventModule, private readonly gui: GuiModule, private readonly player: Player) {
    }

    @onServer("atm:openmenu")
    public onOpenMenu(): void {
        this.player.openMenu();
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();

        this.event.emitGui("atm:openmenu");
    }
}