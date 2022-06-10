import {IVector3} from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";

@singleton()
export class BlipModule {

    public constructor() {
    }

    public createBlip(position: IVector3, color: number, sprite: number, text: string, longRangeVisible: boolean = true): number {
        const blip = native.addBlipForCoord(position.x, position.y, position.z);
        native.setBlipSprite(blip, sprite);
        native.setBlipNameFromTextFile(blip, text);
        native.setBlipColour(blip, color);
        native.setBlipDisplay(blip, longRangeVisible ? 2 : 8);
        native.setBlipAsShortRange(blip, !longRangeVisible);

        return blip;
    }

    public createBlipForEntity(target: number, color: number, sprite: number, text: string = null, longRangeVisible = true): number {
        const blip = native.addBlipForEntity(target);
        native.setBlipSprite(blip, sprite);
        native.setBlipNameFromTextFile(blip, text);
        native.setBlipColour(blip, color);
        native.setBlipDisplay(blip, longRangeVisible ? 2 : 8);

        return blip;
    }

    public destroyBlipForEntity(target: number): void {
        const blip = native.getBlipFromEntity(target);
        if (native.doesBlipExist(blip)) {
            native.removeBlip(blip);
        }
    }

    public destroyBlip(blipId: number): void {
        if (native.doesBlipExist(blipId)) {
            native.removeBlip(blipId);
        }
    }
}