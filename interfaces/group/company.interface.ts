import {LicenseType} from "@enums/license.type";
import {GroupInterface} from "./group.interface";

export interface CompanyInterface extends GroupInterface {
    licenses: LicenseType;
    products: number;
    deliveryVisibilityStatus: number;
}