import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {LoggerModule} from "../../modules/logger.module";
import {onServer} from "../../decorators/events";
import {Player} from "../../extensions/player.extensions";
import {GuiModule} from "../../modules/gui.module";
import {EventModule} from "../../modules/event.module";
import {NotificationModule} from "../../modules/notification.module";
import {CatalogItemInterface} from "@interfaces/inventory/catalog-item.interface";

@foundation() @singleton()
export class AmmunationHandler {

    constructor(private readonly logger: LoggerModule, private readonly notification: NotificationModule, private readonly player: Player, private readonly gui: GuiModule, private readonly event: EventModule) {
    }

    @onServer("ammunation:openmenu")
    public onOpenMenu(buyableItems: CatalogItemInterface[]): void {
        if (!this.player.getIsInInterior) {
            return;
        }

        this.player.openMenu();
        this.player.freeze();
        this.player.showCursor();
        this.gui.focusView();

        this.event.emitGui("ammunation:openmenu", buyableItems);
    }
}