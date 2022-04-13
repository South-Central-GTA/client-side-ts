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
import {MdcMedicalEntryInterface} from "../interfaces/mdc/mdc-medical-entry.interface";
import {MdcAllergyInterface} from "../interfaces/mdc/mdc-allergy.interface";

@foundation()
@singleton()
export class FireMdcHandler {

    constructor(
        private readonly event: EventModule,
        private readonly house: HouseModule
    ) {
    }
    
    @onServer("firemdc:openpatientrecord")
    public onOpenPatientRecord(character: CharacterInterface, houses: HouseInterface[], phoneNumbers: string[], medicalHistory: MdcMedicalEntryInterface[], allergies: MdcAllergyInterface[]): void {
        houses.forEach((house: HouseInterface) => {
           house.streetName = this.house.getStreet(house.streetDirection, new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        });
        
        this.event.emitGui("firemdc:openpatientrecord", character, houses, phoneNumbers, medicalHistory, allergies)
    }
}