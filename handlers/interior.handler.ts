import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {LoggerModule} from "../modules/logger.module";
import {Player} from "@extensions/player.extensions";
import {GuiModule} from "../modules/gui.module";
import {EventModule} from "../modules/event.module";
import {NotificationModule} from "../modules/notification.module";
import {onServer} from "../decorators/events";

@foundation() @singleton()
export class InteriorHandler {
    private oldInterior: number = 0;
    private intervalId: number | undefined;

    constructor(private readonly logger: LoggerModule, private readonly notification: NotificationModule, private readonly player: Player, private readonly gui: GuiModule, private readonly event: EventModule) {
    }

    @onServer("character:spawn")
    private startTracking(): void {
        if (this.intervalId) {
            alt.clearInterval(this.intervalId);
        }

        this.intervalId = alt.setInterval(() => this.interval(), 500);
    }

    private interval(): void {
        const currInterior = native.getInteriorFromEntity(alt.Player.local.scriptID);
        // this.logger.info("currInterior: " + currInterior);

        if (!this.player.getIsInInterior && currInterior !== 0) {
            this.player.setIsInInterior = true;
            this.event.emitServer("interior:enter", currInterior);

            this.oldInterior = currInterior;
        } else {
            if (currInterior != this.oldInterior) {
                this.player.setIsInInterior = false;

                this.event.emitServer("interior:left", currInterior);

                this.oldInterior = 0;
            }
        }
    }
}