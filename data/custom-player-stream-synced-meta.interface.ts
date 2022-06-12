import {DeathState} from "@enums/death.state";

export interface ICustomPlayerStreamSyncedMeta {
    deathState: DeathState;
    sirenMuted: boolean;
}

export enum METAKEY_STREAM_SYNC {
    DEATH_STATE = "deathState",
    SIREN_MUTED = "sirenMuted",
}