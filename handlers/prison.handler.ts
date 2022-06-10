import * as alt from "alt-client";

import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onGui, onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {Player} from "@extensions/player.extensions";
import {LoggerModule} from "../modules/logger.module";
import {CameraModule} from "../modules/camera.module";
import {GuiModule} from "../modules/gui.module";
import {MarkerModule} from "../modules/marker.module";
import {BlipModule} from "../modules/blip.module";
import {UpdateModule} from "../modules/update.module";
import {MathModule} from "../modules/math.module";

@foundation() @singleton()
export class PrisonHandler {
    private int: number | undefined;
    private jailedUntilDateJson: string;

    constructor(private readonly event: EventModule, private readonly logger: LoggerModule, private readonly camera: CameraModule, private readonly gui: GuiModule, private readonly marker: MarkerModule, private readonly blip: BlipModule, private readonly update: UpdateModule, private readonly math: MathModule, private readonly player: Player) {
    }

    @onServer("prison:start")
    private onStart(jailedUntilDateJson: string): void {
        this.jailedUntilDateJson = jailedUntilDateJson;

        this.event.emitGui("gui:routeto", "prison");
        this.gui.focusView();

        this.player.fadeIn(500);
        this.player.unblurScreen(500);
        this.player.hideRadarAndHud();

        this.player.hideCursor();
        this.player.freeze();
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.setVisible(false);
        this.player.blockGameControls(true);

        this.camera.createCamera(new alt.Vector3(373.87396, -1564.259, 46.396183),
                new alt.Vector3(-23.543306, -0, 175.2406));

        this.player.isInAPrison = true;

        this.int = alt.setInterval(() => {
            this.event.emitServer("prison:checktime");
        }, 30000);
    }

    @onServer("prison:stop")
    private onStop(): void {
        this.event.emitGui("gui:routeto", "game");
        this.gui.unfocusView();

        this.player.lockCamera(false);
        this.player.unfreeze();
        this.player.hideCursor();
        this.player.setVisible(true);
        this.player.blockGameControls(false);
        this.camera.destroyCamera();

        this.player.isInAPrison = false;

        if (this.int === undefined) {
            alt.clearInterval(this.int);
            this.int = undefined;
        }
    }

    @onGui("prison:ready")
    private OnUiReady(): void {
        this.event.emitGui("prison:start", this.jailedUntilDateJson);
    }

    @onGui("prison:requestcharacterselection")
    private onRequestCharacterSelection(): void {
        this.event.emitServer("prison:requestcharacterselection");
    }
}