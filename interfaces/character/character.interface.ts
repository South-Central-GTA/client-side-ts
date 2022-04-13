import { GenderType } from "../../enums/gender.type";
import { FaceFeaturesInterface } from "./facefeatures.interface";
import { AppearancesInterface } from "./appearances.interface";
import { InventoryInterface } from "../inventory/inventory.interface";
import { DefinedJobInterface } from "../definedjob/defined-job.interface";
import {TattoosInterface} from "./tattoos.interface";
import {ClothesInterface} from "./clothes.interface";

export interface   CharacterInterface {
    id: number;
    accountId: number;

    firstName: string;
    lastName: string;

    gender: GenderType;
    age: number;
    onlineSince: string;
    lastUsage: string;
    createdAt: string;

    mother: number;
    father: number;
    origin: string;
    physique: string;
    story: string;
    bodySize: number;
    
    similarity: number;
    skinSimilarity: number;
    characterState: number;
    
    torso: number;
    torsoTexture: number;

    faceFeatures: FaceFeaturesInterface;
    appearances: AppearancesInterface;
    inventory: InventoryInterface;
    definedJob: DefinedJobInterface;
    tattoos: TattoosInterface; 

    clothes: ClothesInterface; //only clientside
}