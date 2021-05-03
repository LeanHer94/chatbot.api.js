import { apiCacheTime } from "../config";
import { database } from '../config'

export class Repository {
  private _db;

  constructor(pgp){
    this._db = pgp(database);
  }

  getRequestsCount(lookup: string): Promise<string> {
    return this.exec('fn_get_request_count', [lookup])
  }

  getValidRegionPath(lookup: string): Promise<string> {
    return this.exec('fn_get_valid_region_path', [lookup])
  }

  getCachedTimeZone(lookup: string): Promise<string> {
    return this.exec('fn_get_cached_timezone', [lookup])
  }

  isKnownZone(lookup: string): Promise<boolean> {
    return this.exec('fn_is_known_zone', [lookup])
  }

  areZonesPopulated(): Promise<boolean> {
    return this.exec('fn_are_zones_populated')
  }

  shouldUpdateCache(lookup: string): Promise<boolean> {
    return this.exec('fn_should_update_cache', [lookup, +apiCacheTime])
  }

  upsertTimezoneCache(
    timezone: string,
    timeAtTimezone: string
  ) {
    return this.exec('fn_upsert_timezone_cache', [timezone, timeAtTimezone])
  };

  insertLog(description: string, exception: any) {
    return this.exec('fn_insert_logs', [description, exception]);
  };

  insertRequest(timezone: string) {
    return this.exec('fn_insert_request', [timezone]);
  };

  tryInsertRegion(
    region: string,
    parent: string,
    available: boolean
  ) {
    return this.exec('fn_try_insert_region', [region, parent, available])
  };

  private async exec(fn: string, params?: any[]) {
    return (await this._db.func(fn, params))[0][fn];
  }
}
