import { Repository } from "../dal/repository";
import { WorldTimeApi } from "world-time-api.hl";

interface RepositorySetup {
  areZonesPopulated?: boolean;
  cachedTimezone?: string;
  requestsCount?: string;
  validPath?: string;
  isKnownZone?: boolean;
  updateCache?: boolean;
}

class Mock extends Repository {
  constructor(private setup: RepositorySetup){
    super(() => {});
  }

  areZonesPopulated() {
    return Promise.resolve(this.setup.areZonesPopulated ?? true);
  }

  getCachedTimeZone() {
    return Promise.resolve(this.setup.cachedTimezone ?? "cached_timezone");
  }

  getRequestsCount(lookup) {
    return Promise.resolve(this.setup.requestsCount ?? "1");
  }

  getValidRegionPath(lookup) {
    return Promise.resolve(this.setup.validPath ?? "valid_path");
  }

  isKnownZone(lookup) {
    return Promise.resolve(this.setup.isKnownZone ?? true);
  }

  shouldUpdateCache(lookup) {
    return Promise.resolve(this.setup.updateCache ?? false);
  }

  insertLog(description, exception) {
    return Promise.resolve(1);
  }

  insertRequest(timezone) {
    return Promise.resolve(1);
  }

  tryInsertRegion(region, parent, available) {
    return Promise.resolve(1);
  }

  upsertTimezoneCache(timezone, timeAt) {
    return Promise.resolve(1);
  }
}

const setupRepository = (setup: RepositorySetup) => {
  return new Mock(setup)
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

export { setupRepository, setupWorldTimeApi };
