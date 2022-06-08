import {ComponentVariationInterface} from "./component-variation.interface";
import {PropVariationInterface} from "./prop-variation.interface";

export interface PedComponentVariationsInterface {
    DlcName: string;
    PedName: string;
    ComponentVariations: ComponentVariationInterface[];
    Props: PropVariationInterface[];
}
