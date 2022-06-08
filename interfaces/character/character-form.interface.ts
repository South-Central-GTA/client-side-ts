import {CharProfileInterface} from "./charprofile.interface";

export interface CharacterFormInterface {
    profile: CharProfileInterface;
    startMoney: number;
    hasPhone: boolean;
    isRegistered: boolean;
    hasDrivingLicense: boolean;
}
