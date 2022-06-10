import * as alt from "alt-client";
import {foundation} from "../decorators/foundation";
import {singleton} from "tsyringe";
import {onGui, onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";

@foundation() @singleton()
export class HudHandler {
    private ready: boolean;
    private money: number = 0;

    public constructor(private readonly event: EventModule) {
    }

    @onGui("hud:ready")
    public onLoaded(): void {
        this.ready = true;

        this.event.emitGui("hud:setmoney", this.money);
        this.event.emitGui("hud:updatehealth", alt.Player.local.health, alt.Player.local.armour);
    }

    @onServer("hud:setmoney")
    public setMoney(amount: number): void {
        this.money = amount;

        if (this.ready) {
            this.event.emitGui("hud:setmoney", this.money);
        }
    }
}
