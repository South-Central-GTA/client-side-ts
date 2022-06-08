import {HouseInterface} from "../house.interface";
import {GroupMemberInterface} from "./group-member.interface";
import {GroupRankInterface} from "./group-rank.interface";
import {GroupType} from "@enums/group.type";

export interface GroupInterface {
    id: number;
    name: string;
    status: number;
    groupType: GroupType;
    members: GroupMemberInterface[];
    ranks: GroupRankInterface[];
    houses: HouseInterface[];
}