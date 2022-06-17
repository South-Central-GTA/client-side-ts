import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {Vector3} from "@extensions/vector3.extensions";
import {LoggerModule} from "./logger.module";
import {BlipInterface} from "@interfaces/blip.interface";
import {BlipColor, BlipSprite} from "alt-shared";
import {BlipType} from "@enums/blip.type";

@singleton()
export class BlipSyncModule {
    private blips: Map<number, BlipInterface> = new Map();

    public constructor(private readonly logger: LoggerModule) {
    }

    public add(id: number, position: Vector3, name: string, sprite: BlipSprite, color: BlipColor, scale: number, shortRange: boolean, player: alt.Player, blipType: BlipType, radius: number, alpha: number): void {

        if (player !== null && player.id !== alt.Player.local.id) {
            return;
        }

        let handle = null;

        switch (blipType) {
            case BlipType.POINT:
                handle = new alt.PointBlip(position.x, position.y, position.z);
                handle.sprite = sprite;
                handle.scale = scale;

                break;
            case BlipType.RADIUS:
                handle = new alt.RadiusBlip(position.x, position.y, position.z, radius);
                break;
        }

        if (handle === null) {
            return;
        }

        handle.alpha = alpha;
        handle.color = color;
        handle.name = name;
        handle.shortRange = shortRange;

        this.blips.set(id, {
            id: id,
            handle: handle,
            position: position,
            sprite: sprite,
            color: color,
            scale: scale,
            name: name,
            shortRange: shortRange,
            blipType: blipType,
            player: player,
            radius: radius
        });
    }

    public get(entityId: number): BlipInterface {
        if (this.blips.has(entityId)) {
            return this.blips[entityId];
        } else {
            return null;
        }
    }

    public restore(id: number): void {
        if (this.blips.has(id)) {
            const blip = this.blips.get(id);

            if (blip.player !== null && blip.player.id !== alt.Player.local.id) {
                return;
            }

            let handle = null;

            switch (blip.blipType) {
                case BlipType.POINT:
                    handle = new alt.PointBlip(blip.position.x, blip.position.y, blip.position.z);
                    handle.sprite = blip.sprite;
                    handle.scale = blip.scale;

                    break;
                case BlipType.RADIUS:
                    handle = new alt.RadiusBlip(blip.position.x, blip.position.y, blip.position.z, blip.radius);
                    break;
            }

            if (handle === null) {
                return;
            }

            blip.handle.sprite = blip.sprite;
            blip.handle.color = blip.color;
            blip.handle.scale = blip.scale;
            blip.handle.name = blip.name;
            blip.handle.shortRange = blip.shortRange;
        }
    }

    public remove(id: number): void {
        if (this.blips.has(id)) {
            this.blips.get(id).handle.destroy();
            this.blips.get(id).handle = null;
            this.blips.delete(id);
        }
    }

    public clear(id: number): void {
        if (this.blips.has(id)) {
            this.blips.get(id).handle.destroy();
            this.blips.get(id).handle = null;
            this.blips.delete(id);
        }
    }

    public clearAll(): void {
        this.blips.forEach((blip) => {
            blip.handle.destroy();
        });

        this.blips = new Map();
    }

    public setPosition(id: number, position: Vector3): void {
        if (this.blips.has(id)) {
            this.blips.get(id).handle.pos = position;
            this.blips.get(id).position = position;
        }
    }
}