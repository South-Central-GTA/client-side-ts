import {GroupPermission} from "@enums/group.permission";
import {BankingPermission} from "@enums/banking.permission";

export interface GroupRankInterface {
    groupId: number;
    level: number;
    name: string;
    groupPermission: GroupPermission;
    bankingPermissions: BankingPermission;
}