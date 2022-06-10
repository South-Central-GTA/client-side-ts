import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {SubTitleModule} from "../modules/sub-title.module";
import {onServer} from "../decorators/events";

@foundation() @singleton()
export class SubTitleHandler {

    constructor(private readonly subtitle: SubTitleModule) {
    }

    @onServer("subtitle:draw")
    public draw(message: string, durationInMs: number): void {
        this.subtitle.draw(message, durationInMs);
    }

    @onServer("subtitle:clera")
    public clear(): void {
        this.subtitle.clear();
    }
}