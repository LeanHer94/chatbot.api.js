import { Query } from "../dal/queries";
import { Transaction } from "../dal/transactions";
import moment from "moment";
import { AppError } from "error-api.hl";
import { WorldTimeApi } from "world-time-api.hl";

export class TimezoneService {
  constructor(private query: Query, private transac: Transaction, private worldApi: WorldTimeApi) {}

  async timeAt(input: string) {
    await this.populateTimezones();

    const isKnown = await this.query.isKnownZone(input.getLastRegion());

    if (!isKnown) {
      throw new AppError("unknown timezone");
    }

    await this.transac.insertRequest(input);

    const path = await this.query.getValidRegionPath(input);
    const isCacheInvalid = await this.query.shouldUpdateCache(path);

    if (!isCacheInvalid) {
      return moment
        .parseZone(await this.query.getCachedTimeZone(path))
        .lxFormat();
    }

    const time = await this.worldApi.getTimeBy(path);

    const timezoneMoment = moment.parseZone(time.datetime, moment.ISO_8601);

    if (timezoneMoment?.isValid()) {
      await this.transac.upsertTimezoneCache(
        path,
        timezoneMoment.lxStoreFormat()
      );
      return timezoneMoment.lxFormat();
    }

    throw new AppError("invalid timezone");
  }

  async timePopularity(input: string) {
    await this.populateTimezones();

    return await this.query.getRequestsCount(input);
  }

  tzs = [];
  private async populateTimezones() {
    if (!(await this.query.areZonesPopulated())) {
      if (!this.tzs.length) {
        this.tzs = (await this.worldApi.getAllTimezones()).data as Array<string>;
      }

      const timezones = this.tzs;

      for(const timezone of timezones) {
        const regions = timezone.getRegions();
        const last = regions.slice(-1)[0];

        let parent = null;

        for(const region of regions) {
          await this.transac.tryInsertRegion(region, parent, region == last);

          parent = region;
        }
      }
    }
  }
}
