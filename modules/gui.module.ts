import { singleton} from "tsyringe";
import {WebView} from "../extensions/web-view.extensions";
import {LoggerModule} from "./logger.module";
import {EventModule} from "./event.module";
import {Player} from "../extensions/player.extensions";
import alt from "alt-client";

@singleton()
export class GuiModule {
    private webview: WebView = undefined;

    constructor(
        private readonly logger: LoggerModule,
        private readonly event: EventModule,
        private readonly player: Player) { }

    public createView(url: string): void {
        this.webview = new WebView(url, true);

        this.webview.on("gui:ready", () => {
            alt.setTimeout(() => {
                this.event.emit("gui:ready");
                this.logger.info("WebViewModule: GUI is ready to use.");
            }, 100);
        });

        this.logger.info("WebViewModule: Create single-instance of south central ui.");
    }

    public focusView(): void {
        this.webview.focus();
    }

    public unfocusView(force: boolean = false): void {
        if (!force) {
            if (this.player.getIsInventoryOpen || this.player.getIsPhoneOpen || this.player.getIsAnyMenuOpen) {
                return;
            }
        }

        this.webview.unfocus();
    }

    public guiEmit(name: string, ...args: any[]): void {
        this.webview.emit(name, ...args)
    }

    public guiOn(name: string, callback: (...args: any[]) => void): void {
        this.webview.on(name, callback);
    }
}