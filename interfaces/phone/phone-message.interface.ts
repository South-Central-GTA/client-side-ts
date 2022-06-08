export interface PhoneMessageInterface {
    id: number;
    chatId: number;
    sendetAt: string;
    ownerId: number;
    context: string;
    senderPhoneNumber?: string;
    targetPhoneNumber?: string;
    local: boolean;
}