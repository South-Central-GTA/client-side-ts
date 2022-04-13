import { singleton } from "tsyringe";
import { foundation } from "../decorators/foundation";
import { GuiModule } from "../modules/gui.module";
import {on, onGui, onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";

@foundation()
@singleton()
export class WebviewHandler {
    public constructor(
        private readonly gui: GuiModule,
        private readonly event: EventModule) { }

    @onServer("webview:create")
    public create(url: string): void {
        this.gui.createView(url);
    }

    @on()
    public guiOn(name: string, callback: (...args: any[]) => void) {
        this.gui.guiOn(name, callback);
    }

    @on()
    public guiEmit(name: string, ...args: any[]) {
        this.gui.guiEmit(name, ...args);
    }

    @onGui("gui:emitserver")
    public guiEmitToServer(name: string, ...args: any[]) {
        this.event.emitServer(name, ...args);
    }

    @onServer("gui:emit")
    public guiEmitFromServer(name: string, ...args: any[]) {
        this.gui.guiEmit(name, ...args);
    }
}