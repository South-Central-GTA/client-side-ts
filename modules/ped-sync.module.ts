import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {Vector3} from "@extensions/vector3.extensions";
import {ServerPedInterface} from "@interfaces/ped/server-ped.interface";
import {loadModel} from "../helpers";
import {LoggerModule} from "./logger.module";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {CharacterModule} from "./character.module";

@singleton()
export class PedSyncModule {
    private peds: ServerPedInterface[] = [];

    public constructor(private readonly logger: LoggerModule, private readonly character: CharacterModule,) {
    }

    private static makePedStupid(entity: number): void {
        native.setEntityAsMissionEntity(entity, true, false); // make sure its not despawned by game engine
        native.setBlockingOfNonTemporaryEvents(entity, true); // make sure ped doesnt flee etc only do what its told
        native.setPedCanBeTargetted(entity, false);
        native.setPedCanBeKnockedOffVehicle(entity, 1);
        native.setPedCanBeDraggedOut(entity, false);
        native.setPedSuffersCriticalHits(entity, false);
        native.setPedDropsWeaponsWhenDead(entity, false);
        native.setPedDiesInstantlyInWater(entity, false);
        native.setPedCanRagdoll(entity, false);
        native.setPedDiesWhenInjured(entity, false);
        native.taskSetBlockingOfNonTemporaryEvents(entity, true);
        native.setPedFleeAttributes(entity, 0, false);
        native.setPedConfigFlag(entity, 32, false); // ped cannot fly thru windscreen
        native.setPedConfigFlag(entity, 281, true); // ped no writhe
        native.setPedGetOutUpsideDownVehicle(entity, false);
        native.setPedCanEvasiveDive(entity, false);
        native.freezeEntityPosition(entity, true);
        native.setEntityInvincible(entity, true);
    }

    public add(id: number, model: string, position: Vector3, heading: number, vehicle: alt.Vehicle, seat: number, characterModel: CharacterInterface): void {
        const hash = alt.hash(model);
        loadModel(hash).then(() => {
            if (vehicle !== null) {
                alt.setTimeout(() => {
                    const entity = native.createPedInsideVehicle(vehicle.scriptID, 0, hash, seat, false, false);
                    PedSyncModule.makePedStupid(entity);

                    this.peds[id] = {
                        id: id,
                        model: model,
                        entity: entity,
                        position: position,
                        heading: heading,
                        vehicle: vehicle,
                        seat: seat,
                    };
                }, 100);
            } else {
                const entity = native.createPed(0, hash, position.x, position.y, position.z, heading, false, false);
                PedSyncModule.makePedStupid(entity);

                this.peds[id] = {
                    id: id,
                    model: model,
                    entity: entity,
                    position: position,
                    heading: heading,
                    vehicle: vehicle,
                    seat: seat,
                };
            }

            if (characterModel !== null) {
                this.character.apply(characterModel, this.peds[id].entity);
            }
        });
    }

    public restore(id: number) {
        if (this.peds.hasOwnProperty(id)) {
            const ped = this.peds[id];
            const hash = alt.hash(ped.model);

            loadModel(hash).then(() => {
                if (ped.vehicle !== null) {
                    alt.setTimeout(() => {
                        this.peds[id].entity = native.createPedInsideVehicle(ped.vehicle.scriptID, 0, hash, ped.seat,
                                false, false);
                        PedSyncModule.makePedStupid(this.peds[id].entity);
                    }, 100);
                } else {
                    this.peds[id].entity = native.createPed(0, hash, ped.position.x, ped.position.y, ped.position.z,
                            ped.heading, false, false);
                    PedSyncModule.makePedStupid(this.peds[id].entity);
                }

                if (ped.characterModel !== undefined) {
                    this.character.apply(ped.characterModel, ped.entity);
                }
            });
        }
    }

    public remove(id: number) {
        if (this.peds.hasOwnProperty(id)) {
            native.deletePed(this.peds[id].entity);
            this.peds[id].entity = null;
        }
    }

    public clear(id: number) {
        if (this.peds.hasOwnProperty(id)) {
            delete this.peds[id];
        }
    }

    public clearAll() {
        this.peds.forEach((ped) => {
            native.deletePed(ped.entity);
        });

        this.peds = [];
    }

    public setHeading(id: number, heading: number) {
        if (this.peds.hasOwnProperty(id)) {
            this.peds[id].heading = heading;
            native.setEntityHeading(this.peds[id].entity, heading);
        }
    }

    public setPosition(id: number, position: Vector3) {
        if (this.peds.hasOwnProperty(id)) {
            this.peds[id].position = position;
            native.setEntityCoords(this.peds[id].entity, position.x, position.y, position.z, false, false, false,
                    false);
        }
    }
}