import * as native from "natives";
import {singleton} from "tsyringe";

@singleton()
export class SubTitleModule {
    public constructor() {
    }

    public draw(text: string, durationInMs: number = 5000): void {
        native.beginTextCommandPrint('STRING');
        native.addTextComponentSubstringPlayerName(text);
        native.endTextCommandPrint(durationInMs, true);
    }

    public clear(): void {
        native.beginTextCommandPrint('STRING');
        native.addTextComponentSubstringPlayerName("");
        native.endTextCommandPrint(0, true);
    }
}