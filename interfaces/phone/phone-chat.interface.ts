import {PhoneMessageInterface} from "./phone-message.interface";

export interface PhoneChatInterface {
    id: number;
    phoneNumber: string;
    name: string;
    lastUsageJson: string;
    messages: PhoneMessageInterface[];
}