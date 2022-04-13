import {AnimationFlag} from "./animation.flag";

export class AnimationOptions {
    public speed?: number = 3;
    public speedMultiplier?: number = -8;
    public duration?: number = -1;
    public flag?: AnimationFlag;
    public playbackRate?: number = 0;
    public lockX?: boolean = false;
    public lockY?: boolean = false;
    public lockZ?: boolean = false;
}