import * as alt from "alt-client";
import {singleton} from "tsyringe";
import {foundation} from "decorators/foundation";
import {on, onGui, onServer} from "decorators/events";
import {KeyCodes} from "@enums/keycode.type";
import {EventModule} from "modules/event.module";
import {PhoneModule} from "modules/phone.module";
import {PhoneChatInterface} from "@interfaces/phone/phone-chat.interface";
import {PhoneMessageInterface} from "@interfaces/phone/phone-message.interface";
import {PhoneContactInterface} from "@interfaces/phone/phone-contact.interface";
import {GuiModule} from "modules/gui.module";
import {Player} from "@extensions/player.extensions";
import {NotificationModule} from "modules/notification.module";
import {LoggerModule} from "modules/logger.module";
import {PhoneInterface} from "@interfaces/phone/phone.interface";
import {BankingPermission} from "@enums/banking.permission";
import {LicenseType} from "@enums/license.type";
import {NotificationTypes} from "@enums/notification.types";

@foundation() @singleton()
export class PhoneHandler {
    private phoneKeyPressedTimes: number = 0;

    constructor(private readonly event: EventModule, private readonly phone: PhoneModule, private readonly gui: GuiModule, private readonly player: Player, private readonly notification: NotificationModule, private readonly logger: LoggerModule) {
        alt.setInterval(() => {
            if (!this.phone.hasPhone) return;

            if (this.phoneKeyPressedTimes > 0) {
                this.phoneKeyPressedTimes--;
            }
        }, 700);
    }

    @on("keydown")
    public onKeydown(key: number): void {
        if (!this.phone.hasPhone || this.player.isInAPrison || !this.player.isSpawnedCharacter) return;

        if (key === KeyCodes.UP_ARROW) {
            if (this.player.getIsChatting || this.player.getIsAnyMenuOpen || this.player.hasInteractionOpen) return;

            this.phoneKeyPressedTimes++;

            if (this.phoneKeyPressedTimes >= 2) {
                this.event.emitServer("phone:requestopen", this.phone.phoneId);
                this.phoneKeyPressedTimes = 0;
            }

            if (this.phone.inCall) {
                this.event.emitGui("phone:setphonedown", false);
            }

            if (this.player.getIsPhoneOpen) {
                this.gui.focusView();
                this.player.showCursor();
                this.player.lockCamera(true);
            }
        }
        if (key === KeyCodes.DOWN_ARROW) {
            if (this.player.getIsPhoneOpen) {
                if (this.phone.inCall) {
                    this.gui.unfocusView(true);
                    this.player.hideCursor(true);
                    this.player.lockCamera(false, true);
                    this.event.emitGui("phone:setphonedown", true);

                    this.notification.sendNotification({
                        type: NotificationTypes.INFO,
                        text: "Mit der Pfeiltaste nach oben kannst du dein Handy wieder fokussieren.",
                    });
                } else {
                    this.phone.close();
                }
            }
        }
    }

    @onServer("phone:setup")
    public onSetup(phone: PhoneInterface): void {
        this.phone.setup(phone);
    }

    @onServer("phone:update")
    public onUpdate(phone: PhoneInterface): void {
        if (this.phone.phoneId === phone.id) {
            this.phone.update(phone);
        }
    }

    @onServer("phone:remove")
    public onRemove(): void {
        this.phone.remove();
    }

    @onServer("phone:open")
    public onOpenPhone(phone: PhoneInterface): void {
        this.phone.setup(phone);
        this.phone.open();
    }

    @onServer("phone:close")
    public onClosePhone(): void {
        this.phone.close();
    }

    @onServer("phone:getcallfrom")
    public onGetCallFrom(displayedName: string, callOnPhoneId: number): void {
        if (this.phone.phoneId === callOnPhoneId) {
            this.phone.getCallFrom(displayedName);
        }
    }

    @onServer("phone:callnumber")
    public onCallNumber(displayedName: string): void {
        this.phone.callNumber(displayedName);
    }

    @onServer("phone:callgothungup")
    public onCallGotHangup(): void {
        this.phone.callGotHanguped();
        this.event.emitGui("phone:setphonedown", false);
        this.gui.focusView();
        this.player.showCursor();
        this.player.lockCamera(true);
    }

    @onServer("phone:callgotdenied")
    public onCallGotDenied(): void {
        this.phone.callGotDenied();
        this.event.emitGui("phone:setphonedown", false);
        this.gui.focusView();
        this.player.showCursor();
        this.player.lockCamera(true);
    }

    @onServer("phone:opennewchat")
    public onOpenNewChat(oldId: number, chat: PhoneChatInterface): void {
        this.phone.openNewChat(oldId, chat);
    }

    @onGui("phone:ready")
    public onPhoneLoaded(): void {
        this.phone.ready = true;
        this.phone.sendToUI();
    }

    @onGui("phone:call")
    public onCallPhone(phoneNumber: string): void {
        this.event.emitServer("phone:call", phoneNumber, this.phone.phoneNumber);

        this.phone.inCall = true;

        this.notification.sendNotification({
            type: NotificationTypes.INFO,
            text: "Mit der Pfeiltaste nach unten kannst du dein Handy wegpacken und wieder laufen.",
        });
    }

    @onGui("phone:updatelastusage")
    public onUpdateLastUsage(chatId: number): void {
        this.phone.updateLastUsage(chatId);
    }

    @onGui("phone:addchat")
    public onAddChat(chat: PhoneChatInterface): void {
        this.phone.addChat(chat);
    }

    @onGui("phone:deletechat")
    public onDeleteChat(chatId: number): void {
        this.phone.deleteChat(chatId);
    }

    @onGui("phone:pushmessage")
    public onPushMessage(message: PhoneMessageInterface): void {
        this.phone.pushMessage(message);
    }

    @onGui("phone:addcontact")
    public onAddContact(contact: PhoneContactInterface): void {
        this.phone.addContact(contact);
    }

    @onGui("phone:editcontact")
    public onEditContact(contact: PhoneContactInterface): void {
        this.phone.editContact(contact);
    }

    @onGui("phone:removecontact")
    public onRemoveContact(contactId: number): void {
        this.phone.removeContact(contactId);
    }

    @onGui("phone:denycall")
    public onDeniedCall(): void {
        this.phone.denyCurrentCall();
    }

    @onGui("phone:acceptcall")
    public onAcceptCall(): void {
        this.phone.acceptCurrentCall();
    }

    @onGui("phone:hangup")
    public onHangupCall(): void {
        this.phone.hangupCurrentCall();
    }

    @onGui("phone:selectbackground")
    public onSelectBackground(id: number): void {
        this.event.emitServer("phone:selectbackground", this.phone.phoneId, id);
    }

    @onGui("phone:opennotifications")
    public onOpenNotifications(): void {
        this.event.emitServer("phone:opennotifications", this.phone.phoneId);
    }

    @onGui("phone:deletenotification")
    public onDeleteNotification(id: number): void {
        this.event.emitServer("phone:deletenotification", this.phone.phoneId, id);
    }

    @onGui("phonebank:createaccount")
    public onPhoneBankCreateAccount(bankAccountId: number): void {
        this.event.emitServer("phonebank:createaccount", this.phone.phoneId, bankAccountId);
    }

    @onGui("phonebank:addcharacteraccess")
    public onPhoneBankAddCharacter(bankAccountId: number, characterName: string): void {
        this.event.emitServer("bank:addcharacteraccess", this.phone.phoneId, bankAccountId, characterName);
    }

    @onGui("phonebank:removeaccess")
    public onPhoneBankRemoveAccess(bankAccountId: number, characterId: number): void {
        this.event.emitServer("bank:removeaccess", this.phone.phoneId, bankAccountId, characterId);
    }

    @onGui("phonebank:addpermission")
    public onPhoneBankAddPermission(bankAccountId: number, characterId: number, permission: BankingPermission): void {
        this.event.emitServer("bank:addpermission", this.phone.phoneId, bankAccountId, characterId, permission);
    }

    @onGui("phonebank:removepermission")
    public onPhoneBankRemovePermission(bankAccountId: number, characterId: number, permission: BankingPermission): void {
        this.event.emitServer("bank:removepermission", this.phone.phoneId, bankAccountId, characterId, permission);
    }

    @onGui("phonebank:deletebankaccount")
    public onPhoneBankDeleteAccount(bankAccountId: number): void {
        this.event.emitServer("bank:deletebankaccount", this.phone.phoneId, bankAccountId);
    }

    @onGui("phonecompany:create")
    public onPhoneCompanyCreate(name: string, bankAccountId: number, houseId: number): void {
        this.event.emitServer("company:create", this.phone.phoneId, name, bankAccountId, houseId);
    }

    @onGui("phonedelivery:orderproducts")
    public onOrderProducts(amount: number): void {
        this.event.emitServer("delivery:orderproducts", this.phone.phoneId, amount);
    }

    @onGui("phonedelivery:selectdelivery")
    public onSelectDelivery(deliveryId: number): void {
        this.event.emitServer("delivery:selectdelivery", this.phone.phoneId, deliveryId);
    }

    @onGui("phonecompany:buylicenses")
    public onBuyLicenses(companyId: number, license: LicenseType): void {
        this.event.emitServer("company:buylicenses", this.phone.phoneId, companyId, license);
    }

    @onGui("phonecompany:selllicenses")
    public onSellLicenses(companyId: number, license: LicenseType): void {
        this.event.emitServer("company:selllicenses", this.phone.phoneId, companyId, license);
    }

    @onGui("phoneleasecompany:cancelcontract")
    public onLeaseCompanyCancelContract(companyId: number, leaseCompanyId: number): void {
        this.event.emitServer("leasecompany:cancelcontract", this.phone.phoneId, companyId, leaseCompanyId);
    }
}
    