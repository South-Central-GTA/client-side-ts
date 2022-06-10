import * as native from "natives";
import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {HouseInterface} from "@interfaces/house.interface";
import {LoggerModule} from "./logger.module";
import {Player} from "@extensions/player.extensions";
import {BlipModule} from "./blip.module";
import {InteriorInterface} from "@interfaces/interior.interface";
import {LeaseCompanyModule} from "./group/lease-company.module";
import {LeaseCompanyInterface} from "@interfaces/group/lease-company.interface";

@singleton()
export class HouseModule {
    private adutyHouseBlips: number[] = [];
    private leaseCompanyBlips: number[] = [];
    private ownedHouseBlips: number[] = [];
    private houses: HouseInterface[] = [];
    private interiors: InteriorInterface[] = [];

    constructor(private readonly logger: LoggerModule, private readonly blip: BlipModule, private readonly leaseCompany: LeaseCompanyModule, private readonly player: Player) {
    }

    get getHouses() {
        return this.houses;
    }

    get getInteriors() {
        return this.interiors;
    }

    public add(house: HouseInterface | LeaseCompanyInterface): void {
        house.streetName = this.getStreet(house.streetDirection,
                new alt.Vector3(house.positionX, house.positionY, house.positionZ));

        this.houses.push(house);
    }

    public remove(houseId: number): void {
        this.houses = this.houses.filter(h => h.id !== houseId);
    }

    public async update(house: HouseInterface | LeaseCompanyInterface): Promise<void> {
        this.updateHouse(house);
    }

    public async syncChunk(houses: HouseInterface[] | LeaseCompanyInterface[]): Promise<void> {
        for (const house of houses) {
            house.streetName = this.getStreet(house.streetDirection,
                    new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        }

        this.houses = this.houses.concat(houses);
    }

    public syncExits(positions: InteriorInterface[]): void {
        this.interiors = positions;
    }

    public getStreet(direction: number, pos: alt.Vector3): string {
        const [_, street, crossingStreet] = native.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);

        if (direction === 1) {
            return native.getStreetNameFromHashKey(street);
        }
        if (direction === 2) {
            return native.getStreetNameFromHashKey(crossingStreet);
        }
    }

    public updateBlips(): void {
        if (this.player.isAduty) {
            this.hideDebugBlips();
            this.showDebugBlips();
        }

        this.hideOwnerIcon();
        this.showOwnerIcon();

        this.hideLeaseCompanyBlips();
        this.showLeaseCompanyBlips();
    }

    public showOwnerIcon(): void {
        this.houses.filter(h => h.houseType === 0 && h.ownerId === this.player.characterId)
                .forEach((house: HouseInterface) => {
                    this.ownedHouseBlips.push(
                            this.blip.createBlip(new alt.Vector3(house.positionX, house.positionY, house.positionZ), 2,
                                    40, "Deine Immobilie", false));
                });
    }

    public showDebugBlips(): void {
        this.houses.filter(h => h.houseType === 0).forEach((house: HouseInterface) => {
            this.adutyHouseBlips.push(
                    this.blip.createBlip(new alt.Vector3(house.positionX, house.positionY, house.positionZ), 2, 40,
                            "Immobilie", false));
        });
    }

    public showLeaseCompanyBlips(): void {
        this.houses.filter(h => h.houseType === 1).forEach((house: LeaseCompanyInterface) => {
            let sprite = this.leaseCompany.getCompanyTypeBlip(house.leaseCompanyType);
            const color = house.playerDuty ? 2 : 4;

            this.leaseCompanyBlips.push(
                    this.blip.createBlip(new alt.Vector3(house.positionX, house.positionY, house.positionZ), color,
                            sprite, "", false));
        });
    }

    public hideOwnerIcon(): void {
        this.ownedHouseBlips.forEach((houseBlip: number) => {
            this.blip.destroyBlip(houseBlip);
        });
    }

    public hideDebugBlips(): void {
        this.adutyHouseBlips.forEach((houseBlip: number) => {
            this.blip.destroyBlip(houseBlip);
        });
    }

    public hideLeaseCompanyBlips(): void {
        this.leaseCompanyBlips.forEach((houseBlip: number) => {
            this.blip.destroyBlip(houseBlip);
        });
    }

    public isHouse(house: HouseInterface | LeaseCompanyInterface): house is HouseInterface {
        return (house as HouseInterface).houseType === 0;
    }

    public isLeaseCompany(house: HouseInterface | LeaseCompanyInterface): house is LeaseCompanyInterface {
        return (house as HouseInterface).houseType === 1;
    }

    private updateHouse(house: any): void {
        const savedHouse = this.houses.find(h => h.id === house.id);
        if (!savedHouse) {
            return;
        }

        house.streetName = this.getStreet(house.streetDirection,
                new alt.Vector3(house.positionX, house.positionY, house.positionZ))

        const index = this.houses.indexOf(savedHouse);
        this.houses[index] = house;
    }
}