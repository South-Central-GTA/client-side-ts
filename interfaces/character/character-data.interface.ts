import {ClothesInterface} from "./clothes.interface";
import {CharacterInterface} from "@interfaces/character/character.interface";

export interface CharacterDataInterface {
    character: CharacterInterface;
    clothings: ClothesInterface | undefined;
}