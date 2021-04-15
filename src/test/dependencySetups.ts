import { Query } from "../dal/queries";
import { Transaction } from "../dal/transactions";
import { WorldTimeApi } from "world-time-api.hl";

interface QuerySetup {
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

interface TransactionSetup {}

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

interface WorldTimeSetup {
  timezones?: any[];
  time?: { datetime: string };
}

const setupWorldTimeApi = (setup?: WorldTimeSetup): WorldTimeApi => {
  return {
    getAllTimezones() {
      return Promise.resolve(setup?.timezones);
    },
    getTimeBy(tz, retry) {
      return Promise.resolve(setup?.time);
    },
    retry(fn, retry) {},
  };
};

export { setupQuery, setupTransaction, setupWorldTimeApi };
