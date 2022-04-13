import * as native from "natives";
import * as alt from "alt-client";
import { singleton, container } from "tsyringe";
import { EventModule } from "./event.module";
import { InputType } from "../enums/input.type";
import { IContextMenu } from "../interfaces/contextmenu.interface";
import { ActionInterface } from "../interfaces/action.interface";
import { Player } from "../extensions/player.extensions";
import { UpdateModule } from "./update.module";
import { MathModule } from "./math.module";
import {CameraModule} from "./camera.module";
import {GuiModule} from "./gui.module";
@singleton()
export class ContextModule {
    get getIsOpen() {
        return this.isOpen;
    } 
    
    private lastX: number;
    private lastY: number;
    private everyTickRef: string;
    private endPoint: alt.Vector3;
    private isOpen: boolean; 

    constructor(
        private readonly event: EventModule,
        private readonly player: Player,
        private readonly update: UpdateModule,
        private readonly math: MathModule,
        private readonly camera: CameraModule,
        private readonly gui: GuiModule) { }

    public open(title: string, actions: ActionInterface[], useLastPos: boolean = false, onCenter: boolean = false): void {
        const [_, width, height] = native.getActiveScreenResolution(0, 0);

        if (!useLastPos) {
            this.lastX = width * native.getControlNormal(0, InputType.CURSOR_X);
            this.lastY = height * native.getControlNormal(0, InputType.CURSOR_Y);
        }

        if (onCenter) {
            const [_, x, y] = native.getActiveScreenResolution(0, 0);
            const pos = new alt.Vector3(x * 0.5, y * 0.5, 0);

            this.lastX = pos.x;
            this.lastY = pos.y;
        }

        const contextMenu: IContextMenu = {
            title: title,
            x: this.lastX,
            y: this.lastY,
            actions: actions
        };

        this.isOpen = true;
        this.event.emitGui("contextmenu:setup", contextMenu);
    }

    public close(): void {
        if (this.everyTickRef) {
            this.update.remove(this.everyTickRef);
            this.everyTickRef = null;
        }

        this.endPoint = undefined;
        this.player.hideCursor();
        this.gui.unfocusView();
        this.isOpen = false;
        this.event.emitGui("contextmenu:close");
    }
}