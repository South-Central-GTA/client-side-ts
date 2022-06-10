import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "../../decorators/foundation";
import {on, onServer} from "../../decorators/events";
import {TextModule} from "../../modules/text.module";
import {UpdateModule} from "../../modules/update.module";
import {LoggerModule} from "../../modules/logger.module";
import {HouseModule} from "../../modules/house.module";
import {KeyCodes} from "@enums/keycode.type";
import {EventModule} from "../../modules/event.module";
import {MathModule} from "../../modules/math.module";
import {Player} from "../../extensions/player.extensions";
import {BlipModule} from "../../modules/blip.module";
import {LeaseCompanyModule} from "../../modules/group/lease-company.module";
import {HouseInterface} from "@interfaces/house.interface";
import {LeaseCompanyInterface} from "@interfaces/group/lease-company.interface";
import {InteriorInterface} from "@interfaces/interior.interface";

@foundation() @singleton()
export class HouseHandler {
    constructor(private readonly text: TextModule, private readonly update: UpdateModule, private readonly logger: LoggerModule, private readonly house: HouseModule, private readonly event: EventModule, private readonly math: MathModule, private readonly blip: BlipModule, private readonly leaseCompany: LeaseCompanyModule, private readonly player: Player) {
        this.update.add(() => this.tick());
    }

    @on("keydown")
    public onKeydown(key: number): void {
        if (this.player.getIsAnyTextOpen) {
            return;
        }

        if (key === KeyCodes.F) {
            const house = this.house.getHouses.find(
                    h => this.math.distance(new alt.Vector3(h.positionX, h.positionY, h.positionZ),
                            alt.Player.local.pos) <= 1.5);
            const exit = this.house.getInteriors.find(
                    e => this.math.distance(new alt.Vector3(e.x, e.y, e.z), alt.Player.local.pos) <= 1.5);

            if (!alt.Player.local.vehicle && house || !alt.Player.local.vehicle && exit) {
                this.event.emitServer("house:enterexit");
            }
        }
    }

    @onServer("houses:add")
    public onAdd(house: HouseInterface | LeaseCompanyInterface): void {
        this.house.add(house);

        this.house.updateBlips();
    }

    @onServer("houses:remove")
    public remove(houseId: number): void {
        this.house.remove(houseId);

        this.house.updateBlips();
    }

    @onServer("houses:update")
    public async updateHouse(house: HouseInterface | LeaseCompanyInterface): Promise<void> {
        await this.house.update(house);

        this.house.updateBlips();
    }

    @onServer("houses:syncchunk")
    public async sync(houses: HouseInterface[] | LeaseCompanyInterface[]): Promise<void> {
        await this.house.syncChunk(houses);
        this.house.updateBlips();
    }

    @onServer("houses:syncexits")
    public syncExits(interiors: InteriorInterface[]): void {
        this.house.syncExits(interiors);
    }

    @onServer("player:setaduty")
    public setAduty(state: boolean): void {
        if (state) {
            this.house.showDebugBlips();
        } else {
            this.house.hideDebugBlips();
        }

        this.house.updateBlips();
    }

    @onServer("house:updatecharacterhouses")
    public onUpdateCharacterHouses(houses: HouseInterface[]): void {

        houses.forEach((house: HouseInterface) => {

            if (this.house.isLeaseCompany(house)) {
                const leaseCompany = house as LeaseCompanyInterface;
                leaseCompany.typeName = this.leaseCompany.getCompanyTypeName(leaseCompany.leaseCompanyType);
            }

            house.streetName = this.house.getStreet(house.streetDirection,
                    new alt.Vector3(house.positionX, house.positionY, house.positionZ));
        });

        this.event.emitGui("house:updatecharacterhouses", houses)
    }

    private tick(): void {
        this.drawHouseTexts();
    }

    private drawHouseTexts(): void {
        this.house.getHouses.forEach((house: any) => {
            if (house as HouseInterface) {
                if (house.blockedOwnership && !this.player.isAduty) {
                    return;
                }

                const houseNumberText = `Nr. ${house.houseNumber}`;
                const streetText = `${house.streetName}.`;

                let houseTypeText = "Immobilie";
                let lowerText = `${streetText} ${houseNumberText}`;
                let colorText = "~g~";

                if (house.subName.length !== 0) {
                    lowerText = `${streetText} ${house.subName} ${houseNumberText}`;
                }

                if (house.rentable) {
                    houseTypeText = "Mietbare Immobilie";
                }

                if (house.houseType === 1) {
                    const leaseCompany: LeaseCompanyInterface = house;

                    houseTypeText = "Pachtbarer Unternehmenssitz";
                    colorText = "~b~";

                    if (house.subName !== "") {
                        lowerText = `${house.subName} ${this.leaseCompany.getCompanyTypeName(
                                leaseCompany.leaseCompanyType)}`;
                    } else {
                        lowerText = `${this.leaseCompany.getCompanyTypeName(leaseCompany.leaseCompanyType)}`;
                    }

                    const index = this.house.getHouses.indexOf(leaseCompany);
                    this.house.getHouses[index] = leaseCompany;
                }

                let defaultText = `${colorText}${houseTypeText}:\n~w~${lowerText}`;

                if (this.player.isAduty) {
                    defaultText = `${colorText}${houseTypeText} [${house.id}]:\n~w~${lowerText}`;
                }

                if (house.ownerId !== -1 || house.groupOwnerId !== -1) {
                    this.text.drawText3dWithDistance(defaultText, house.positionX, house.positionY, house.positionZ + 1,
                            0.4, 0, 255, 255, 255, 175, false, true, 2);
                } else {
                    if (house.rentable) {
                        this.text.drawText3dWithDistance(`${defaultText}\n${colorText}$${house.price} /renthouse`,
                                house.positionX, house.positionY, house.positionZ + 1, 0.4, 0, 255, 255, 255, 175,
                                false, true, 2);
                    } else {
                        this.text.drawText3dWithDistance(`${defaultText}\n${colorText}$${house.price} /buyhouse`,
                                house.positionX, house.positionY, house.positionZ + 1, 0.4, 0, 255, 255, 255, 175,
                                false, true, 2);
                    }
                }
            }
        });
    }
}