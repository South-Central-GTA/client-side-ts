import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {Vector3} from "@extensions/vector3.extensions";
import {loadModel} from "../helpers";
import {ServerObjectInterfaces} from "@interfaces/server-object.interface";
import {LoggerModule} from "./logger.module";
import {UpdateModule} from "./update.module";
import {Player} from "@extensions/player.extensions";
import {TextModule} from "./text.module";
import {DateModule} from "./date.module";

@singleton()
export class ObjectSyncModule {
    private objects: Map<number, ServerObjectInterfaces> = new Map();

    public constructor(private readonly logger: LoggerModule, private readonly update: UpdateModule, private readonly player: Player, private readonly text: TextModule, private readonly date: DateModule) {
        this.update.add(() => {
            for (const key in this.objects) {
                const object = this.objects[key];
                if (object.entity !== undefined) {
                    if (this.player.isAduty) {
                        if (object.itemId === -1) {
                            this.text.drawText3dWithDistance(
                                    `Erstellt von: ${object.ownerName}\nErstellt um: ${this.date.getDate(
                                            object.createdAtJson)}`, object.position.x, object.position.y,
                                    object.position.z + 0.5, 0.4, 0, 255, 255, 255, 255, false, true, 5);
                        } else {
                            this.text.drawText3dWithDistance(
                                    `ItemId: ${object.itemId}\nErstellt von: ${object.ownerName}\nErstellt um: ${this.date.getDate(
                                            object.createdAtJson)}`, object.position.x, object.position.y,
                                    object.position.z + 0.5, 0.4, 0, 255, 255, 255, 255, false, true, 5);
                        }
                    }
                }
            }
        });
    }

    public add(id: number, model: string, name: string, position: Vector3, rotation: Vector3, freeze: boolean, onFire: boolean, itemId: number, ownerName: string, createdAtJson: string): void {
        loadModel(alt.hash(model)).then(() => {
            const entity = native.createObject(native.getHashKey(model), position.x, position.y, position.z, false,
                    false, false);
            this.objects.set(id, {
                id: id,
                model: model,
                name: name,
                entity: entity,
                freeze: freeze,
                position: position,
                rotation: rotation,
                onFire: onFire,
                itemId: itemId,
                ownerName: ownerName,
                createdAtJson: createdAtJson
            });

            this.setFreeze(id, freeze);
            this.setPosition(id, position);
            this.setRotation(id, rotation);
            this.setOnFire(id, onFire);
        });
    }

    public restore(id: number): void {
        if (this.objects.has(id)) {
            const obj = this.objects.get(id);

            loadModel(alt.hash(obj.model)).then(() => {
                this.objects.get(id).entity = native.createObject(native.getHashKey(obj.model), obj.position.x,
                        obj.position.y, obj.position.z, false, false, false);

                this.setFreeze(id, obj.freeze);
                this.setPosition(id, obj.position);
                this.setRotation(id, obj.rotation);
                this.setOnFire(id, obj.onFire);
            });
        }
    }

    public remove(id: any): void {
        if (this.objects.has(id)) {
            native.deleteObject(this.objects.get(id).entity);
            this.objects.get(id).entity = null;
        }
    }

    public clear(id: any): void {
        if (this.objects.has(id)) {
            this.objects.delete(id);
        }
    }

    public clearAll(): void {
        this.objects.forEach((object) => {
            native.deleteObject(object.entity);
        });

        this.objects = new Map();
    }

    public setFreeze(id: number, freeze: boolean): void {
        if (this.objects.has(id)) {
            native.freezeEntityPosition(this.objects.get(id).entity, freeze);

            this.objects.get(id).freeze = freeze;
        }
    }

    public getObject(id: number): ServerObjectInterfaces {
        if (this.objects.has(id)) {
            return this.objects.get(id);
        }
    }

    public getObjectByEntity(entity: number): ServerObjectInterfaces {
        const currentObjects = [...this.objects.values()].filter(obj => obj !== null);
        return currentObjects.find(obj => obj.entity === entity);
    }

    private setPosition(id: number, position: Vector3): void {
        if (this.objects.has(id)) {
            this.objects.get(id).position = position;
            native.setEntityCoords(this.objects.get(id).entity, position.x, position.y, position.z, false, false, false,
                    false);
        }
    }

    private setRotation(id: number, rotation: Vector3): void {
        if (this.objects.has(id)) {
            native.setEntityRotation(this.objects.get(id).entity, rotation.x, rotation.y, rotation.z, 0, true);
            this.objects.get(id).rotation = rotation;
        }
    }

    private setOnFire(id: number, onFire = null): void {
        if (this.objects.has(id)) {
            if (onFire) {
                this.objects.get(id).fireEntity = native.startScriptFire(this.objects.get(id).position.x,
                        this.objects.get(id).position.y, this.objects.get(id).position.z, 1, true);
            } else {
                if (this.objects.get(id).fireEntity !== undefined) {
                    native.removeScriptFire(this.objects.get(id).fireEntity);
                    this.objects.get(id).fireEntity = null;
                }
            }

            this.objects.get(id).onFire = onFire;
        }
    }
}