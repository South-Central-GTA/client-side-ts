import {singleton} from "tsyringe";
import {foundation} from "../decorators/foundation";
import {onServer} from "../decorators/events";
import alt from "alt-client";
import native from "natives";
import {WeatherModule} from "../modules/weather.module";
import {WeatherType} from "@enums/weather.type";

@foundation() @singleton()
export class WeatherHandler {
    private interval: number;

    public constructor(private readonly weather: WeatherModule) {
    }

    @onServer("weather:updateweather")
    public onUpdateWeather(secondsForTransition: number): void {
        const currentWeather = alt.getSyncedMeta<WeatherType>("Weather");

        if (this.weather.oldWeather === currentWeather) {
            return;
        }

        const weatherString = this.weather.weatherNameMap.get(currentWeather);
        const oldWeatherHash = native.getHashKey(this.weather.weatherNameMap.get(this.weather.oldWeather));
        const currentWeatherHash = native.getHashKey(weatherString);

        if (this.interval !== undefined) {
            alt.clearInterval(this.interval);
        }

        let percentage = 0;
        this.interval = alt.setInterval(() => {
            percentage++;
            if (percentage < 100) {
                native.setWeatherTypeTransition(oldWeatherHash, currentWeatherHash, (percentage / 100));
            } else {
                alt.clearInterval(this.interval);
                this.weather.oldWeather = currentWeather;
            }
        }, (secondsForTransition * 10));

        if (weatherString === "XMAS") {
            native.setForceVehicleTrails(true);
            native.setForcePedFootstepsTracks(true);
        } else {
            native.setForceVehicleTrails(false);
            native.setForcePedFootstepsTracks(false);
        }

    }
}