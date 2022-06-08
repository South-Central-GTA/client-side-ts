import {MailingPermission} from "@enums/mailing.permission";

export interface MailAccountCharacterAccessInterface {
    bankAccountId: number;
    permission: MailingPermission;
    name: string;
    characterId: number;
    owner: boolean;
}