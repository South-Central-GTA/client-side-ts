import {AnimationFlag} from "@enums/animation.flag";

export interface AnimationInterface {
    id: number;
    dictionary: string;
    clip: string;
    name: string;
    flags: AnimationFlag;
}
