import {LicenseType} from "@enums/license.type";

export interface LicenseInterface {
    license: LicenseType;
    name: string;
    price: number;
}
