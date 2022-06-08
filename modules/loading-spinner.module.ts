import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {LoadingSpinnerType} from "@enums/loadingspinner.type";

@singleton()
export class LoadingSpinnerModule {
    get isActive(): boolean {
        return native.busyspinnerIsOn();
    }

    public show(loadingText: string = null, spinnerType: LoadingSpinnerType = LoadingSpinnerType.REGULAR_CLOCKWISE): void {
        this.hide();

        if (loadingText == null) {
            native.beginTextCommandBusyspinnerOn("");
        } else {
            native.beginTextCommandBusyspinnerOn("STRING");
            native.addTextComponentSubstringPlayerName(loadingText);
        }
        native.endTextCommandBusyspinnerOn(spinnerType);
    }

    public hide(): void {
        if (this.isActive) {
            const int = alt.setInterval(() => {
                if (native.busyspinnerIsDisplaying()) {
                    native.busyspinnerOff();
                    alt.clearInterval(int);
                }
            }, 1);
        }
    }
}