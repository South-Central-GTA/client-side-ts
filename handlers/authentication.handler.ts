import * as alt from "alt-client";
import {GuiModule} from "../modules/gui.module";
import {singleton} from "tsyringe";
import {EventModule} from "../modules/event.module";
import {on} from "../decorators/events";
import {foundation} from "../decorators/foundation";
import {Player} from "@extensions/player.extensions";

@foundation() @singleton()
export class AuthenticationHandler {
    constructor(private readonly player: Player, private readonly event: EventModule, private readonly gui: GuiModule) {
    }

    @on("gui:ready")
    public async guiIsReady(): Promise<void> {
        // Discord offline
        if (alt.Discord.currentUser === null) {
            this.player.fadeIn(500);
            this.event.emitGui("gui:routeto", "offline");
            return;
        }

        try {
            const token = await alt.Discord.requestOAuth2Token("621370292345765900");

            this.gui.focusView();
            this.player.showCursor();

            this.event.emitServer("auth:requestlogin", alt.Discord.currentUser.id, token);
        } catch {
            this.player.fadeIn(500);
            this.event.emitGui("gui:routeto", "offline");
        }
    }
}
