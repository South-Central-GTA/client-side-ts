import {GuiModule} from "../modules/gui.module";
import {singleton} from "tsyringe";
import {EventModule} from "../modules/event.module";
import {foundation} from "../decorators/foundation";
import {Player} from "@extensions/player.extensions";

@foundation() @singleton()
export class TutorialHandler {
    public constructor(private readonly player: Player, private readonly event: EventModule, private readonly gui: GuiModule) {
    }
}
