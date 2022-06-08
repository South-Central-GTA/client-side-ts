import {singleton} from "tsyringe";
import {LeaseCompanyType} from "@enums/lease-company.type";

@singleton()
export class LeaseCompanyModule {
    constructor() {
    }

    public getCompanyTypeName(type: LeaseCompanyType): string {
        switch (type) {
            case LeaseCompanyType.SUPERMARKET:
                return "Supermarkt";
            case LeaseCompanyType.CLOTHING_STORE:
                return "Kleidungsladen";
            case LeaseCompanyType.HAIR_STUDIO:
                return "Haarsalon";
            case LeaseCompanyType.TATTOO_STUDIO:
                return "Tattoostudio";
            case LeaseCompanyType.AMMUNATION:
                return "Waffenladen";
            case LeaseCompanyType.GAS_STATION:
                return "Tankstelle";
        }
    }

    public getCompanyTypeBlip(type: LeaseCompanyType): number {
        switch (type) {
            case LeaseCompanyType.SUPERMARKET:
                return 52;
            case LeaseCompanyType.CLOTHING_STORE:
                return 73;
            case LeaseCompanyType.HAIR_STUDIO:
                return 71;
            case LeaseCompanyType.TATTOO_STUDIO:
                return 75;
            case LeaseCompanyType.AMMUNATION:
                return 110;
            case LeaseCompanyType.GAS_STATION:
                return 361;
        }
    }
}