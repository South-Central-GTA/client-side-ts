import {singleton} from "tsyringe";
import {LoggerModule} from "./logger.module";
import native from "natives";
import {MaxDrawablesTexturesInterface} from "@interfaces/character/max-drawable-textures.interface";
import {MaxDrawablesInterface} from "@interfaces/character/max-drawables.interface";
import {ClothesInterface} from "@interfaces/character/clothes.interface";

@singleton()
export class ClothingModule {
    constructor(private readonly logger: LoggerModule) {
    }

    public isClothingItem(name: string): boolean {
        switch (name) {
            case "CLOTHING_HAT":
            case "CLOTHING_GLASSES":
            case "CLOTHING_EARS":
            case "CLOTHING_MASK":
            case "CLOTHING_TOP":
            case "CLOTHING_UNDERSHIRT":
            case "CLOTHING_ACCESSORIES":
            case "CLOTHING_WATCH":
            case "CLOTHING_BRACELET":
            case "CLOTHING_PANTS":
            case "CLOTHING_BACKPACK":
            case "CLOTHING_BODY_ARMOR":
            case "CLOTHING_SHOES":
                return true;
            default:
                this.logger.warning("ClothingModule: " + name + " ist kein Kleidungsitem.")
                return false;
        }
    }

    public isClothingItemAProp(name: string): boolean {
        switch (name) {
            case "CLOTHING_HAT":
            case "CLOTHING_GLASSES":
            case "CLOTHING_EARS":
            case "CLOTHING_WATCH":
            case "CLOTHING_BRACELET":
                return true;
            default:
                return false;
        }
    }

    public getMaxDrawableVariations(pedId: number): MaxDrawablesInterface {
        return {
            maxHat: native.getNumberOfPedPropDrawableVariations(pedId, 0),
            maxGlasses: native.getNumberOfPedPropDrawableVariations(pedId, 1),
            maxEars: native.getNumberOfPedPropDrawableVariations(pedId, 2),
            maxWatches: native.getNumberOfPedPropDrawableVariations(pedId, 6),
            maxBracelets: native.getNumberOfPedPropDrawableVariations(pedId, 7),
            maxMask: native.getNumberOfPedDrawableVariations(pedId, 1),
            maxTorsos: native.getNumberOfPedDrawableVariations(pedId, 3),
            maxTops: native.getNumberOfPedDrawableVariations(pedId, 11),
            maxBodyArmors: native.getNumberOfPedDrawableVariations(pedId, 9),
            maxBackPacks: native.getNumberOfPedDrawableVariations(pedId, 5),
            maxUnderShirts: native.getNumberOfPedDrawableVariations(pedId, 8),
            maxAccessories: native.getNumberOfPedDrawableVariations(pedId, 7),
            maxPants: native.getNumberOfPedDrawableVariations(pedId, 4),
            maxShoes: native.getNumberOfPedDrawableVariations(pedId, 6)
        }
    }

    public getMaxTextureVariations(pedId: number, clothes: ClothesInterface): MaxDrawablesTexturesInterface {
        return {
            maxHat: native.getNumberOfPedPropTextureVariations(pedId, 0,
                    clothes.hat !== null ? clothes.hat.drawableId : -1) - 1,
            maxGlasses: native.getNumberOfPedPropTextureVariations(pedId, 1,
                    clothes.glasses !== null ? clothes.glasses.drawableId : -1) - 1,
            maxEars: native.getNumberOfPedPropTextureVariations(pedId, 2,
                    clothes.ears !== null ? clothes.ears.drawableId : -1) - 1,
            maxWatches: native.getNumberOfPedPropTextureVariations(pedId, 6,
                    clothes.watch !== null ? clothes.watch.drawableId : -1) - 1,
            maxBracelets: native.getNumberOfPedPropTextureVariations(pedId, 7,
                    clothes.bracelets !== null ? clothes.bracelets.drawableId : -1) - 1,
            maxMask: native.getNumberOfPedTextureVariations(pedId, 1,
                    clothes.mask !== null ? clothes.mask.drawableId : -1) - 1,
            maxTorsos: native.getNumberOfPedTextureVariations(pedId, 3,
                    clothes.torso !== null ? clothes.torso.drawableId : -1) - 1,
            maxTops: native.getNumberOfPedTextureVariations(pedId, 11,
                    clothes.top !== null ? clothes.top.drawableId : -1) - 1,
            maxBodyArmors: native.getNumberOfPedTextureVariations(pedId, 9,
                    clothes.bodyArmor !== null ? clothes.bodyArmor.drawableId : -1) - 1,
            maxBackPacks: native.getNumberOfPedTextureVariations(pedId, 5,
                    clothes.backPack !== null ? clothes.backPack.drawableId : -1) - 1,
            maxUnderShirts: native.getNumberOfPedTextureVariations(pedId, 8,
                    clothes.underShirt !== null ? clothes.underShirt.drawableId : -1) - 1,
            maxAccessories: native.getNumberOfPedTextureVariations(pedId, 7,
                    clothes.accessories !== null ? clothes.accessories.drawableId : -1) - 1,
            maxPants: native.getNumberOfPedTextureVariations(pedId, 4,
                    clothes.pants !== null ? clothes.pants.drawableId : -1) - 1,
            maxShoes: native.getNumberOfPedTextureVariations(pedId, 6,
                    clothes.shoes !== null ? clothes.shoes.drawableId : -1) - 1
        }
    }

    public getClothCategoryPrice(catalogItemName: string, compId: number): number {
        let price = 0;

        if (this.isClothingItemAProp(catalogItemName)) {
            switch (compId) {
                case 0:
                    price = 100;
                    break;
                case 1:
                    price = 100;
                    break;
                case 2:
                    price = 500;
                    break;
                case 6:
                    price = 500;
                    break;
                case 7:
                    price = 500;
                    break;
            }
        } else {
            switch (compId) {
                case 1:
                    price = 50;
                    break;
                case 4:
                    price = 50;
                    break;
                case 5:
                    price = 100;
                    break;
                case 6:
                    price = 50;
                    break;
                case 7:
                    price = 250;
                    break;
                case 8:
                    price = 25;
                    break;
                case 9:
                    price = 150;
                    break;
                case 10:
                    price = 25;
                    break;
                case 11:
                    price = 50;
                    break;
            }
        }

        return price;
    }
}