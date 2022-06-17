import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onGui, onServer} from "../decorators/events";
import {EventModule} from "../modules/event.module";
import {DialogModule} from "../modules/dialog.module";
import {LoggerModule} from "../modules/logger.module";
import {DialogInterface} from "@interfaces/dialog.interface";

@foundation() @singleton()
export class DialogHandler {

    constructor(private readonly event: EventModule, private readonly dialog: DialogModule, private readonly logger: LoggerModule) {
    }

    @onServer("dialog:create")
    public onCreate(dialog: DialogInterface): void {
        this.dialog.create(dialog);
    }

    @onGui("dialog:closebuttonclicked")
    public onCloseButtonClicked(serverEvent: string, clientEvent: string): void {
        this.sendEvents(serverEvent, clientEvent);
        this.dialog.destroy();
    }

    @onGui("dialog:primarybuttonclicked")
    public onPrimaryButtonClicked(serverEvent: string, clientEvent: string, bankAccountId: number, inputContent: string): void {
        this.handleButtonClicked(serverEvent, clientEvent, bankAccountId, inputContent);
    }

    @onGui("dialog:secondarybuttonclicked")
    public onSecondaryButtonClicked(serverEvent: string, clientEvent: string, bankAccountId: number, inputContent: string): void {
        this.handleButtonClicked(serverEvent, clientEvent, bankAccountId, inputContent);
    }

    private handleButtonClicked(serverEvent: string, clientEvent: string, bankAccountId: number, inputContent: string): void {
        this.sendEvents(serverEvent, clientEvent, bankAccountId, inputContent);

        this.dialog.destroy();
    }

    private sendEvents(serverEvent: string, clientEvent: string, bankAccountId: number = -1, inputContent: string = ""): void {
        if (this.dialog.getCurrentDialog.dataJson === "null" || !this.dialog.getCurrentDialog.dataJson) {
            if (this.dialog.getCurrentDialog.hasInputField) {
                if (this.dialog.getCurrentDialog.hasBankAccountSelection) {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, bankAccountId, inputContent);
                    }

                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, bankAccountId, inputContent);
                    }
                } else {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, inputContent);
                    }

                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, inputContent);
                    }
                }
            } else {
                if (this.dialog.getCurrentDialog.hasBankAccountSelection) {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, bankAccountId);
                    }

                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, bankAccountId);
                    }
                } else {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent);
                    }

                    if (clientEvent !== null) {
                        this.event.emit(clientEvent);
                    }
                }
            }
        } else {
            const data = JSON.parse(this.dialog.getCurrentDialog.dataJson);

            if (this.dialog.getCurrentDialog.hasBankAccountSelection) {
                if (this.dialog.getCurrentDialog.hasInputField) {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, bankAccountId, inputContent, ...data);
                    }

                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, bankAccountId, inputContent, ...data);
                    }
                } else {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, bankAccountId, ...data);
                    }

                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, bankAccountId, ...data);
                    }
                }
            } else {
                if (this.dialog.getCurrentDialog.hasInputField) {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, inputContent, ...data);
                    }

                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, inputContent, ...data);
                    }
                } else {
                    if (serverEvent !== null) {
                        this.event.emitServer(serverEvent, ...data);
                    }

                    if (clientEvent !== null) {
                        this.event.emit(clientEvent, ...data);
                    }
                }
            }
        }
    }
}