export enum MailingPermission {
    NONE = 0,
    SENDING = 1 << 0,
    READING = 1 << 1,
    DELETING = 1 << 2,
}