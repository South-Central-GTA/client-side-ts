export enum GroupPermission {
    NONE = 0,
    MANAGE_MEMBERS = 1 << 1,
    INVITE = 1 << 2,
    UNINVITE = 1 << 3,

    CHANGE_DELIVERY_VISIBILITY = 1 << 4,
    ORDER_PRODUCTS = 1 << 5,
    BUY_LICENSES = 1 << 6,
    SELL_LICENSES = 1 << 7,
}