import { Repository } from "../dal/repository";
import moment from "moment";
import { AppError } from "error-api.hl";
import { WorldTimeApi } from "world-time-api.hl";

export class TimezoneService {
  constructor(private repo: Repository, private worldApi: WorldTimeApi) {}

  async timeAt(input: string) {
    await this.populateTimezones();

    const isKnown = await this.repo.isKnownZone(input.getLastRegion());

    if (!isKnown) {
      throw new AppError("unknown timezone");
    }

    await this.repo.insertRequest(input);

    const path = await this.repo.getValidRegionPath(input);
    const isCacheInvalid = await this.repo.shouldUpdateCache(path);

    if (!isCacheInvalid) {
      return moment
        .parseZone(await this.repo.getCachedTimeZone(path))
        .lxFormat();
    }

    const time = await this.worldApi.getTimeBy(path);

    const timezoneMoment = moment.parseZone(time.datetime, moment.ISO_8601);

    if (timezoneMoment?.isValid()) {
      await this.repo.upsertTimezoneCache(
        path,
        timezoneMoment.lxStoreFormat()
      );
      return timezoneMoment.lxFormat();
    }

    throw new AppError("invalid timezone");
  }

  async timePopularity(input: string) {
    await this.populateTimezones();

    const result = await this.repo.getRequestsCount(input);

    return result
  }

  tzs = [];
  private async populateTimezones() {
    if (!(await this.repo.areZonesPopulated())) {
      if (!this.tzs.length) {
        this.tzs = (await this.worldApi.getAllTimezones()).data as Array<string>;
      }

      const timezones = this.tzs;

      for(const timezone of timezones) {
        const regions = timezone.getRegions();
        const last = regions.slice(-1)[0];

        let parent = null;

        for(const region of regions) {
          await this.repo.tryInsertRegion(region, parent, region == last);

          parent = region;
        }
      }
    }
  }
}
