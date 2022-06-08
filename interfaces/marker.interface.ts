export interface MarkerInterface {
    type: number;
    positionX: number
    positionY: number
    positionZ: number
    sizeX: number;
    sizeY: number;
    sizeZ: number;

    red: number;
    green: number;
    blue: number;
    alpha: number;
    bobUpAndDown: boolean

    hasText?: boolean;
    text?: string;
}