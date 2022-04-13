import * as alt from "alt-client";
import { singleton } from "tsyringe";
import { onServer, onGui } from "../decorators/events";
import { foundation } from "../decorators/foundation";
import { NotificationModule } from "../modules/notification.module";
import { NotificationInterface } from "../interfaces/notification.interface";
import { NotificationType } from "../enums/notification.type";
import { NotificationPositionType } from "../enums/notification-position.type";
                
@foundation()
@singleton()
export class NotificationHandler {
    public constructor(
        private notification: NotificationModule) { }

    @onServer("notification:send")
    public sendNotification(notification: NotificationInterface): void {
        this.notification.sendNotification(notification);
    }

    @onGui("notification:error")
    public guiError(errorMessage: string): void {
        const notification: NotificationInterface = {
            type: NotificationType.ERROR,
            text: errorMessage
        };

        this.notification.sendNotification(notification);
    }
}
