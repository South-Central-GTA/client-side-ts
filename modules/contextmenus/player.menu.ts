import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {LoggerModule} from "../logger.module";
import {EventModule} from "../event.module";

@foundation() @singleton()
export class PlayerMenu {
    constructor(private readonly logger: LoggerModule, private readonly event: EventModule) {
    }

    public interact(entityId: number) {
        this.event.emitServer("playeractions:get");
    }
}