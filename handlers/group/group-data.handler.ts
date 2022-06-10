import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {onServer} from "../../decorators/events";
import {EventModule} from "../../modules/event.module";
import {HouseModule} from "../../modules/house.module";
import {LoggerModule} from "../../modules/logger.module";
import {GroupModule} from "../../modules/group.module";
import {GroupInterface} from "@interfaces/group/group.interface";
import {CompanyInterface} from "@interfaces/group/company.interface";
import {FactionInterface} from "@interfaces/group/faction.interface";

@foundation() @singleton()
export class GroupDataHandler {
    constructor(private readonly event: EventModule, private readonly house: HouseModule, private readonly logger: LoggerModule, private readonly group: GroupModule) {
    }

    @onServer("group:setup")
    public onSetup(allGroups: GroupInterface[], groups: GroupInterface[], company?: CompanyInterface, faction?: FactionInterface): void {
        for (let i = 0; i < allGroups.length; i++) {
            const group = allGroups[i];

            for (let g = 0; g < group.houses.length; g++) {
                group.houses[g].streetName = this.house.getStreet(group.houses[g].streetDirection,
                        new alt.Vector3(group.houses[g].positionX, group.houses[g].positionY,
                                group.houses[g].positionZ));
            }
        }

        if (company !== null) {
            for (let g = 0; g < company.houses.length; g++) {
                company.houses[g].streetName = this.house.getStreet(company.houses[g].streetDirection,
                        new alt.Vector3(company.houses[g].positionX, company.houses[g].positionY,
                                company.houses[g].positionZ));
            }
        }

        if (faction !== null) {
            for (let g = 0; g < faction.houses.length; g++) {
                faction.houses[g].streetName = this.house.getStreet(faction.houses[g].streetDirection,
                        new alt.Vector3(faction.houses[g].positionX, faction.houses[g].positionY,
                                faction.houses[g].positionZ));
            }
        }

        this.group.setup(allGroups, groups, company, faction);

        this.event.emitGui("group:setup", allGroups, groups, company, faction);
    }
}