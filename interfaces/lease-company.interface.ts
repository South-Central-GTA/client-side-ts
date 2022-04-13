import { LeaseCompanyType } from "../enums/lease-company.type";
import { HouseInterface } from "./house.interface";

export class LeaseCompanyInterface extends HouseInterface {
    leaseCompanyType: LeaseCompanyType;
    playerDuty: boolean;
    cashierX: number;
    cashierY: number;
    cashierZ: number;
    cashierHeading: number;

    //Only clientside
    typeName: string;
}