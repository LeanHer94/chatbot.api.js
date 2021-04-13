import { Query } from "../dal/queries";
import { Transaction } from "../dal/transactions";
import moment from "moment";
import { AppError } from "../core/appError";
import { WorldTimeApi } from "../integrations/worldtime/worldtimeapi";

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

    if (timezoneMoment) {
      await this.transac.upsertTimezoneCache(
        path,
        timezoneMoment.lxStoreFormat(),
        moment().lxStoreFormat()
      );
      return timezoneMoment.lxFormat();
    }

    throw new AppError("invalid timezone");
  }

  async timePopularity(input: string) {
    await this.populateTimezones();

    return await this.query.getRequestsCount(input);
  }

  private async populateTimezones() {
    if (!(await this.query.areZonesPopulated())) {
      const timezones = (await this.worldApi.getAllTimezones()).data as Array<string>;

      timezones.forEach((timezone) => {
        const regions = timezone.getRegions();
        const last = regions.pop();

        let parent = null;

        regions.forEach(async (region) => {
          await this.transac.tryInsertRegion(region, parent, region == last);
        });
      });
    }
  }
}
