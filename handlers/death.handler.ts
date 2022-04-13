import { singleton } from "tsyringe";
import { foundation } from "../decorators/foundation";
import { EventModule } from "../modules/event.module";
import {AnimationModule} from "../modules/animation.module";
import {on} from "../decorators/events";
import alt from "alt-client";
import native from "natives";
import {DeathState} from "../enums/death.state";

@foundation() 
@singleton()
export class DeathHandler {
    constructor(
        private readonly event: EventModule,
        private readonly animation: AnimationModule) { }

    @on("streamSyncedMetaChange")
    private onStreamSyncedMetaChange(entity: alt.Entity, key: string, value: any, oldValue: any): void {
        if (!entity.hasStreamSyncedMeta("DEATH_STATE")) {
            return
        }

        const deathState = entity.getStreamSyncedMeta("DEATH_STATE");

        native.setEntityInvincible(entity.scriptID, deathState === DeathState.DEAD);
    }
}