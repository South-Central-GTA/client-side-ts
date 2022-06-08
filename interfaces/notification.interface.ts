import {NotificationTypes} from "@enums/notification.types";

export interface NotificationInterface {
    type: NotificationTypes;
    text: string;
}