import {BlipColor, BlipSprite} from "alt-shared";
import {Vector3} from "@extensions/vector3.extensions";
import alt from "alt-client";
import {BlipType} from "@enums/blip.type";

export interface BlipInterface {
    id: number;
    sprite: BlipSprite;
    color: BlipColor;
    position: Vector3
    scale: number;
    radius: number;
    name: string;
    shortRange: boolean;
    blipType: BlipType;
    player?: alt.Player;

    //clientside
    handle: alt.Blip;
}