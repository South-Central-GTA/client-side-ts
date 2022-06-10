import * as alt from "alt-client";
import * as native from "natives";
import {Player} from "@extensions/player.extensions";
import {MathModule} from "../modules/math.module";
import {TextModule} from "../modules/text.module";
import {UpdateModule} from "../modules/update.module";
import {foundation} from "../decorators/foundation";
import {singleton} from "tsyringe";

@foundation() @singleton()
export class NameTagHandler {

    public constructor(private readonly math: MathModule, private readonly text: TextModule, private readonly update: UpdateModule, private readonly player: Player) {
        this.update.add(() => this.tick());
    }

    private tick(): void {
        this.renderNameTags();
    }

    private renderNameTags(): void {
        if (alt.Player.all.length <= 1) return;

        const currentPlayers = [...alt.Player.all];
        let count = 0;

        currentPlayers.forEach((target: Player) => {
            if (count >= 30) {
                return;
            }

            const renderData = this.getPlayerOnScreen(target);
            if (!renderData) {
                return;
            }

            count += 1;

            if (target.hasStreamSyncedMeta("FREECAM")) {
                return;
            }

            const characterId = target.getSyncedMeta<number>("ID");
            const rpName = target.getSyncedMeta<string>("CHARACTER_NAME");
            const color = target.getSyncedMeta<string>("NAMECOLOR");
            const isTyping = target.getSyncedMeta<boolean>("IS_TYPING");

            let finalText = `${color}${rpName} [${characterId}]`;
            if (isTyping) {
                finalText = `${finalText}\n~b~~w~(schreibt)`;
            }

            const scale = 0.4 - renderData.dist * 0.01;
            this.text.drawText3d(finalText, renderData.pos.x, renderData.pos.y, renderData.pos.z + 1.3, scale, 4, 255,
                    255, 255, 200, true, false);
        });
    }

    private getPlayerOnScreen(target: alt.Player) {
        if (target === alt.Player.local) {
            return undefined;
        }

        const onScreen = native.isEntityOnScreen(target.scriptID);
        if (!onScreen) {
            return undefined;
        }

        const dist = this.math.distance(alt.Player.local.pos, target.pos);
        if (dist > 25) {
            return undefined;
        }

        const id = alt.Player.local.scriptID;
        const los = native.hasEntityClearLosToEntity(id, target.scriptID, 17);
        if (!los) {
            return undefined;
        }

        return {name: target.name, dist, pos: target.pos};
    }
}
