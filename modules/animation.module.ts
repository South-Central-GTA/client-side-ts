import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {AnimationOptions} from "@enums/animation.options";

@singleton()
export class AnimationModule {
    private dicts = new Map();
    private cancelable: boolean = false;
    
    public constructor() {
    }

    /**
     * Load and cache animations
     *
     * @param {string} dict
     * @returns {Promise<boolean>}
     */
    public load(dict: string): Promise<boolean> {
        return new Promise((resolve) => {

            if (this.dicts.has(dict)) {
                return resolve(true);
            }

            native.requestAnimDict(dict);

            let interval = alt.setInterval(() => {
                if (native.hasAnimDictLoaded(dict)) {
                    this.dicts.set(dict, true);
                    alt.clearInterval(interval);
                    return resolve(true);
                }
            }, 10);
        });
    }

    /**
     * Play Animation for current player
     */
    public play(dict: string, clip: string, options: AnimationOptions = {}, cancelable: boolean = true): void {
        const defaultOptions = new AnimationOptions();
        options = {...defaultOptions, ...options};
        
        this.cancelable = cancelable;

        native.taskPlayAnim(alt.Player.local.scriptID, dict, clip, options.speed, options.speedMultiplier,
                options.duration, options.flag, options.playbackRate, options.lockX, options.lockY, options.lockZ,);
    }

    public clear(force: boolean = false): void {
        if (!this.cancelable && !force) {
            return;
        }
        
        native.clearPedTasks(alt.Player.local.scriptID);
    }

    public isPlaying(dict: string, clip: string): boolean {
        return native.isEntityPlayingAnim(alt.Player.local.scriptID, dict, clip, 3);
    }
}