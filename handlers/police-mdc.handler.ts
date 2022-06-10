import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import alt from "alt-client";
import {EventModule} from "../modules/event.module";
import {CharacterInterface} from "@interfaces/character/character.interface";
import {BankAccountInterface} from "@interfaces/bank/bank-account.interface";
import {HouseInterface} from "@interfaces/house.interface";
import {VehicleInterface} from "@interfaces/vehicles/vehicle.interface";
import {CriminalRecordInterface} from "@interfaces/mdc/criminal-record.interface";
import {MdcNoteInterface} from "@interfaces/mdc/mdc-note.interface";
import {HouseModule} from "../modules/house.module";
import {PoliceTicketInterface} from "@interfaces/mdc/police-ticket.interface";

@foundation() @singleton()
export class PoliceMdcHandler {

    constructor(private readonly event: EventModule, private readonly house: HouseModule) {
    }

    @onServer("policemdc:opencharacterrecord")
    public onOpenCharacterRecord(character: CharacterInterface, records: CriminalRecordInterface[], tickets: PoliceTicketInterface[], nodes: MdcNoteInterface[], vehicles: VehicleInterface[], houses: HouseInterface[], bankAccounts: BankAccountInterface[], phoneNumbers: string[]): void {
        houses.forEach((house: HouseInterface) => {
            house.streetName = this.house.getStreet(house.streetDirection,
                    new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        });

        this.event.emitGui("policemdc:opencharacterrecord", character, records, tickets, nodes, vehicles, houses,
                bankAccounts, phoneNumbers)
    }
}