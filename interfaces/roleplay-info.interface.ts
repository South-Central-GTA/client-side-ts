export interface RoleplayInfoInterface {
    id: number;
    accountName?: string;
    characterName?: string;
    context: string;
    dimension: number;
    distance: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    roll: number;
    pitch: number;
    yaw: number;
    createdAtJson: string;

    marker?: number; // only clientside
}