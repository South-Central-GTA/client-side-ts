import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {on, onGui, onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {AnimationModule} from "../modules/animation.module";
import {KeyCodes} from "@enums/keycode.type";
import {Player} from "@extensions/player.extensions";
import {GuiModule} from "../modules/gui.module";
import {AnimationInterface} from "@interfaces/animation.interface";
import {FreeCamModule} from "../modules/free-cam.module";
import {DeathState} from "@enums/death.state";
import {AnimationOptions} from "@enums/animation.options";
import {METAKEY_STREAM_SYNC} from "data/custom-player-stream-synced-meta.interface";
import alt from "alt-client";

@foundation() @singleton()
export class AnimationWheelHandler {
    private isMenuOpen: boolean = false;
    private playerAnimations: AnimationInterface[] = [];

    constructor(private readonly event: EventModule, private readonly animation: AnimationModule, private readonly player: Player, private readonly gui: GuiModule, private readonly freecam: FreeCamModule) {
    }

    @on("keydown")
    public onKeydown(key: number): void {
        if (key === KeyCodes.U) {
            if (this.isMenuOpen) {
                this.setMenuState(false);
            } else {
                const deathState = alt.Player.local.getStreamSyncedMeta(METAKEY_STREAM_SYNC.DEATH_STATE);

                if (this.player.getIsAnyMenuOpen || this.player.isInAPrison || !this.player.isSpawnedCharacter || this.freecam.isActive || this.player.getIsChatting || this.player.getIsAnyTextOpen || this.player.hasInteractionOpen || deathState === DeathState.DEAD) {
                    return;
                }

                this.event.emitServer("animationswheel:requestmenu");
            }
        }
    }

    @onServer("animationwheel:showmenu")
    private onShowAnimationWheel(animations: AnimationInterface[]): void {
        this.playerAnimations = animations;

        this.setMenuState(true);
    }

    @onGui("animationwheel:requestanim")
    private async onRequestAnim(animationId: number): Promise<void> {
        const animation = this.playerAnimations.find(pa => pa.id === animationId);
        const loaded = await this.animation.load(animation.dictionary);

        if (loaded) {
            const options: AnimationOptions = {
                flag: animation.flags
            };

            this.animation.play(animation.dictionary, animation.clip, options);
        }

        this.setMenuState(false);
    }

    @onGui("animationwheel:stopanim")
    private onAnimationWheelClear(): void {
        this.animation.clear()
        this.setMenuState(false);
    }

    private setMenuState(state: boolean): void {
        this.isMenuOpen = state;
        if (state) {
            this.player.openMenu();
        } else {
            this.player.closeMenu();
        }
        this.player.blockGameControls(this.isMenuOpen);

        if (this.isMenuOpen) {
            this.player.showCursor();
            this.gui.focusView();

            this.event.emitGui("animationwheel:setanimations", this.playerAnimations);
        } else {
            this.player.hideCursor();
            this.gui.unfocusView();
        }

        this.event.emitGui("animationwheel:toggle", this.isMenuOpen);
    }
}