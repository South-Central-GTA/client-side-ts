import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {MathModule} from "./math.module";

@singleton()
export class PericoIslandModule {
    private islandPos: alt.Vector3 = new alt.Vector3(4895.28, -5744.58, 26.351);
    private loaded: boolean = false;

    public constructor(private readonly math: MathModule) {
    }

    public loadIsland(): void {
        //let dist = this.math.distance(this.islandPos, alt.Player.local.pos);
        //if (dist <= 2000 && !this.loaded) {
        //    // @ts-ignore
        //    native.setIplSetEnabled('HeistIsland', true);
        //    this.loaded = true;
        //}
        //else if (dist > 2000 && this.loaded) {
        //    // @ts-ignore
        //    native.setIplSetEnabled('HeistIsland', false);
        //    this.loaded = false;
        //}
    }
}