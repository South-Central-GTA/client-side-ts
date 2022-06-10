import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {CountdownModule} from "../modules/countdown.module";

@foundation() @singleton()
export class CountdownHandler {

    constructor(private readonly countdown: CountdownModule) {
    }

    @onServer("countdown:create")
    public onCreate(idString: string, serverEvent: string, duration: number): void {
        this.countdown.create(idString, serverEvent, duration);
    }

    @onServer("countdown:destroy")
    public onDestroy(idString: string): void {
        this.countdown.destroy(idString);
    }
}