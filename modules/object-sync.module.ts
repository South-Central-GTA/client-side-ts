import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {Vector3} from "../extensions/vector3.extensions";
import {loadModel} from "../helpers";
import {ServerObjectInterfaces} from "../interfaces/server-object.interface";
import {LoggerModule} from "./logger.module";
import {UpdateModule} from "./update.module";
import {Player} from "../extensions/player.extensions";
import {TextModule} from "./text.module";
import {DateModule} from "./date.module";

@singleton()
export class ObjectSyncModule {
    private objects: ServerObjectInterfaces[] = [];
    
    public constructor(
        private readonly logger: LoggerModule,
        private readonly update: UpdateModule,
        private readonly player: Player,
        private readonly text: TextModule,
        private readonly date: DateModule) {
        this.update.add(() => {
            for (const key in this.objects) {
                const object = this.objects[key];
                if (object.entity !== undefined) {
                    if (this.player.isAduty) {
                        if (object.itemId === -1) {
                            this.text.drawText3dWithDistance(
                                `Erstellt von: ${object.ownerName}\nErstellt um: ${this.date.getDate(object.createdAtJson)}`,
                                object.position.x, object.position.y, object.position.z + 0.5, 0.4, 0,
                                255, 255, 255, 255, false, true, 5);
                        } else {
                            this.text.drawText3dWithDistance(
                                `ItemId: ${object.itemId}\nErstellt von: ${object.ownerName}\nErstellt um: ${this.date.getDate(object.createdAtJson)}`,
                                object.position.x, object.position.y, object.position.z + 0.5, 0.4, 0,
                                255, 255, 255, 255, false, true, 5);
                        }
                    }
                }
            }
        });
    }

    public add(id: number, model: string, name: string, position: Vector3, rotation: Vector3, freeze: boolean,
               onFire: boolean, itemId: number, ownerName: string, createdAtJson: string): void {
        loadModel(alt.hash(model)).then(() => {
            const entity = native.createObject(native.getHashKey(model), position.x, position.y, position.z, false, false, false);
            this.objects[id] = {
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
            };

            this.setFreeze(id, freeze);
            this.setPosition(id, position);
            this.setRotation(id, rotation);
            this.setOnFire(id, onFire);
        });
    }

    public restore(id: number): void {
        if (this.objects.hasOwnProperty(id)) {
            const obj = this.objects[id];
            
            loadModel(alt.hash(obj.model)).then(() => {
                this.objects[id].entity = native.createObject(native.getHashKey(obj.model), obj.position.x, 
                    obj.position.y, obj.position.z, false, false, false);

                this.setFreeze(id, obj.freeze);
                this.setPosition(id, obj.position);
                this.setRotation(id, obj.rotation);
                this.setOnFire(id, obj.onFire);
            });
        }
    }

    public remove(id: any): void {
        if(this.objects.hasOwnProperty(id)) {
            native.deleteObject(this.objects[id].entity);
            this.objects[id].entity = null;
        }
    }

    public clear(id: any): void  {
        if(this.objects.hasOwnProperty(id)) {
            delete this.objects[id];
        }
    } 
    public clearAll(): void  {
        this.objects.forEach((object) => {
            native.deleteObject(object.entity);
        });                  

        this.objects = [];
    } 
    
    public setFreeze(id: number, freeze: boolean): void {
        if(this.objects.hasOwnProperty(id)) {
            native.freezeEntityPosition(this.objects[id].entity, freeze);

            this.objects[id].freeze = freeze;
        }
    }

    public getObject(id: number): ServerObjectInterfaces {
        if(this.objects.hasOwnProperty(id)) {
            return this.objects[id];
        }
    }

    public getObjectByEntity(entity: number): ServerObjectInterfaces {
        const currentObjects = this.objects.filter(obj => obj !== null);
        return currentObjects.find(obj => obj.entity === entity);
    }
    
    private setPosition(id: number, position: Vector3): void {
        if(this.objects.hasOwnProperty(id)) {
            this.objects[id].position = position;
            native.setEntityCoords(this.objects[id].entity, position.x, position.y, position.z, false, false, false, false);
        }
    }
    
    private setRotation(id: number, rotation: Vector3): void {
        if(this.objects.hasOwnProperty(id)) {
            native.setEntityRotation(this.objects[id].entity, rotation.x, rotation.y, rotation.z, 0, true);
            this.objects[id].rotation = rotation;
        }
    }
    
    private setOnFire(id: number, onFire = null): void {
        if(this.objects.hasOwnProperty(id)) {
            if(onFire) {
                this.objects[id].fireEntity = native.startScriptFire(this.objects[id].position.x, this.objects[id].position.y, this.objects[id].position.z, 1, true);
            } else {
                if(this.objects[id].fireEntity !== undefined) {
                    native.removeScriptFire(this.objects[id].fireEntity);
                    this.objects[id].fireEntity = null;
                }
            }

            this.objects[id].onFire = onFire;
        }
    }
}