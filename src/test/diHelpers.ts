import { AxiosResponse } from "axios";
import { Query } from "../dal/queries";
import { Transaction } from "../dal/transactions";
import { WorldTimeApi } from "../integrations/worldtime/worldtimeapi";

class QuerySetup {
  areZonesPopulated?: boolean;
  cachedTimezone?: string;
  requestsCount?: string;
  validPath?: string;
  isKnownZone?: boolean;
  updateCache?: boolean;
}

const setupQuery = (setup: QuerySetup): Query => {
  return {
    areZonesPopulated() {
      return Promise.resolve(setup.areZonesPopulated ?? true);
    },
    getCachedTimeZone() {
      return Promise.resolve(setup.cachedTimezone ?? "cached_timezone");
    },
    getRequestsCount(lookup) {
      return Promise.resolve(setup.requestsCount ?? "1");
    },
    getValidRegionPath(lookup) {
      return Promise.resolve(setup.validPath ?? "valid_path");
    },
    isKnownZone(lookup) {
      return Promise.resolve(setup.isKnownZone ?? true);
    },
    shouldUpdateCache(lookup) {
      return Promise.resolve(setup.updateCache ?? false);
    },
  };
};

class TransactionSetup {}

const setupTransaction = (setup?: TransactionSetup): Transaction => {
  return {
    insertLog(description, exception) {
      return Promise.resolve({});
    },
    insertRequest(timezone) {
      return Promise.resolve({});
    },
    tryInsertRegion(region, parent, available) {
      return Promise.resolve({});
    },
    upsertTimezoneCache(timezone, timeAt, requestTime) {
      return Promise.resolve({});
    },
  };
};

const setupWorldTimeApi = (setup?): WorldTimeApi => {
  return {
    getAllTimezones() {
      return Promise.resolve();
    },
    getTimeBy(tz, retry) {
      return Promise.resolve();
    },
    retry(fn, retry) {},
  };
};

export { setupQuery, setupTransaction, setupWorldTimeApi };
