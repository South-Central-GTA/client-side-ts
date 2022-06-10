import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onGui} from "../decorators/events";
import {Player} from "@extensions/player.extensions";
import {GuiModule} from "../modules/gui.module";

@foundation() @singleton()
export class MenuHandler {

    constructor(private readonly player: Player, private readonly gui: GuiModule) {
    }

    @onGui("menu:close")
    public onClose(): void {
        this.player.closeMenu();
        this.player.unfreeze();
        this.player.hideCursor();
        this.gui.unfocusView();
    }
}