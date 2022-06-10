import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {LoggerModule} from "../../modules/logger.module";
import {onGui, onServer} from "../../decorators/events";
import {Player} from "../../extensions/player.extensions";
import {GuiModule} from "../../modules/gui.module";
import {EventModule} from "../../modules/event.module";
import {NotificationModule} from "../../modules/notification.module";
import {MathModule} from "../../modules/math.module";
import alt from "alt-client";

@foundation() @singleton()
export class GasStationHandler {
    private distanceCheckInt: number = 0;

    constructor(private readonly logger: LoggerModule, private readonly notification: NotificationModule, private readonly player: Player, private readonly gui: GuiModule, private readonly event: EventModule, private readonly math: MathModule) {
    }

    @onServer("gasstation:openrefuelmenu")
    private onOpenRefuelMenu(maxPossibleFuel: number, fuelPrice: number): void {
        this.player.openMenu();
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();

        this.event.emitGui("gasstation:openrefuelmenu", maxPossibleFuel, fuelPrice);
    }

    @onServer("gasstation:startdistancecheck")
    private onStartDistanceCheck(): void {
        const cachedPlayerPos = alt.Player.local.pos;

        this.distanceCheckInt = alt.setInterval(() => {
            if (this.math.distance(alt.Player.local.pos, cachedPlayerPos) > 30) {
                // If player is to far away from gas station.

                this.event.emitServer("gasstation:playerleftarea");
                alt.clearInterval(this.distanceCheckInt);
            }
        }, 1000);
    }

    @onServer("gasstation:stopdistancecheck")
    private onStopDistanceCheck(): void {
        alt.clearInterval(this.distanceCheckInt);
    }

    @onGui("gasstation:close")
    private onCloseMenu(): void {
        this.player.closeMenu();
        this.player.unfreeze();
        this.player.hideCursor();
        this.gui.unfocusView();
    }
}