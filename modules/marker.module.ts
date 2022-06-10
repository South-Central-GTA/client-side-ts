import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {MarkerInterface} from "@interfaces/marker.interface";
import {MathModule} from "./math.module";
import {Player} from "@extensions/player.extensions";

@singleton()
export class MarkerModule {

    public constructor(private readonly math: MathModule, private readonly player: Player) {
    }

    public drawMarkerWithDistance(marker: MarkerInterface, distance: number = 5): void {
        if (this.math.distance(alt.Player.local.pos,
                new alt.Vector3(marker.positionX, marker.positionY, marker.positionZ)) <= distance) {
            this.drawMarker(marker);
        }
    }

    public drawMarker(marker: MarkerInterface): void {
        native.drawMarker(marker.type, marker.positionX, marker.positionY, marker.positionZ, 0, 0, 0, 0, 0, 0,
                marker.sizeX, marker.sizeY, marker.sizeZ, marker.red, marker.green, marker.blue, marker.alpha,
                marker.bobUpAndDown, false, 2, false, undefined, undefined, false);
    }
}