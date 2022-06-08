import {PersonalLicenseType} from "@enums/personal-license.type";

export interface PersonalLicenseInterface {
    id: number;
    type: PersonalLicenseType;
    warnings: number;
}
