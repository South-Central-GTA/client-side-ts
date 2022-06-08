import {PedOverlayInterface} from "./ped-overlay.interface";

export interface PedOverlayCollectionInterface {
    CollectionName: string;
    CollectionHash: number;

    Overlays: PedOverlayInterface[];
}