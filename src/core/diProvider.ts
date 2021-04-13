import { TimezoneService } from "../bll/timezoneService";
import { Query } from "../dal/queries";
import { Transaction } from "../dal/transactions";
import { WorldTimeApi } from "../integrations/worldtime/worldtimeapi";

export class DIProvider {
    timezoneService: TimezoneService;
    query: Query;
    transac: Transaction;
    worldApi: WorldTimeApi;

    constructor() {
        this.query = new Query();
        this.transac = new Transaction();
        this.worldApi = new WorldTimeApi();
        this.timezoneService = new TimezoneService(this.query, this.transac, this.worldApi);
    }

    getTimezoneService() {
        return this.timezoneService;
    }
}