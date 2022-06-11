import {AdminPermission} from "@enums/admin.permission";

export interface AccountInterface {
    id: number;
    discordId: string;
    currentName: string;
    nameHistoryJson: string
    southCentralPoints: number;
    permission: AdminPermission;
    avatarUrl: string;
    lastUsageJson: string;
    createdAtJson: string;
}