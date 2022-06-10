import {singleton} from "tsyringe";
import {EventModule} from "../modules/event.module";
import {onServer} from "../decorators/events";
import {foundation} from "../decorators/foundation";
import {Player} from "@extensions/player.extensions";
import {LoggerModule} from "../modules/logger.module";
import {DefinedJobDataInterface} from "@interfaces/definedjob/defined-job-data.interface";
import {DefinedJobInterface} from "@interfaces/definedjob/defined-job.interface";

@foundation() @singleton()
export class DefinedJobHandler {

    public constructor(private readonly player: Player, private readonly event: EventModule, private readonly logger: LoggerModule) {
    }

    @onServer("definedjob:openmenu")
    public openMenu(jobs: DefinedJobDataInterface[], playerDefinedJob: DefinedJobInterface): void {
        this.event.emitGui("jobmenu:setup", jobs, playerDefinedJob);
    }
}
