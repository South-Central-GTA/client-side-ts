import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {GuiModule} from "../modules/gui.module";
import {on, onGui, onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";

@foundation() @singleton()
export class WebviewHandler {
    public constructor(private readonly gui: GuiModule, private readonly event: EventModule) {
    }

    @onServer("webview:create")
    public create(url: string): void {
        this.gui.createView(url);
    }

    @on("webview:on")
    public onListen(name: string, callback: (...args: any[]) => void) {
        this.gui.guiOn(name, callback);
    }

    @onGui("webview:emitserver")
    public onEmitToServer(name: string, ...args: any[]) {
        this.event.emitServer(name, ...args);
    }

    @onServer("webview:emit") @on("webview:emit")
    public onEmit(name: string, ...args: any[]) {
        this.gui.guiEmit(name, ...args);
    }
}