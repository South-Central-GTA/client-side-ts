import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {MathModule} from "./math.module";
import {Vector3} from "@extensions/vector3.extensions";
import {Player} from "@extensions/player.extensions";

@singleton()
export class TextModule {

    public constructor(private readonly math: MathModule, private readonly player: Player) {
    }

    public drawText2d(message: string, posX: number, posY: number, scale: number, fontType: number, align: number, r: number, g: number, b: number, a: number, useOutline: boolean = true, useDropShadow: boolean = true) {
        native.beginTextCommandDisplayText('STRING');
        native.addTextComponentSubstringPlayerName(message);
        native.setTextFont(fontType);
        native.setTextScale(1, scale);
        native.setTextWrap(0.0, 1.0);
        native.setTextCentre(true);
        native.setTextColour(r, g, b, a);
        native.setTextJustification(align);

        if (useOutline) native.setTextOutline();

        if (useDropShadow) native.setTextDropShadow();

        native.endTextCommandDisplayText(posX, posY, 0);
    }

    public drawText3d(message: string, posX: number, posY: number, posZ: number, scale: number, fontType: number, r: number, g: number, b: number, a: number, useOutline: boolean = true, useDropShadow: boolean = true) {
        native.setDrawOrigin(posX, posY, posZ, 0);
        native.beginTextCommandDisplayText('STRING');
        native.addTextComponentSubstringPlayerName(message);
        native.setTextFont(fontType);
        native.setTextScale(1, scale);
        native.setTextWrap(0.0, 1.0);
        native.setTextCentre(true);
        native.setTextColour(r, g, b, a);

        if (useOutline) {
            native.setTextOutline();
        }

        if (useDropShadow) {
            native.setTextDropShadow();
        }

        native.endTextCommandDisplayText(0, 0, 0);
        native.clearDrawOrigin();
    }

    public drawText3dWithDistance(message: string, posX: number, posY: number, posZ: number, scale: number, fontType: number, r: number, g: number, b: number, a: number, useOutline: boolean = true, useDropShadow: boolean = true, distance: number = 20) {
        if (this.math.distance(alt.Player.local.pos, new Vector3(posX, posY, posZ)) <= distance) {
            this.drawText3d(message, posX, posY, posZ, scale, fontType, r, g, b, a, useOutline, useDropShadow);
        }
    }
}