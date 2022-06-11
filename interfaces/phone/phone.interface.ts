import {PhoneContactInterface} from "./phone-contact.interface";
import {PhoneChatInterface} from "./phone-chat.interface";
import {PhoneNotificationInterface} from "./phone-notification";

export interface PhoneInterface {
    id: number;
    phoneNumber: string;
    active: boolean;
    backgroundImageId: number;
    ownerId: number;
    lastTimeOpenedNotificationsJson: string;
    contacts: PhoneContactInterface[];
    chats: PhoneChatInterface[];
    notifications: PhoneNotificationInterface[];
}