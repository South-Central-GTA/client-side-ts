import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import alt from "alt-client";
import {AnimationModule} from "modules/animation.module";
import {AnimationFlag} from "@enums/animation.flag";

@foundation() @singleton()
export class LockpickingHandler {
    constructor(private readonly event: EventModule, private readonly animation: AnimationModule) {
    }

    @onServer("lockpicking:start")
    public async onStart(dbId: number): Promise<void> {
        await this.animation.load("amb@medic@standing@kneel@idle_a");
        this.animation.play("amb@medic@standing@kneel@idle_a", "idle_a", {
            flag: AnimationFlag.Loop
        }, false);
        
        alt.setTimeout(() => {
            this.animation.clear(true);
            this.event.emitServer("lockpicking:requestpick", dbId);
        }, 3000);
    }
}