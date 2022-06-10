import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import {ChatModule} from "../modules/chat.module";
import {ChatType} from "@enums/chat.type";
import {EventModule} from "../modules/event.module";

@foundation() @singleton()
export class EmergencyCallHandler {
    constructor(private readonly chat: ChatModule, private readonly event: EventModule) {
    }

    @onServer("emergencycall:sendmessage")
    private onStartDialog(content: string): void {
        this.chat.sendMessage({
            chatType: ChatType.PHONE_SPEAK,
            color: "#f3f59f",
            context: content,
            afterName: " sagt: ",
            sender: "Dispatch",
            sendetAt: Date.now().toString()
        });
    }
}