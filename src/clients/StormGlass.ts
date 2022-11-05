import { AxiosStatic } from "axios";

export class StormGlass{
    readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveHeight,waveDirection,windDirection,windSpeed';
    readonly stormGlassAPISource = 'noaa';

    constructor(protected request: AxiosStatic){}

    public async fetchPoints(lat: number, lng: number) : Promise<{}>{
        return this.request.get(`https://api.stormglass.io/v2/weather/point%20%20%20%20?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`);
    }
}