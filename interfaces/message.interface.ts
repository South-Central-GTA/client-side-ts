import {ChatType} from "../enums/chat.type";

export interface MessageInterface {
    sender: string;
    context: string;
    color?: string;
    afterName?: string;
    beforeChat?: string;
    afterChat?: string;
    nameColor?: string;
    backgroundColor?: string;
    sendetAt: string;
    chatType: ChatType;
}
