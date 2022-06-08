import * as alt from "alt-client";
import * as native from "natives";
import {LoggerModule} from "./logger.module";
import {singleton} from "tsyringe";
import {EventModule} from "./event.module";
import {GenderType} from "@enums/gender.type";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {AppearancesInterface} from "@interfaces/character/appearances.interface";
import {FaceFeaturesInterface} from "@interfaces/character/facefeatures.interface";
import {PedComponentVariationsInterface} from "@interfaces/ped/ped-component-variations.interface";
import {InventoryInterface} from "@interfaces/inventory/inventory.interface";
import {ClothesInterface} from "@interfaces/character/clothes.interface";
import {ItemState} from "@enums/item.state";
import {TattoosInterface} from "@interfaces/character/tattoos.interface";
import {ClothingModule} from "./clothing.module";
import {ClothingInterface} from "@interfaces/character/clothing.interface";

@singleton()
export class CharacterModule {
    get getCachedCharacter() {
        return this.cachedCharacter;
    }

    get getMaleNudeShoes() {
        return 34;
    }

    get getFemaleNudeShoes() {
        return 35;
    }

    get getPedComponents() {
        return this.pedComponents;
    }

    private hairOverlaysMale = {
        0: {collection: 'mpbeach_overlays', overlay: 'FM_Hair_Fuzz'},
        1: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_001'},
        2: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002'},
        3: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_003'},
        4: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_004'},
        5: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_005'},
        6: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_006'},
        7: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_007'},
        8: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_008'},
        9: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_009'},
        10: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_013'},
        11: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002'},
        12: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_011'},
        13: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_012'},
        14: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014'},
        15: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015'},
        16: {collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_000'},
        17: {collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_001'},
        18: {collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_000'},
        19: {collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_001'},
        20: {collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_000'},
        21: {collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_001'},
        22: {collection: 'multiplayer_overlays', overlay: 'NGInd_M_Hair_000'},
        24: {collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_000'},
        25: {collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_001'},
        26: {collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_002'},
        27: {collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_003'},
        28: {collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_004'},
        29: {collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_005'},
        30: {collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_006'},
        31: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_M'},
        32: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_M'},
        33: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_M'},
        34: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_M'},
        35: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_M'},
        36: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_005_M'},
        37: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_001'},
        38: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002'},
        39: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_003'},
        40: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_004'},
        41: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_005'},
        42: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_006'},
        43: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_007'},
        44: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_008'},
        45: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_009'},
        46: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_013'},
        47: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002'},
        48: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_011'},
        49: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_012'},
        50: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014'},
        51: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015'},
        52: {collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_000'},
        53: {collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_001'},
        54: {collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_000'},
        55: {collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_001'},
        56: {collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_000'},
        57: {collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_001'},
        58: {collection: 'multiplayer_overlays', overlay: 'NGInd_M_Hair_000'},
        59: {collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_000'},
        60: {collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_001'},
        61: {collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_002'},
        62: {collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_003'},
        63: {collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_004'},
        64: {collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_005'},
        65: {collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_006'},
        66: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_M'},
        67: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_M'},
        68: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_M'},
        69: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_M'},
        70: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_M'},
        71: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_005_M'},
        72: {collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_M_000_M'},
        73: {collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_M_001_M'}
    };

    private hairOverlaysFemale = {
        0: {collection: 'mpbeach_overlays', overlay: 'FM_Hair_Fuzz'},
        1: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_001'},
        2: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_002'},
        3: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003'},
        4: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_004'},
        5: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_005'},
        6: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_006'},
        7: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007'},
        8: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_008'},
        9: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_009'},
        10: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_010'},
        11: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_011'},
        12: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_012'},
        13: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_013'},
        14: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014'},
        15: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015'},
        16: {collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_000'},
        17: {collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001'},
        18: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007'},
        19: {collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_000'},
        20: {collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_001'},
        21: {collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001'},
        22: {collection: 'multiplayer_overlays', overlay: 'NGHip_F_Hair_000'},
        23: {collection: 'multiplayer_overlays', overlay: 'NGInd_F_Hair_000'},
        25: {collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_000'},
        26: {collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_001'},
        27: {collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_002'},
        28: {collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003'},
        29: {collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003'},
        30: {collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_004'},
        31: {collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_006'},
        32: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_F'},
        33: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_F'},
        34: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_F'},
        35: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_F'},
        36: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003'},
        37: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_006_F'},
        38: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_F'},
        39: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_001'},
        40: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_002'},
        41: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003'},
        42: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_004'},
        43: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_005'},
        44: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_006'},
        45: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007'},
        46: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_008'},
        47: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_009'},
        48: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_010'},
        49: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_011'},
        50: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_012'},
        51: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_013'},
        52: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014'},
        53: {collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015'},
        54: {collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_000'},
        55: {collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001'},
        56: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007'},
        57: {collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_000'},
        58: {collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_001'},
        59: {collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001'},
        60: {collection: 'multiplayer_overlays', overlay: 'NGHip_F_Hair_000'},
        61: {collection: 'multiplayer_overlays', overlay: 'NGInd_F_Hair_000'},
        62: {collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_000'},
        63: {collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_001'},
        64: {collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_002'},
        65: {collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003'},
        66: {collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003'},
        67: {collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_004'},
        68: {collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_006'},
        69: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_F'},
        70: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_F'},
        71: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_F'},
        72: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_F'},
        73: {collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003'},
        74: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_006_F'},
        75: {collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_F'},
        76: {collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_F_000_F'},
        77: {collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_F_001_F'}
    };
    private cachedCharacter: CharacterInterface;

    private pedComponents: PedComponentVariationsInterface[] = [];

    public constructor(
        private readonly logger: LoggerModule,
        private readonly event: EventModule,
        private readonly clothing: ClothingModule) {
        this.readComponentsFromJson();
    }

    public apply(character: CharacterInterface, pedId: number): void {
        native.clearPedBloodDamage(pedId);
        native.clearPedDecorations(pedId);
        native.setPedHeadBlendData(pedId, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

        this.updateParents(character.mother, character.father, character.similarity, character.skinSimilarity, character.gender, pedId);
        this.updateFaceFeatures(character.faceFeatures, pedId);
        this.updateAppearance(character.appearances, character.gender, pedId);

        character.clothes = this.getClothesFromInventory(character.inventory);
        character.clothes.torso = {
            drawableId: character.torso,
            textureId: character.torsoTexture,
            title: "",
            genderType: GenderType.MALE,
        }

        this.updateClothes(character.clothes, pedId, character.gender);

        this.updateTattoos(character.tattoos, pedId);

        this.cachedCharacter = character;
    }

    public createClothesBasedOnInventory(inventory: InventoryInterface, pedId: number, gender: number): void {
        const clothes = this.getClothesFromInventory(inventory);
        clothes.torso = {
            drawableId: this.cachedCharacter.torso,
            textureId: this.cachedCharacter.torsoTexture,
            title: "",
            genderType: GenderType.MALE,
        }

        this.updateClothes(clothes, pedId, gender);
    }

    public updateClothes(clothes: ClothesInterface, pedId: number, gender: number) {
        if (clothes.hat !== null) {
            native.setPedPreloadPropData(pedId, 0, clothes.hat.drawableId, clothes.hat.textureId);
            native.setPedPropIndex(pedId, 0, clothes.hat.drawableId, clothes.hat.textureId, true);
        } else {
            native.clearPedProp(pedId, 0);
        }

        if (clothes.glasses !== null) {
            native.setPedPropIndex(pedId, 1, clothes.glasses.drawableId, clothes.glasses.textureId, true);
        } else {
            native.clearPedProp(pedId, 1);
        }

        if (clothes.ears !== null) {
            native.setPedPropIndex(pedId, 2, clothes.ears.drawableId, clothes.ears.textureId, true);
        } else {
            native.clearPedProp(pedId, 2);
        }

        if (clothes.mask !== null) {
            native.setPedComponentVariation(pedId, 1, clothes.mask.drawableId, clothes.mask.textureId, 2);
        } else {
            native.setPedComponentVariation(pedId, 1, 0, 0, 2);
        }

        if (clothes.watch !== null) {
            native.setPedPropIndex(pedId, 6, clothes.watch.drawableId, clothes.watch.textureId, true);
        } else {
            native.clearPedProp(pedId, 6);
        }

        if (clothes.bracelets !== null) {
            native.setPedPropIndex(pedId, 7, clothes.bracelets.drawableId, clothes.bracelets.textureId, true);
        } else {
            native.clearPedProp(pedId, 7);
        }

        if (clothes.top !== null) {
            native.setPedComponentVariation(pedId, 11, clothes.top.drawableId, clothes.top.textureId, 2);
        } else {
            if (gender === GenderType.MALE) {
                native.setPedComponentVariation(pedId, 11, 15, 0, 0);
            } else {
                native.setPedComponentVariation(pedId, 11, 18, 0, 0);
            }
        }

        if (clothes.torso !== null) {
            this.updateTorso(pedId, clothes.torso.drawableId, clothes.torso.textureId);
        } else {
            this.updateTorso(pedId, 15, 0);
        }

        if (clothes.bodyArmor !== null) {
            native.setPedComponentVariation(pedId, 9, clothes.bodyArmor.drawableId, clothes.bodyArmor.textureId, 2);
        } else {
            native.setPedComponentVariation(pedId, 9, 0, 0, 0);
        }

        if (clothes.backPack !== null) {
            native.setPedComponentVariation(pedId, 5, clothes.backPack.drawableId, clothes.backPack.textureId, 2);
        } else {
            native.setPedComponentVariation(pedId, 5, 0, 0, 0);
        }

        if (clothes.underShirt !== null) {
            native.setPedComponentVariation(pedId, 8, clothes.underShirt.drawableId, clothes.underShirt.textureId, 2);
        } else {
            native.setPedComponentVariation(pedId, 8, 15, 0, 0);
        }

        if (clothes.accessories !== null) {
            native.setPedComponentVariation(pedId, 7, clothes.accessories.drawableId, clothes.accessories.textureId, 2);
        } else {
            native.setPedComponentVariation(pedId, 7, 0, 0, 0);
        }

        if (clothes.pants !== null) {
            native.setPedComponentVariation(pedId, 4, clothes.pants.drawableId, clothes.pants.textureId, 2);
        } else {
            if (gender === GenderType.MALE) {
                native.setPedComponentVariation(pedId, 4, 61, 0, 0);
            } else {
                native.setPedComponentVariation(pedId, 4, 17, 0, 0);
            }
        }

        if (clothes.shoes !== null) {
            native.setPedComponentVariation(pedId, 6, clothes.shoes.drawableId, clothes.shoes.textureId, 2);
        } else {
            if (gender === GenderType.MALE) {
                native.setPedComponentVariation(pedId, 6, this.getMaleNudeShoes, 0, 2);
            } else {
                native.setPedComponentVariation(pedId, 6, this.getFemaleNudeShoes, 0, 2);
            }
        }
    }

    public updateTorso(pedId: number, drawableId: number, textureId: number): void {
        native.setPedComponentVariation(pedId, 3, drawableId, textureId, 0);
    }

    public updateTattoos(tattoos: TattoosInterface, pedId: number): void {
        native.clearPedDecorations(pedId);

        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.headCollection), Number.parseInt(tattoos.headHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.torsoCollection), Number.parseInt(tattoos.torsoHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.leftArmCollection), Number.parseInt(tattoos.leftArmHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.rightArmCollection), Number.parseInt(tattoos.rightArmHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.leftLegCollection), Number.parseInt(tattoos.leftLegHash));
        native.addPedDecorationFromHashes(pedId, native.getHashKey(tattoos.rightLegCollection), Number.parseInt(tattoos.rightLegHash));
    }

    public setNude(pedId: number, gender: number): void {
        native.clearAllPedProps(pedId);

        if (gender === GenderType.MALE) {
            native.setPedComponentVariation(pedId, 11, 15, 0, 0);
        } else {
            native.setPedComponentVariation(pedId, 11, 18, 0, 0);
        }

        this.updateTorso(pedId, 15, 0);
        native.setPedComponentVariation(pedId, 1, 0, 0, 0);
        native.setPedComponentVariation(pedId, 9, 0, 0, 0);
        native.setPedComponentVariation(pedId, 5, 0, 0, 0);
        native.setPedComponentVariation(pedId, 8, 15, 0, 0);
        native.setPedComponentVariation(pedId, 7, 0, 0, 0);

        if (gender === GenderType.MALE) {
            native.setPedComponentVariation(pedId, 4, 61, 0, 0);
        } else {
            native.setPedComponentVariation(pedId, 4, 17, 0, 0);
        }

        if (gender === GenderType.MALE) {
            native.setPedComponentVariation(pedId, 6, this.getMaleNudeShoes, 0, 2);
        } else {
            native.setPedComponentVariation(pedId, 6, this.getFemaleNudeShoes, 0, 2);
        }
    }

    public updateAppearance(appearances: AppearancesInterface, gender: GenderType, pedId: number): void {
        if (!appearances)
            return;

        native.clearPedDecorations(pedId);
        native.setPedEyeColor(pedId, appearances.eyeColor);

        native.setPedComponentVariation(pedId, 2, appearances.hair, 0, 0);
        native.setPedHairColor(pedId, appearances.primHairColor, appearances.secHairColor);

        if (gender === GenderType.MALE) {
            if (this.hairOverlaysMale[appearances.hair]) {
                const collection = this.hairOverlaysMale[appearances.hair].collection;
                const overlay = this.hairOverlaysMale[appearances.hair].overlay;

                native.addPedDecorationFromHashes(pedId, alt.hash(collection), alt.hash(overlay));
            }
        } else {
            if (this.hairOverlaysFemale[appearances.hair]) {
                const collection = this.hairOverlaysFemale[appearances.hair].collection;
                const overlay = this.hairOverlaysFemale[appearances.hair].overlay;

                native.addPedDecorationFromHashes(pedId, alt.hash(collection), alt.hash(overlay));
            }
        }

        native.setPedHeadOverlay(pedId, 0, appearances.blemishesValue, appearances.blemishesOpacity);
        native.setPedHeadOverlayColor(pedId, 0, this.getColorType(0), appearances.blemishesColor, 0);

        native.setPedHeadOverlay(pedId, 1, appearances.facialhairValue, appearances.facialhairOpacity);
        native.setPedHeadOverlayColor(pedId, 1, this.getColorType(1), appearances.facialhairColor, 0);

        native.setPedHeadOverlay(pedId, 2, appearances.eyebrowsValue, appearances.eyebrowsOpacity);
        native.setPedHeadOverlayColor(pedId, 2, this.getColorType(2), appearances.eyebrowsColor, 0);

        native.setPedHeadOverlay(pedId, 3, appearances.ageingValue, appearances.ageingOpacity);
        native.setPedHeadOverlayColor(pedId, 3, this.getColorType(3), appearances.ageingColor, 0);

        native.setPedHeadOverlay(pedId, 4, appearances.makeupValue, appearances.makeupOpacity);
        native.setPedHeadOverlayColor(pedId, 4, this.getColorType(4), appearances.makeupColor, 0);

        native.setPedHeadOverlay(pedId, 5, appearances.blushValue, appearances.blushOpacity);
        native.setPedHeadOverlayColor(pedId, 5, this.getColorType(5), appearances.blushColor, 0);

        native.setPedHeadOverlay(pedId, 6, appearances.complexionValue, appearances.complexionOpacity);
        native.setPedHeadOverlayColor(pedId, 6, this.getColorType(6), appearances.complexionColor, 0);

        native.setPedHeadOverlay(pedId, 7, appearances.sundamageValue, appearances.sundamageOpacity);
        native.setPedHeadOverlayColor(pedId, 7, this.getColorType(7), appearances.sundamageColor, 0);

        native.setPedHeadOverlay(pedId, 8, appearances.lipstickValue, appearances.lipstickOpacity);
        native.setPedHeadOverlayColor(pedId, 8, this.getColorType(8), appearances.lipstickColor, 0);

        native.setPedHeadOverlay(pedId, 9, appearances.frecklesValue, appearances.frecklesOpacity);
        native.setPedHeadOverlayColor(pedId, 9, this.getColorType(9), appearances.frecklesColor, 0);

        native.setPedHeadOverlay(pedId, 10, appearances.chesthairValue, appearances.chesthairOpacity);
        native.setPedHeadOverlayColor(pedId, 10, this.getColorType(10), appearances.chesthairColor, 0);

        native.setPedHeadOverlay(pedId, 11, appearances.bodyblemishesValue, appearances.bodyblemishesOpacity);
        native.setPedHeadOverlayColor(pedId, 11, this.getColorType(11), appearances.bodyblemishesColor, 0);

        native.setPedHeadOverlay(pedId, 12, appearances.addbodyblemihesValue, appearances.addbodyblemihesOpacity);
        native.setPedHeadOverlayColor(pedId, 12, this.getColorType(12), appearances.addbodyblemihesColor, 0);
    }

    private createEmptyClothings(): ClothesInterface {
        return {
            hat: null,
            glasses: null,
            ears: null,
            watch: null,
            bracelets: null,
            mask: null,
            top: null,
            torso: null,
            bodyArmor: null,
            backPack: null,
            underShirt: null,
            accessories: null,
            pants: null,
            shoes: null
        }
    }

    private getClothesFromInventory(inventory: InventoryInterface): ClothesInterface {
        if (inventory === undefined) {
            throw Error("We have no inventory.");
        }

        // This will only filter items from the inventory that are clothing item types and equipped.
        const clothingItems = inventory.items.filter(i => i.itemState === ItemState.EQUIPPED && this.clothing.isClothingItem(i.catalogItemName));

        const clothes = this.createEmptyClothings();

        for (let index = 0; index < clothingItems.length; index++) {
            const item = clothingItems[index];
            const clothing: ClothingInterface = JSON.parse(item.customData);

            switch (item.catalogItemName) {
                case "CLOTHING_HAT":
                    clothes.hat = clothing;
                    break;
                case "CLOTHING_GLASSES":
                    clothes.glasses = clothing;
                    break;
                case "CLOTHING_EARS":
                    clothes.ears = clothing;
                    break;
                case "CLOTHING_MASK":
                    clothes.mask = clothing;
                    break;
                case "CLOTHING_TOP":
                    clothes.top = clothing;
                    break;
                case "CLOTHING_UNDERSHIRT":
                    clothes.underShirt = clothing;
                    break;
                case "CLOTHING_ACCESSORIES":
                    clothes.accessories = clothing;
                    break;
                case "CLOTHING_WATCH":
                    clothes.watch = clothing;
                    break;
                case "CLOTHING_BRACELET":
                    clothes.bracelets = clothing;
                    break;
                case "CLOTHING_PANTS":
                    clothes.pants = clothing;
                    break;
                case "CLOTHING_BACKPACK":
                    clothes.backPack = clothing;
                    break;
                case "CLOTHING_BODY_ARMOR":
                    clothes.bodyArmor = clothing;
                    break;
                case "CLOTHING_SHOES":
                    clothes.shoes = clothing;
                    break;
                default:
                    this.logger.error("Es wurde kein Kleidungstyp mit dem Namen " + name + " gefunden.");
            }
        }

        return clothes;
    }

    private updateParents(mother: number, father: number, similarity: number, skinSimilarity: number, gender: GenderType, pedId: number): void {
        native.setPedHeadBlendData(
            pedId,

            mother,
            father,
            0,

            mother,
            father,
            0,


            similarity,
            skinSimilarity,
            0,

            false
        );
    }

    private updateFaceFeatures(faceFeatures: FaceFeaturesInterface, pedId: number): void {
        if (!faceFeatures)
            return;

        native.setPedFaceFeature(pedId, 0, faceFeatures.noseWidth);
        native.setPedFaceFeature(pedId, 1, faceFeatures.noseHeight);
        native.setPedFaceFeature(pedId, 2, faceFeatures.noseLength);
        native.setPedFaceFeature(pedId, 3, faceFeatures.noseBridge);
        native.setPedFaceFeature(pedId, 4, faceFeatures.noseTip);
        native.setPedFaceFeature(pedId, 5, faceFeatures.noseBridgeShift);

        native.setPedFaceFeature(pedId, 6, faceFeatures.browHeight);
        native.setPedFaceFeature(pedId, 7, faceFeatures.browWidth);

        native.setPedFaceFeature(pedId, 8, faceFeatures.cheekboneHeight);
        native.setPedFaceFeature(pedId, 9, faceFeatures.cheekboneWidth);
        native.setPedFaceFeature(pedId, 10, faceFeatures.cheekWidth);

        native.setPedFaceFeature(pedId, 11, faceFeatures.eyesSize);
        native.setPedFaceFeature(pedId, 12, faceFeatures.lipsThickness);

        native.setPedFaceFeature(pedId, 13, faceFeatures.jawWidth);
        native.setPedFaceFeature(pedId, 14, faceFeatures.jawHeight);

        native.setPedFaceFeature(pedId, 15, faceFeatures.chinLength);
        native.setPedFaceFeature(pedId, 16, faceFeatures.chinPosition);
        native.setPedFaceFeature(pedId, 17, faceFeatures.chinWidth);
        native.setPedFaceFeature(pedId, 18, faceFeatures.chinShape);

        native.setPedFaceFeature(pedId, 19, faceFeatures.neckWidth);
    }

    private getColorType(overlayId: number): number {
        let returnVal = 0;

        switch (overlayId) {
            case 1:
            case 2:
            case 10:
                returnVal = 1;
                break;
            case 5:
            case 8:
                returnVal = 2;
                break;
            default:
                returnVal = 0;
        }

        return returnVal;
    }

    private readComponentsFromJson(): void {
        if (alt.File.exists("@southcentral-assets/dumps/pedComponentVariations.json")) {
            const dumps = alt.File.read("@southcentral-assets/dumps/pedComponentVariations.json");
            this.pedComponents = JSON.parse(dumps);

            this.pedComponents.forEach((component: PedComponentVariationsInterface) => {
                component.ComponentVariations = component.ComponentVariations.filter(cv => cv.TranslatedLabel !== null);
                component.Props = component.Props.filter(cv => cv.TranslatedLabel !== null);
            });

        } else {
            this.logger.error("CharacterService: PedComponentVariation Dump is not loaded.");
        }
    }
}