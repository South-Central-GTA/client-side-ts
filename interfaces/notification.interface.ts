import { NotificationType } from "../enums/notification.type";
import { NotificationPositionType } from "../enums/notification-position.type";

export interface NotificationInterface {
    type: NotificationType;
    text: string;
}