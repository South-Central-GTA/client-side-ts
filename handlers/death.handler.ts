import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {EventModule} from "../modules/event.module";
import {AnimationModule} from "../modules/animation.module";
import {on, onServer} from "../decorators/events";
import alt from "alt-client";
import native from "natives";
import {DeathState} from "@enums/death.state";
import {UpdateModule} from "../modules/update.module";
import {LoggerModule} from "../modules/logger.module";
import {METAKEY_STREAM_SYNC} from "data/custom-player-stream-synced-meta.interface";

@foundation() @singleton()
export class DeathHandler {
    private tick: string | undefined;

    constructor(private readonly event: EventModule, private readonly animation: AnimationModule, private readonly update: UpdateModule, private readonly logger: LoggerModule,) {
    }

    @on("streamSyncedMetaChange")
    private async onStreamSyncedMetaChange(entity: alt.Entity, key: string, value: any, oldValue: any): Promise<void> {
        if (!entity.hasStreamSyncedMeta("DEATH_STATE")) {
            return
        }

        const deathState = alt.Player.local.getStreamSyncedMeta(METAKEY_STREAM_SYNC.DEATH_STATE);
    }

    @onServer("death:start")
    private async onStart(): Promise<void> {
        native.setPedCanBeTargetted(alt.Player.local.scriptID, false);
        native.setEntityInvincible(alt.Player.local.scriptID, true);
        native.setPedCanRagdoll(alt.Player.local.scriptID, true);
        alt.setTimeout(() => {
            native.freezeEntityPosition(alt.Player.local.scriptID, true);
        }, 1000);
    }

    @onServer("death:revive")
    private async onRevive(): Promise<void> {
        native.setPedCanBeTargetted(alt.Player.local.scriptID, true);
        native.setEntityInvincible(alt.Player.local.scriptID, false);
        native.setPedCanRagdoll(alt.Player.local.scriptID, true);
        alt.setTimeout(() => {
            native.freezeEntityPosition(alt.Player.local.scriptID, false);
        }, 1000);
    }
}