import {FaceFeaturesInterface} from "./facefeatures.interface";
import {AppearancesInterface} from "./appearances.interface";
import {InventoryInterface} from "../inventory/inventory.interface";
import {DefinedJobInterface} from "../definedjob/defined-job.interface";
import {TattoosInterface} from "./tattoos.interface";
import {ClothesInterface} from "./clothes.interface";
import {GenderType} from "@enums/gender.type";
import {PersonalLicenseInterface} from "./personal-license.interface";

export interface CharacterInterface {
    id: number;
    accountId: number;
    accountName: string;

    firstName: string;
    lastName: string;
    name: string;

    gender: GenderType;
    age: number;
    onlineSinceJson: string;
    lastUsageJson: string;
    createdAtJson: string;

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
    licenses: PersonalLicenseInterface[];

}