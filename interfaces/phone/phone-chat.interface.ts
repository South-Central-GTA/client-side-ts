import {PhoneMessageInterface} from "./phone-message.interface";

export interface PhoneChatInterface {
    id: number;
    phoneNumber: string;
    name: string;
    lastUsage: string;
    messages: PhoneMessageInterface[];
}