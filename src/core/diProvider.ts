import { TimezoneService } from "../bll/timezoneService";
import { Query } from "../dal/queries";
import { Transaction } from "../dal/transactions";
import { WorldTimeApi } from "world-time-api.hl";
import { apiRetry, apiRetryTime, worldtimeapi } from "../config";

export class DIProvider {
    timezoneService: TimezoneService;
    query: Query;
    transac: Transaction;
    worldApi: WorldTimeApi;

    constructor() {
        this.query = new Query();
        this.transac = new Transaction();

        const worldApiConfig = {
            apiRetry: +apiRetry, 
            apiRetryTime: +apiRetryTime, 
            worldtimeapi
        };

        this.worldApi = new WorldTimeApi(worldApiConfig);
        this.timezoneService = new TimezoneService(this.query, this.transac, this.worldApi);
    }

    getTimezoneService() {
        return this.timezoneService;
    }
}