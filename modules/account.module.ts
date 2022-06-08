import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {AccountInterface} from "@interfaces/account.interface";

@singleton()
export class AccountModule {
    get getAccount() {
        return this.account;
    }

    private account: AccountInterface;

    public constructor() {
    }

    public setup(account: AccountInterface): void {
        this.account = account;
    }
} 