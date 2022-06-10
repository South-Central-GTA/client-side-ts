import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {BlipModule} from "../modules/blip.module";
import {UpdateModule} from "../modules/update.module";
import {WaypointModule} from "../modules/waypoint.module";

@foundation() @singleton()
export class WaypointHandler {
    constructor(private readonly blip: BlipModule, private readonly update: UpdateModule, private readonly waypoint: WaypointModule) {
    }

    @onServer("waypoint:set")
    public onSet(x: number, y: number, z: number, color: number, sprite: number): void {
        this.waypoint.set(x, y, z, color, sprite);
    }

    @onServer("waypoint:clear")
    public onClear(): void {
        this.waypoint.destroy();
    }
}