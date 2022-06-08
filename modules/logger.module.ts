import * as alt from "alt-client";
import {singleton} from "tsyringe";

@singleton()
export class LoggerModule {

    info(...messages: any[]) {
        alt.log(...messages);
    }

    warning(...messages: any[]) {
        alt.logWarning(...messages);
    }

    error(...messages: any[]) {
        alt.logError(...messages);
    }
}