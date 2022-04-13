import { ComponentVariationInterface } from "./component-variation.interface";
import { PropVariationInterface } from "./prop-variation.interface";

export class PedComponentVariationsInterface {
    DlcName: string; 
    PedName: string; 
    ComponentVariations: ComponentVariationInterface[];
    Props: PropVariationInterface[];
}
