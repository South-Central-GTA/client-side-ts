import * as alt from "alt-client";
import * as native from "natives";
import {RaycastResultInterface} from "@interfaces/raycastresult.interface";
import {singleton} from "tsyringe";

@singleton()
export class RaycastModule {
    public constructor() {
    }

    /**
     * Shoots a line racast and returns a result object.
     * @param startPos The start position from the raycast.
     * @param dir The direction from the raycast.
     * @param dist The max distance for the raycast, be carefull Number.MAX_VALUE dosen't work.
     * @param flags The diffrent flags for this raycast, see wiki for more informations.
     * @param ignoredEntity The entity that get ignored when the raycast got fired.
     */
    public line(startPos: alt.Vector3, dir: alt.Vector3, dist: number, flags: number, ignoredEntity: number): RaycastResultInterface {
        let targetPos = this.getTargetPos(startPos, new alt.Vector3(dir.x * dist, dir.y * dist, dir.z * dist));

        let ray = native.startExpensiveSynchronousShapeTestLosProbe(startPos.x, startPos.y, startPos.z, targetPos.x,
                targetPos.y, targetPos.z, flags, ignoredEntity, // entity that get ignored from raycast.
                0,);
        return this.result(ray);
    }

    private getTargetPos(entityVector: alt.Vector3, forwardVector: alt.Vector3): alt.Vector3 {
        return new alt.Vector3(entityVector.x + forwardVector.x, entityVector.y + forwardVector.y,
                entityVector.z + forwardVector.z);
    }

    private result(ray: any): RaycastResultInterface {
        let result = native.getShapeTestResult(ray, undefined, undefined, undefined, undefined);
        let hitEntity = result[4];

        return {
            isHit: result[1],
            pos: new alt.Vector3(result[2].x, result[2].y, result[2].z),
            normal: new alt.Vector3(result[3].x, result[3].y, result[3].z),
            entity: hitEntity
        }
    }

    private getModel(entity: number) {
        if (!native.isModelValid(entity)) return null;

        native.getEntityModel(entity);
    }
}