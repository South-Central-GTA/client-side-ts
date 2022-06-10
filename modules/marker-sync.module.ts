import * as native from "natives";
import {singleton} from "tsyringe";
import {Vector3} from "@extensions/vector3.extensions";
import {MarkerType} from "@enums/marker.type";
import {UpdateModule} from "./update.module";
import {ServerMarkerInterfaces} from "@interfaces/server-marker.interface";
import {RGBAInterface} from "@interfaces/rgba.interface";
import {Player} from "@extensions/player.extensions";
import {TextModule} from "./text.module";
import {DateModule} from "./date.module";
import {LoggerModule} from "./logger.module";

@singleton()
export class MarkerSyncModule {
    private markers: ServerMarkerInterfaces[] = [];

    public constructor(private readonly update: UpdateModule, private readonly player: Player, private readonly text: TextModule, private readonly date: DateModule, private readonly logger: LoggerModule) {
        this.update.add(() => {
            for (const key in this.markers) {
                const marker = this.markers[key];
                if (marker.onDisplay) {
                    native.drawMarker(marker.markerType, marker.position.x, marker.position.y, marker.position.z,
                            marker.direction.x, marker.direction.y, marker.direction.z, marker.rotation.x,
                            marker.rotation.y, marker.rotation.z, marker.scale.x, marker.scale.y, marker.scale.z,
                            marker.color.red, marker.color.green, marker.color.blue, marker.color.alpha,
                            marker.bobUpDown, false, 2, false, undefined, undefined, false);

                    if (marker.text.length !== 0) {
                        this.text.drawText3dWithDistance(marker.text, marker.position.x, marker.position.y,
                                marker.position.z + 1, 0.4, 0, 255, 255, 255, 175, false, true, 10);
                    }

                    if (this.player.isAduty && marker.ownerName && marker.createdAtJson) {
                        this.text.drawText3dWithDistance(
                                `Erstellt von: ${marker.ownerName}\nErstellt um: ${this.date.getDate(
                                        marker.createdAtJson)}`, marker.position.x, marker.position.y,
                                marker.position.z + 0.5, 0.4, 0, marker.color.red, marker.color.green,
                                marker.color.blue, 255, false, true, 5);
                    }
                }
            }
        });
    }

    public add(id: number, markerType: MarkerType, position: Vector3, direction: Vector3, rotation: Vector3, scale: Vector3, color: RGBAInterface, bobUpDown: boolean, text: string, ownerName: string, createdAtJson: string): void {

        this.remove(id);
        this.clear(id);

        this.markers[id] = {
            id: id,
            markerType: markerType,
            position: position,
            direction: direction,
            rotation: rotation,
            scale: scale,
            color: color,
            onDisplay: true,
            bobUpDown: bobUpDown,
            text: text,
            ownerName: ownerName,
            createdAtJson: createdAtJson
        };
    }

    public restore(id: number) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].onDisplay = true;
        }
    }

    public remove(id: number) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].onDisplay = false;
        }
    }

    public clear(id: number) {
        if (this.markers.hasOwnProperty(id)) {
            delete this.markers[id];
        }
    }

    public clearAll() {
        this.markers = [];
    }

    public setBobUpDown(id: number, bobUpDown: boolean = false) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].bobUpDown = bobUpDown;
        }
    }

    public setColor(id: number, color: RGBAInterface) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].color = color;
        }
    }

    public setScale(id: number, scale: Vector3) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].scale = scale;
        }
    }

    public setDirection(id: number, direction: Vector3) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].direction = direction;
        }
    }

    public setRotation(id: number, rotation: Vector3) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].rotation = rotation;
        }
    }

    public setPosition(id: number, position: Vector3) {
        if (this.markers.hasOwnProperty(id)) {
            this.markers[id].position = position;
        }
    }
}