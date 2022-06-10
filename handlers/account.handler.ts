import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {LoggerModule} from "../modules/logger.module";
import {AccountModule} from "../modules/account.module";
import {AccountInterface} from "@interfaces/account.interface";

@foundation() @singleton()
export class AccountHandler {
    constructor(private readonly event: EventModule, private readonly account: AccountModule, private readonly logger: LoggerModule) {
    }

    @onServer("account:sync")
    public onSync(account: AccountInterface): void {
        this.account.setup(account);
        this.event.emitGui("account:sync", account);
    }

    @onServer("account:setpermissions")
    public onSetPermission(permission: number): void {
        this.account.getAccount.permission = permission;
        this.event.emitGui("account:sync", this.account.getAccount);
    }
}