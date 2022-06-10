import * as alt from "alt-client";
import * as native from "natives";
import {singleton} from "tsyringe";
import {EventModule} from "./event.module";
import {WeatherType} from "@enums/weather.type";
import {LoggerModule} from "./logger.module";

@singleton()
export class WeatherModule {
    public readonly weatherNameMap: Map<WeatherType, string> = new Map(
            [[WeatherType.CLEAR, "CLEAR"], [WeatherType.EXTRA_SUNNY, "EXTRASUNNY"], [WeatherType.CLOUDS, "CLOUDS"], [WeatherType.OVERCAST, "OVERCAST"], [WeatherType.RAIN, "RAIN"], [WeatherType.CLEARING, "CLEARING"], [WeatherType.THUNDER, "THUNDER"], [WeatherType.SMOKG, "SMOG"], [WeatherType.XMAS, "XMAS"],]);

    public oldWeather: WeatherType;

    constructor(private readonly event: EventModule, private readonly logger: LoggerModule) {
    }

    public startSync(): void {
        native.setWeatherTypeNowPersist(this.weatherNameMap.get(alt.getSyncedMeta<WeatherType>("Weather")));

        alt.setMsPerGameMinute(60000);

        let date: Date = new Date();
        native.setClockTime(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
}