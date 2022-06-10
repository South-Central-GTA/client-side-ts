import * as native from "natives";
import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {PhoneInterface} from "@interfaces/phone/phone.interface";
import {EventModule} from "./event.module";
import {Player} from "@extensions/player.extensions";
import {PhoneChatInterface} from "@interfaces/phone/phone-chat.interface";
import {PhoneMessageInterface} from "@interfaces/phone/phone-message.interface";
import {PhoneContactInterface} from "@interfaces/phone/phone-contact.interface";
import {LoggerModule} from "./logger.module";
import {InputType} from "@enums/input.type";
import {UpdateModule} from "./update.module";
import {NotificationModule} from "./notification.module";
import {GuiModule} from "./gui.module";
import {NotificationTypes} from "@enums/notification.types";

@singleton()
export class PhoneModule {
    public phoneId: number;
    public phoneNumber: string;
    public hasPhone: boolean = false;
    public ready: boolean = false;
    public inCall: boolean = false;

    private updateId: string;
    private phone: PhoneInterface;

    public constructor(private readonly event: EventModule, private readonly player: Player, private readonly gui: GuiModule, private readonly logger: LoggerModule, private readonly updater: UpdateModule, private readonly notification: NotificationModule) {
    }

    public setup(phone: PhoneInterface): void {
        this.phoneId = phone.id;
        this.phoneNumber = phone.phoneNumber;
        this.phone = phone;
        this.hasPhone = true;

        if (this.ready) {
            this.sendToUI();
        }
    }

    public update(phone: PhoneInterface): void {
        this.phone = phone;

        if (this.ready) {
            this.sendToUI();
        }
    }

    public sendToUI(): void {
        this.event.emitGui("phone:setup", this.phone);
    }

    public remove(): void {
        this.close();
        this.hasPhone = false;

        this.event.emitGui("phone:reset");
    }

    public open(): void {
        if (this.player.getIsPhoneOpen && this.hasPhone) return;

        this.updateId = this.updater.add(() => this.toggleActions());

        this.player.setIsPhoneOpen = true;
        this.player.showCursor();
        this.player.lockCamera(true);
        this.player.blockESC(true);
        this.gui.focusView();
        native.setPlayerCanDoDriveBy(alt.Player.local.scriptID, false);

        this.event.emitGui("phone:toggle", true);
    }

    public close(): void {
        if (!this.player.getIsPhoneOpen && this.hasPhone) return;

        alt.setTimeout(() => {
            this.updater.remove(this.updateId);
        }, 100);

        this.player.setIsPhoneOpen = false;
        this.player.setIsAnyTextFieldFocused = false;

        this.player.lockCamera(false);
        this.player.blockGameControls(false);
        this.player.hideCursor();
        this.player.blockESC(false);
        this.gui.unfocusView();
        native.setPlayerCanDoDriveBy(alt.Player.local.scriptID, true);

        this.event.emitGui("phone:toggle", false);
    }

    public getCallFrom(displayedName: string): void {
        this.event.emitGui("phone:getcallfrom", displayedName);
    }

    public callNumber(displayedName: string): void {
        this.event.emitGui("phone:setupcall", displayedName);
    }

    public updateLastUsage(chatId: number): void {
        this.event.emitServer("phone:updatelastusage", this.phoneId, chatId);
    }

    public openNewChat(oldId: number, chat: PhoneChatInterface): void {
        this.event.emitGui("phone:opennewchat", oldId, chat);
    }

    public addChat(chat: PhoneChatInterface): void {
        this.event.emitServer("phone:addchat", this.phoneId, JSON.stringify(chat));
    }

    public deleteChat(chatId: number): void {
        this.event.emitServer("phone:deletechat", chatId);
    }

    public pushMessage(message: PhoneMessageInterface): void {
        this.event.emitServer("phone:pushmessage", this.phoneId, message.chatId, message.context);
    }

    public addContact(contact: PhoneContactInterface): void {
        this.event.emitServer("phone:addcontact", this.phoneId, JSON.stringify(contact));
    }

    public editContact(contact: PhoneContactInterface): void {
        this.event.emitServer("phone:editcontact", this.phoneId, JSON.stringify(contact));
    }

    public removeContact(contactId: number): void {
        this.event.emitServer("phone:removecontact", this.phoneId, contactId);
    }

    public denyCurrentCall(): void {
        this.event.emitServer("phone:denycall");
    }

    public acceptCurrentCall(): void {
        this.event.emitServer("phone:acceptcall", this.phoneId);
        this.inCall = true;

        this.notification.sendNotification({
            type: NotificationTypes.INFO,
            text: "Mit der Pfeiltaste nach unten kannst du dein Handy wegpacken und wieder laufen.",
        });
    }

    public hangupCurrentCall(): void {
        this.event.emitServer("phone:hangup");
        this.inCall = false;
    }

    public callGotHanguped(): void {
        this.event.emitGui("phone:callgothungup");
        this.inCall = false;
    }

    public callGotDenied(): void {
        this.event.emitGui("phone:callgotdenied");
        this.inCall = false;
    }

    private toggleActions(): void {
        native.disableControlAction(0, InputType.LOOK_LR, true);
        native.disableControlAction(0, InputType.LOOK_UD, true);
        native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_X, true);
        native.disableControlAction(0, InputType.SCRIPT_RIGHT_AXIS_Y, true);
        native.disableControlAction(0, InputType.WEAPON_WHEEL_NEXT, true);
        native.disableControlAction(0, InputType.WEAPON_WHEEL_PREV, true);
        native.disableControlAction(0, InputType.SELECT_NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.SELECT_PREV_WEAPON, true);
        native.disableControlAction(0, InputType.SELECT_WEAPON, true);
        native.disableControlAction(0, InputType.NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.PREV_WEAPON, true);
        native.disableControlAction(0, InputType.AIM, true);
        native.disableControlAction(0, InputType.ATTACK, true);
        native.disableControlAction(0, InputType.ATTACK2, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK1, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK2, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_LIGHT, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_HEAVY, true);
        native.disableControlAction(0, InputType.MELEE_ATTACK_ALTERNATE, true);
        native.disableControlAction(0, InputType.RADIO_WHEEL_LR, true);
        native.disableControlAction(0, InputType.RADIO_WHEEL_UD, true);
        native.disableControlAction(0, InputType.VEH_NEXT_RADIO, true);
        native.disableControlAction(0, InputType.VEH_PREV_RADIO, true);
        native.disableControlAction(0, InputType.VEH_RADIO_WHEEL, true);
        native.disableControlAction(0, InputType.VEH_SELECT_NEXT_WEAPON, true);
        native.disableControlAction(0, InputType.VEH_SELECT_PREV_WEAPON, true);
    }
}