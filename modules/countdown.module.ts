import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {EventModule} from "./event.module";

@singleton()
export class CountdownModule {
    private countdowns: Map<string, number> = new Map();

    public constructor(private readonly event: EventModule) {
    }

    public create(id: string, serverEvent: string, duration: number): void {
        this.countdowns.set(id, alt.setTimeout(() => {
            this.event.emitServer(serverEvent);
        }, duration));
    }

    public destroy(id: string): void {
        const timeout = this.countdowns.get(id);
        alt.clearTimeout(timeout);
        this.countdowns.delete(id);
    }
} 