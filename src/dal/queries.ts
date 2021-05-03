import { apiCacheTime } from "../config";
import { database } from './../config'

export class Query {
  private _db;

  constructor(){
    const pgp = require('pg-promise')();
    this._db = pgp(database);
  }

  async getRequestsCount(lookup: string): Promise<string> {
    return this.exec('fn_get_request_count', [lookup])
  }

  async getValidRegionPath(lookup: string): Promise<string> {
    return this.exec('fn_get_valid_region_path', [lookup])
  }

  async getCachedTimeZone(lookup: string): Promise<string> {
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

  private async exec(fn: string, params?: any[]) {
    return (await this._db.func(fn, params))[0][fn];
  }
}
