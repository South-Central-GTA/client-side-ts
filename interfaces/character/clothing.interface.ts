import {GenderType} from "@enums/gender.type";

export interface ClothingInterface {
    genderType: GenderType;
    drawableId: number;
    textureId: number;
    title: string;
}
