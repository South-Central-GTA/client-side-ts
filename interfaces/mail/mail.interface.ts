export interface MailInterface {
    id: number;
    senderMailAddress: string;
    targetMailAddressesJson: string;
    targetMailAddresses: string[]; // only client-side
    title: string;
    context: string;
    isAuthor: boolean;
    sendetAtJson: string;
}