export enum AdminPermission {
    NONE = 0, TESTER = 1 << 0,

    STAFF = TESTER | 1 << 1, FACTION_MANAGEMENT = STAFF | 1 << 2, EVENT_MANAGEMENT = STAFF | 1 << 3, TEAM_MANAGEMENT = STAFF | 1 << 4,

    MOD = STAFF | 1 << 5, ADMIN = STAFF | MOD | 1 << 6, DEV = STAFF | 1 << 7, OWNER = STAFF | MOD | ADMIN | DEV | 1 << 8
}