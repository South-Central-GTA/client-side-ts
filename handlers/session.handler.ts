import * as alt from "alt-client";
import * as native from "natives";
import {GuiModule} from "../modules/gui.module";
import {CameraModule} from "../modules/camera.module";
import {singleton} from "tsyringe";
import {on} from "../decorators/events";
import {foundation} from "../decorators/foundation";
import {Player} from "@extensions/player.extensions";
import {LoadingSpinnerModule} from "../modules/loading-spinner.module";
import {LoggerModule} from "../modules/logger.module";

@foundation() @singleton()
export class SessionHandler {
    public constructor(private readonly player: Player, private readonly camera: CameraModule, private readonly gui: GuiModule, private readonly spinner: LoadingSpinnerModule, private readonly logger: LoggerModule) {
    }

    @on("disconnect")
    public onPlayerDisconnect(): void {
        this.player.fadeOut(0);
        this.camera.destroyCamera();
        native.destroyAllCams(true);
    }

    @on("connectionComplete")
    public onPlayerConnectionComplete(): void {
        this.player.fadeOut(0);
        this.player.blurScreen(0);
        this.player.hideRadarAndHud();
        this.player.setVisible(false);
        this.player.freeze();
        this.player.showLoginCam();

        native.setClockTime(12, 0, 0);

        native.replaceHudColourWithRgba(143, 231, 76, 60, 255);
        native.replaceHudColourWithRgba(116, 231, 76, 60, 255);

        this.logger.info("Connection completed got called.")

        this.loadIpls();
    }

    private loadIpls(): void {
        alt.requestIpl("facelobby");
        alt.requestIpl("v_tunnel_hole");
        alt.requestIpl("v_tunnel_hole_lod");

        native.activateInteriorEntitySet(native.getInteriorAtCoordsWithType(-38.62, -1099.01, 27.31, "v_carshowroom"),
                "csr_beforeMission");
        native.activateInteriorEntitySet(native.getInteriorAtCoordsWithType(-38.62, -1099.01, 27.31, "v_carshowroom"),
                "shutter_closed");

        alt.requestIpl('ex_dt1_02_office_02b');
        alt.requestIpl('chop_props');
        alt.requestIpl('FIBlobby');
        alt.removeIpl('FIBlobbyfake');
        alt.requestIpl('FBI_colPLUG');
        alt.requestIpl('FBI_repair');
        alt.requestIpl('v_tunnel_hole');
        alt.requestIpl('TrevorsMP');
        alt.requestIpl('TrevorsTrailer');
        alt.requestIpl('TrevorsTrailerTidy');
        alt.removeIpl('farmint');
        alt.removeIpl('farm_burnt');
        alt.removeIpl('farm_burnt_props');
        alt.removeIpl('des_farmhs_endimap');
        alt.removeIpl('des_farmhs_end_occl');
        alt.requestIpl('farm');
        alt.requestIpl('farm_props');
        alt.requestIpl('farm_int');
        alt.requestIpl('facelobby');
        alt.removeIpl('CS1_02_cf_offmission');
        alt.requestIpl('CS1_02_cf_onmission1');
        alt.requestIpl('CS1_02_cf_onmission2');
        alt.requestIpl('CS1_02_cf_onmission3');
        alt.requestIpl('CS1_02_cf_onmission4');
        alt.requestIpl('v_rockclub');
        alt.requestIpl('v_janitor');
        alt.removeIpl('hei_bi_hw1_13_door');
        alt.requestIpl('bkr_bi_hw1_13_int');
        alt.removeIpl('v_carshowroom');
        alt.removeIpl('shutter_open');
        alt.removeIpl('shutter_closed');
        alt.removeIpl('shr_int');
        alt.requestIpl('csr_afterMission');
        alt.requestIpl('v_carshowroom');
        alt.requestIpl('shr_int');
        alt.requestIpl('shutter_closed');
        alt.requestIpl('smboat');
        alt.requestIpl('smboat_distantlights');
        alt.requestIpl('smboat_lod');
        alt.requestIpl('smboat_lodlights');
        alt.requestIpl('cargoship');
        alt.requestIpl('railing_start');
        alt.removeIpl('sp1_10_fake_interior');
        alt.removeIpl('sp1_10_fake_interior_lod');
        alt.requestIpl('sp1_10_real_interior');
        alt.requestIpl('sp1_10_real_interior_lod');
        alt.removeIpl('id2_14_during_door');
        alt.removeIpl('id2_14_during1');
        alt.removeIpl('id2_14_during2');
        alt.removeIpl('id2_14_on_fire');
        alt.removeIpl('id2_14_post_no_int');
        alt.removeIpl('id2_14_pre_no_int');
        alt.removeIpl('id2_14_during_door');
        alt.requestIpl('id2_14_during1');
        alt.removeIpl('Coroner_Int_off');
        alt.requestIpl('coronertrash');
        alt.requestIpl('Coroner_Int_on');
        alt.removeIpl('bh1_16_refurb');
        alt.removeIpl('jewel2fake');
        alt.removeIpl('bh1_16_doors_shut');
        alt.requestIpl('refit_unload');
        alt.requestIpl('post_hiest_unload');
        alt.requestIpl('Carwash_with_spinners');
        alt.requestIpl('KT_CarWash');
        alt.requestIpl('ferris_finale_Anim');
        alt.removeIpl('ch1_02_closed');
        alt.requestIpl('ch1_02_open');
        alt.requestIpl('AP1_04_TriAf01');
        alt.requestIpl('CS2_06_TriAf02');
        alt.requestIpl('CS4_04_TriAf03');
        alt.removeIpl('scafstartimap');
        alt.requestIpl('scafendimap');
        alt.removeIpl('DT1_05_HC_REMOVE');
        alt.requestIpl('DT1_05_HC_REQ');
        alt.requestIpl('DT1_05_REQUEST');
        alt.requestIpl('dt1_05_hc_remove');
        alt.requestIpl('dt1_05_hc_remove_lod');
        alt.requestIpl('FINBANK');
        alt.removeIpl('DT1_03_Shutter');
        alt.removeIpl('DT1_03_Gr_Closed');
        alt.requestIpl('golfflags');
        alt.requestIpl('airfield');
        alt.requestIpl('v_garages');
        alt.requestIpl('v_foundry');
        alt.requestIpl('hei_yacht_heist');
        alt.requestIpl('hei_yacht_heist_Bar');
        alt.requestIpl('hei_yacht_heist_Bedrm');
        alt.requestIpl('hei_yacht_heist_Bridge');
        alt.requestIpl('hei_yacht_heist_DistantLights');
        alt.requestIpl('hei_yacht_heist_enginrm');
        alt.requestIpl('hei_yacht_heist_LODLights');
        alt.requestIpl('hei_yacht_heist_Lounge');
        alt.requestIpl('hei_carrier');
        alt.requestIpl('hei_Carrier_int1');
        alt.requestIpl('hei_Carrier_int2');
        alt.requestIpl('hei_Carrier_int3');
        alt.requestIpl('hei_Carrier_int4');
        alt.requestIpl('hei_Carrier_int5');
        alt.requestIpl('hei_Carrier_int6');
        alt.requestIpl('hei_carrier_LODLights');
        alt.requestIpl('bkr_bi_id1_23_door');
        alt.requestIpl('lr_cs6_08_grave_closed');
        alt.requestIpl('hei_sm_16_interior_v_bahama_milo_');
        alt.requestIpl('CS3_07_MPGates');
        alt.requestIpl('cs5_4_trains');
        alt.requestIpl('v_lesters');
        alt.requestIpl('v_trevors');
        alt.requestIpl('v_michael');
        alt.requestIpl('v_comedy');
        alt.requestIpl('v_cinema');
        alt.requestIpl('V_Sweat');
        alt.requestIpl('V_35_Fireman');
        alt.requestIpl('redCarpet');
        alt.requestIpl('triathlon2_VBprops');
        alt.requestIpl('jetstenativeurnel');
        alt.requestIpl('Jetsteal_ipl_grp1');
        alt.requestIpl('v_hospital');
        alt.removeIpl('RC12B_Default');
        alt.removeIpl('RC12B_Fixed');
        alt.requestIpl('RC12B_Destroyed');
        alt.requestIpl('RC12B_HospitalInterior');
        alt.requestIpl('canyonriver01');
        alt.requestIpl('canyonriver01_lod');
        alt.requestIpl('cs3_05_water_grp1');
        alt.requestIpl('cs3_05_water_grp1_lod');
        alt.requestIpl('trv1_trail_start');
        alt.requestIpl('CanyonRvrShallow');

        // CASINO
        alt.requestIpl('vw_casino_penthouse');
        alt.requestIpl('vw_casino_main');
        alt.requestIpl('vw_casino_carpark');
        alt.requestIpl('vw_dlc_casino_door');
        alt.requestIpl('vw_casino_door');
        alt.requestIpl('hei_dlc_windows_casino');
        alt.requestIpl('hei_dlc_casino_door');
        alt.requestIpl('hei_dlc_casino_aircon');
        alt.requestIpl('vw_casino_garage');

        let interiorID = native.getInteriorAtCoords(1100.0, 220.0, -50.0);
        if (native.isValidInterior(interiorID)) {
            native.activateInteriorEntitySet(interiorID, '0x30240D11');
            native.activateInteriorEntitySet(interiorID, '0xA3C89BB2');
            native.refreshInterior(interiorID);
        }

        interiorID = native.getInteriorAtCoords(976.6364, 70.29476, 115.1641);
        if (native.isValidInterior(interiorID)) {
            native.activateInteriorEntitySet(interiorID, 'teste1');
            native.activateInteriorEntitySet(interiorID, 'teste2');
            native.activateInteriorEntitySet(interiorID, 'teste3');
            native.activateInteriorEntitySet(interiorID, 'teste4');
            native.activateInteriorEntitySet(interiorID, 'teste11');
            native.activateInteriorEntitySet(interiorID, 'teste17');
            native.activateInteriorEntitySet(interiorID, 'teste18');
            native.activateInteriorEntitySet(interiorID, 'teste19');
            native.activateInteriorEntitySet(interiorID, 'teste20');
            native.activateInteriorEntitySet(interiorID, 'teste21');
            native.activateInteriorEntitySet(interiorID, 'teste29');
            native.activateInteriorEntitySet(interiorID, 'teste32');
            native.activateInteriorEntitySet(interiorID, 'teste33');
            native.activateInteriorEntitySet(interiorID, 'teste34');
            native.activateInteriorEntitySet(interiorID, 'teste1');
            native.activateInteriorEntitySet(interiorID, 'teste2');
            native.activateInteriorEntitySet(interiorID, 'teste4');
            native.activateInteriorEntitySet(interiorID, 'teste11');
            native.refreshInterior(interiorID);
        }
    }
}
