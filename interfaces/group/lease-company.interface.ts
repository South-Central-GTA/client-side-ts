import {HouseInterface} from "../house.interface";
import {LeaseCompanyType} from "@enums/lease-company.type";

export interface LeaseCompanyInterface extends HouseInterface {
    leaseCompanyType: LeaseCompanyType;
    playerDuty: boolean;
    cashierX: number;
    cashierY: number;
    cashierZ: number;
    cashierHeading: number;

    //Only clientside
    typeName: string;
}