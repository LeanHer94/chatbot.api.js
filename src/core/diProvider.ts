import { TimezoneService } from "../bll/timezoneService";
import { Repository } from "../dal/repository";
import { WorldTimeApi } from "world-time-api.hl";
import { apiRetry, apiRetryTime, worldtimeapi } from "../config";

export class DIProvider {
    timezoneService: TimezoneService;
    repo: Repository;
    worldApi: WorldTimeApi;

    constructor() {
        this.repo = new Repository(require('pg-promise')());

        const worldApiConfig = {
            apiRetry: +apiRetry, 
            apiRetryTime: +apiRetryTime, 
            worldtimeapi
        };

        this.worldApi = new WorldTimeApi(worldApiConfig);
        this.timezoneService = new TimezoneService(this.repo, this.worldApi);
    }

    getTimezoneService() {
        return this.timezoneService;
    }
}