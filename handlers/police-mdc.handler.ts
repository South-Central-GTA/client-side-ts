import { singleton } from "tsyringe";
import { foundation } from "../decorators/foundation";
import {on, onGui, onServer} from "../decorators/events";
import alt from "alt-client";
import native from "natives";
import {EventModule} from "../modules/event.module";
import {CharacterInterface} from "../interfaces/character/character.interface";
import {BankAccountInterface} from "../interfaces/bank/bank-account.interface";
import {HouseInterface} from "../interfaces/house.interface";
import {VehicleInterface} from "../interfaces/vehicle.interface";
import {CriminalRecordInterface} from "../interfaces/mdc/criminal-record.interface";
import {MdcNodeInterface} from "../interfaces/mdc/mdc-node.interface";
import {HouseModule} from "../modules/house.module";

@foundation()
@singleton()
export class PoliceMdcHandler {

    constructor(
        private readonly event: EventModule,
        private readonly house: HouseModule
    ) {
    }
    
    @onServer("policemdc:opencharacterrecord")
    public onOpenCharacterRecord(character: CharacterInterface, records: CriminalRecordInterface[], nodes: MdcNodeInterface[], vehicles: VehicleInterface[], houses: HouseInterface[], bankAccounts: BankAccountInterface[], phoneNumbers: string[]): void {
        houses.forEach((house: HouseInterface) => {
           house.streetName = this.house.getStreet(house.streetDirection, new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        });
        
        this.event.emitGui("policemdc:opencharacterrecord", character, records, nodes, vehicles, houses, bankAccounts, phoneNumbers)
    }
}