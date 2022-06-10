import {singleton} from "tsyringe";
import {GroupInterface} from "@interfaces/group/group.interface";
import {CompanyInterface} from "@interfaces/group/company.interface";
import {FactionInterface} from "@interfaces/group/faction.interface";

@singleton()
export class GroupModule {
    private allGroups: GroupInterface[];
    private groups: GroupInterface[];
    private company?: CompanyInterface;
    private faction?: FactionInterface;

    public constructor() {
    }

    get getAllGroups() {
        return this.allGroups;
    }

    get getGroups() {
        return this.groups;
    }

    get getCompany() {
        return this.company;
    }

    get getFaction() {
        return this.faction;
    }

    public setup(allGroups: GroupInterface[], groups: GroupInterface[], company?: CompanyInterface, faction?: FactionInterface): void {
        this.allGroups = allGroups;
        this.groups = groups;
        this.company = company;
        this.faction = faction;
    }
} 