import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {AnimationModule} from "../modules/animation.module";
import {AnimationOptions} from "@enums/animation.options";

@foundation() @singleton()
export class AnimationsHandler {
    constructor(private readonly event: EventModule, private readonly animation: AnimationModule) {
    }

    @onServer("animation:play")
    private async onPlay(dictionary: string, clip: string, options: AnimationOptions = {}): Promise<void> {
        const loaded = await this.animation.load(dictionary);
        if (loaded) {
            this.animation.play(dictionary, clip, options);
        }
    }

    @onServer("animation:clear")
    private onClear(): void {
        this.animation.clear()
    }
}