import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";

@foundation() @singleton()
export class TuningHandler {
    //private showcaseVehicle: number;
    //private updateId: string;
    //private activeVehicle: IVehicle;

    //public constructor(
    //    private readonly camera: CameraModule,
    //    private readonly player: Player,
    //    private readonly logger: LoggerModule,
    //    private readonly event: EventModule,
    //    private readonly update: UpdateModule,
    //    private readonly vehicle: VehicleModule
    //) { }

    //@onServer("tuning:open")
    //public async open(vehicle: IVehicle) {
    //    this.createCamera();
    //    this.player.unblurScreen(500);
    //    this.player.freeze();

    //    this.event.emitGui("gui:routeto", "tuning");

    //    await this.createVehicle(vehicle).then(() => {
    //        this.addMods(vehicle);

    //        // Timeout again because we cant emit on routeto event.
    //        alt.setTimeout(() => {
    //            this.sendUIData(vehicle);
    //        }, 100);
    //    });
    //}

    //@onServer("tuning:close")
    //@on("disconnect")
    //public close() {
    //    this.event.emitGui("tuning:reset");
    //    native.deleteVehicle(this.showcaseVehicle);
    //    this.showcaseVehicle = null;
    //}

    //@onGui("tuning:setcamerapos")
    //public setCameraPos(index: number) {
    //    let pos: alt.Vector3 = new alt.Vector3(0, 0, 0);
    //    let rot: alt.Vector3 = new alt.Vector3(0, 0, 0);

    //    switch (index) {
    //        case 0:
    //            pos = new alt.Vector3(-215.998, -1323.604, 34.253);
    //            rot = new alt.Vector3(-41.496, 0, -97.327);
    //            break;
    //        case 1:
    //            pos = new alt.Vector3(-214.350, -1327.589, 31.115);
    //            rot = new alt.Vector3(-17.913, 0, -33.861);
    //            break;
    //        case 2:
    //            pos = new alt.Vector3(-208.735, -1326.363, 31.115);
    //            rot = new alt.Vector3(-9.921, 0, 54.326);
    //            break;
    //        case 3:
    //            pos = new alt.Vector3(-208.819, -1319.859, 31.244);
    //            rot = new alt.Vector3(-9.212, 0, 144.797);
    //            break;
    //        default:
    //            pos = new alt.Vector3(-215.998, -1323.604, 34.253);
    //            rot = new alt.Vector3(-41.496, 0, -97.327);
    //            break;
    //    }

    //    this.camera.moveCamera(pos, rot, 850);
    //}

    //@onGui("tuning:rotate")
    //public rotate(dir: number) {
    //    this.update.remove(this.updateId);
    //    this.updateId = this.update.add(() => this.tick(dir));
    //}

    //@onGui("tuning:rotatestop")
    //public rotateStop() {
    //    this.update.remove(this.updateId);
    //}

    //@onGui("tuning:updatemod")
    //public setMod(mod: number, index: number) {
    //    this.vehicle.addMod(this.showcaseVehicle, mod, index);
    //}

    //@onGui("tuning:removemod")
    //public removeMod(mod: number) {
    //    this.vehicle.removeMod(this.showcaseVehicle, mod);
    //}

    //@onGui("tuning:save")
    //public save(mods: IVehicleMods) {
    //    const [primColor, secColor] = this.vehicle.getColor(this.showcaseVehicle);

    //    this.event.emitServer("tuning:save", this.activeVehicle.id, this.vehicle.convertToServer(mods), primColor, secColor);
    //}

    //@onGui("tuning:selectcolor")
    //public selectColor(index: number) {
    //    this.vehicle.changePrimColor(this.showcaseVehicle, index);
    //    this.vehicle.changeSecColor(this.showcaseVehicle, index);
    //}

    //private createCamera() {
    //    const pos = new alt.Vector3(-215.998, -1323.604, 34.253);
    //    const rot = new alt.Vector3(-41.496, 0, -97.327);

    //    this.camera.createCamera(pos, rot);
    //}

    //private async createVehicle(vehicle: IVehicle) {
    //    if (this.showcaseVehicle)
    //        return;

    //    const hash = alt.hash(vehicle.name);
    //    await loadModel(hash);

    //    this.activeVehicle = vehicle;
    //    this.showcaseVehicle = this.vehicle.createShowcaseVehicle(hash, -211.872, -1324.166, 29.89, 145.0299, vehicle.primColor, vehicle.secColor);
    //}

    //private tick(dir: number) {
    //    let heading = native.getEntityHeading(this.showcaseVehicle);
    //    const newHeading = (heading += dir);

    //    native.setEntityHeading(this.showcaseVehicle, newHeading);
    //}

    //private addMods(vehicle: IVehicle) {
    //    if (!this.showcaseVehicle)
    //        return;

    //    this.vehicle.addMods(this.showcaseVehicle, this.vehicle.convertToClient(vehicle.mods));
    //}

    //private async sendUIData(vehicle: IVehicle) {
    //    const modMaxNums: number[] = [];

    //    for (let index = 0; index <= 48; index++) {
    //        const modNum = native.getNumVehicleMods(this.showcaseVehicle, index) - 1;

    //        modMaxNums.push(modNum);
    //    }

    //    this.event.emitGui("tuning:sendmoddata", modMaxNums);
    //    this.event.emitGui("tuning:sendcurrentmods", this.vehicle.convertToClient(vehicle.mods));
    //    this.event.emitGui("tuning:sendvehicleclass", this.vehicle.getClass(this.showcaseVehicle));
    //}
}