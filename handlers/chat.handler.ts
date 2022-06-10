import {singleton} from "tsyringe";
import * as alt from "alt-client";
import * as native from "natives";
import {foundation} from "../decorators/foundation";
import {on, onGui, onServer} from "../decorators/events";
import {KeyCodes} from "@enums/keycode.type";
import {ChatModule} from "../modules/chat.module";
import {FreeCamModule} from "../modules/free-cam.module";
import {Player} from "@extensions/player.extensions";
import {EventModule} from "../modules/event.module";
import {LoggerModule} from "../modules/logger.module";
import {RaycastModule} from "../modules/raycast.module";
import {MathModule} from "../modules/math.module";
import {CommandInterface} from "@interfaces/command.interface";
import {MessageInterface} from "@interfaces/message.interface";
import {ChatType} from "@enums/chat.type";

@foundation() @singleton()
export class ChatHandler {
    private cachedCommands: CommandInterface[] = [];

    constructor(private readonly event: EventModule, private readonly freecam: FreeCamModule, private readonly chat: ChatModule, private readonly player: Player, private readonly logger: LoggerModule, private readonly raycast: RaycastModule, private readonly math: MathModule) {
    }

    @on("keydown")
    public keydown(key: number) {
        if (!this.chat.ready || this.player.isInAPrison || !this.player.isSpawnedCharacter) return;

        if (key === KeyCodes.T || key === KeyCodes.ENTER) {
            this.chat.openChat();
        }
        if (key === KeyCodes.ESCAPE) {
            if (this.chat.inputActive) {
                this.chat.closeChat(100);

                if (this.freecam.isActive) {
                    this.freecam.unfreeze();
                }
            }
        }
        if (key === KeyCodes.F5) {
            this.chat.toggleChatVisibility();
        }

        if (key === KeyCodes.F4) {
            this.chat.toggleTimestamp();
        }
    }

    @onServer("chat:setcommands")
    public setCommands(commands: CommandInterface[]) {
        this.cachedCommands = commands;

        if (this.chat.ready) {
            this.event.emitGui("chat:setcommands", this.cachedCommands);
        }
    }

    @onServer("chat:pushmessage")
    public onPushMessage(dimension: number, message: MessageInterface, position: alt.Vector3 = null) {
        const currInterior = native.getInteriorFromEntity(alt.Player.local.scriptID);
        const playerPos = alt.Player.local.pos;
        let mumble = false;

        if (dimension !== 0) {
            const dist = this.math.distance(playerPos, position);

            // Check if player is inside an interior and if the message source is 3 meters away.
            if (currInterior !== 0 && dist > 3) {

                const dir = this.math.subVector3(position, playerPos).normalize();
                const result = this.raycast.line(playerPos, dir, dist + 2, 1, alt.Player.local.scriptID);

                // Something is in the way cant read chat.
                if (result.isHit) {

                    mumble = true;

                    // If source is /not/ any screaming or megaphone
                    if (message.chatType !== ChatType.SCREAM && message.chatType !== ChatType.MEGAPHONE && message.chatType !== ChatType.DEP_SCREAM && message.chatType !== ChatType.PHONE_SCREAM && message.chatType !== ChatType.RADIO_SCREAM) {
                        return;
                    }
                }
            }
        }

        if (mumble) {
            const contextArray = message.context.split(" ");

            for (let i = 0; i < Math.floor(contextArray.length * 0.2); i++) {
                contextArray[Math.floor(Math.random() * contextArray.length)] = " <i>**undeutlich**</i> "
            }

            message.context = contextArray.join(" ");
        }

        // Could be the place to add other addons to the chat message
        // source is drunk or on drunks
        // source is heavly wounded
        // knocked out on ground
        // mouth is covered

        this.chat.sendMessage(message);
    }

    @onGui("chat:ready")
    public onChatLoaded() {
        this.event.emitGui("chat:setcommands", this.cachedCommands);
        this.chat.ready = true;
        this.chat.chatVisible = true;
    }

    @onGui("chat:sendmessage")
    public sendMessage(isCommand: boolean, message: string) {
        if (message && message.length > 0) {
            if (isCommand) {
                this.event.emitServer("command:execute", message);
            } else {
                this.event.emitServer("chat:sendmessage", message);
            }
        }

        this.chat.closeChat();

        if (this.freecam.isActive) {
            this.freecam.unfreeze();
        }
    }
}