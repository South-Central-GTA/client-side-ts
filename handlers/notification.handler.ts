import {singleton} from "tsyringe";
import {onGui, onServer} from "../decorators/events";
import {foundation} from "../decorators/foundation";
import {NotificationModule} from "../modules/notification.module";
import {NotificationInterface} from "@interfaces/notification.interface"
import {NotificationTypes} from "@enums/notification.types";

@foundation() @singleton()
export class NotificationHandler {
    public constructor(private notification: NotificationModule) {
    }

    @onServer("notification:send")
    public sendNotification(notification: NotificationInterface): void {
        this.notification.sendNotification(notification);
    }

    @onGui("notification:error")
    public guiError(errorMessage: string): void {
        const notification: NotificationInterface = {
            type: NotificationTypes.ERROR, text: errorMessage,
        };

        this.notification.sendNotification(notification);
    }
}
