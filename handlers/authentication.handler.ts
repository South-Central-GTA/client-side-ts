import * as alt from "alt-client";
import { GuiModule } from "../modules/gui.module";
import { singleton } from "tsyringe";
import { EventModule } from "../modules/event.module";
import { on, onServer, onGui } from "../decorators/events";
import { foundation } from "../decorators/foundation";
import { Player } from "../extensions/player.extensions";
                
@foundation()
@singleton()
export class AuthenticationHandler {
    constructor(
        private readonly player: Player,
        private readonly event: EventModule,
        private readonly gui: GuiModule) { }

    @on("gui:ready")
    public guiIsReady(): void {
        // Discord offline
        if (alt.Discord.currentUser === null) {
            this.player.fadeIn(500);
            this.event.emitGui("gui:routeto", "offline", alt.Player.local.name);
            return;
        }
        
        this.gui.focusView();
        this.player.showCursor();

        this.event.emitServer("auth:requestlogin", alt.Discord.currentUser.id);
    }

    @onServer("auth:showlogin")
    public onShowLogin(): void {
        this.player.fadeIn(500);
        this.event.emitGui("gui:routeto", "signin", alt.Player.local.name);
    }
    
    @onServer("auth:showsignup")
    public onShowRegister(): void {
        this.player.fadeIn(500);
        this.event.emitGui("gui:routeto", "signup", alt.Player.local.name);
    }
}
