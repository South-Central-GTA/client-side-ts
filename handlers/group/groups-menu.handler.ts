import * as alt from "alt-client";
import * as native from "natives";
import { singleton } from "tsyringe";
import { foundation } from "../../decorators/foundation";
import { onServer, onGui, on } from "../../decorators/events";
import { EventModule } from "../../modules/event.module";
import { Player } from "../../extensions/player.extensions";

@foundation()
@singleton()
export class GroupsMenuHandler {
    constructor(
        private readonly event: EventModule,
        private readonly player: Player) { }

    @onGui("companymenu:leavegroup")
    public onLeaveCompany(id: number): void {
        this.event.emitServer("companymenu:leavegroup", id);
    } 
}