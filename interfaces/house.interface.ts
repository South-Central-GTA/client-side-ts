export interface HouseInterface {
    id: number;
    interiorId: number;
    houseNumber: number;
    subName: string;
    houseType: number;
    ownerId: number;
    groupOwnerId: number;
    price: number;
    southCentralPoints: number;

    positionX: number;
    positionY: number;
    positionZ: number;
    roll: number;
    pitch: number;
    yaw: number;
    rentable: boolean;
    blockedOwnership: boolean;

    streetDirection: number;
    lockState: number;

    //Only clientside
    streetName: string;
}