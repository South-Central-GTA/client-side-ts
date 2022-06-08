import {MdcSearchType} from "@enums/mdc-search.type";

export interface MdcSearchEntityInterface {
    id: number;
    stringId: string;
    name: string;
    type: MdcSearchType;
}
