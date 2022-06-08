import {GroupRankInterface} from "../group/group-rank.interface";

export interface FileSystemRankSetup {
    canReadLevel: number;
    canWriteLevel: number;
    ranks: GroupRankInterface[];
}