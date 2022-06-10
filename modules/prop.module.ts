import * as alt from "alt-client";
import * as native from "natives";
import {AttachEntityOptions} from "@enums/attachentity.options";
import {singleton} from "tsyringe";

@singleton()
export class PropModule {
    private propID: number;

    public constructor() {
    }

    /**
     * Create new prop object
     *
     * @param {string} name
     * @returns {this}
     */
    public create(name: string) {
        let model = native.getHashKey(name);
        let pPos = alt.Player.local.pos;

        this.propID = native.createObject(model, pPos.x, pPos.y, pPos.z, true, true, false);
        return this;
    }

    /**
     * Attach created prop to entity
     *
     * @param {number} entity
     * @param {number} bone
     * @param {AttachEntityOptions} options
     */
    public attachToEntity(entity: number, bone: number, options: AttachEntityOptions = {}) {
        let defaultOptions = new AttachEntityOptions();

        options = {...defaultOptions, ...options};

        native.attachEntityToEntity(this.propID, entity, bone, options.xPos, options.yPos, options.zPos, options.xRot,
                options.yRot, options.zRot, options.p9, options.useSoftPinning, options.collision, options.isPed,
                options.vertexIndex, options.fixedRot);
    }

}


