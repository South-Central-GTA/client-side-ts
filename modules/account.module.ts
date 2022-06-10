import {singleton} from "tsyringe";
import {AccountInterface} from "@interfaces/account.interface";

@singleton()
export class AccountModule {
    private account: AccountInterface;

    public constructor() {
    }

    get getAccount() {
        return this.account;
    }

    public setup(account: AccountInterface): void {
        this.account = account;
    }
} 