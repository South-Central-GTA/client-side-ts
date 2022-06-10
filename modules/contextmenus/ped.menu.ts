import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {LoggerModule} from "../logger.module";
import * as alt from "alt-client";
import * as native from "natives";
import {EventModule} from "../event.module";
import {Player} from "../../extensions/player.extensions";

@foundation() @singleton()
export class PedMenu {

    constructor(private readonly logger: LoggerModule, private readonly event: EventModule) {
    }

    public interact(entityId: number): void {
        const targetPlayer = alt.Player.all.find(x => x.scriptID === entityId) as Player;
        let targetPlayerId = -1;
        if (targetPlayer) {
            targetPlayerId = targetPlayer.getSyncedMeta<number>("ID");
        }

        this.event.emitServer("pedactions:get", native.getEntityModel(entityId), targetPlayerId);
    }
}