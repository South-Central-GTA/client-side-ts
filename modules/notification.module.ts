import {singleton} from "tsyringe";
import {NotificationInterface} from "@interfaces/notification.interface";
import {EventModule} from "./event.module";

@singleton()
export class NotificationModule {

    public constructor(private readonly event: EventModule) {
    }

    public sendNotification(notification: NotificationInterface): void {
        this.event.emitGui("notification:push", notification);
    }

    //public sendGTANotification(notification: INotification): void {
    //    native.beginTextCommandThefeedPost("CELL_EMAIL_BCON");
    //    this.pushLongString(notification.Message, (textblock) => {
    //        native.addTextComponentSubstringPlayerName(textblock);
    //    });
    //    native.thefeedSetNextPostBackgroundColor(notification.Color);
    //    native.endTextCommandThefeedPostTicker(notification.Blink, false);
    //}

    //private pushLongString(message: string, action: { (textBlock: string): void }): void {
    //    message.match(/.{1,99}/g).forEach(textBlock => {
    //        action(textBlock);
    //    });
    //}
}