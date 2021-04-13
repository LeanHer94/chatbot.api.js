import {
  areZonesPopulated,
  getCachedTimeZone,
  getRequestsCount,
  getValidRegionPath,
  isKnownZone,
  shouldUpdateCache,
} from "./prisma/queries";
import {
  insertRequest,
  tryInsertRegion,
  upsertTimezoneCache,
} from "./prisma/transactions";
import { getAllTimezones, getTimeBy } from "./worldtime_api/worldtimeapi";
import moment from "moment";
import { AppError } from "./core/appError";

const populateTimezones = async () => {
  if (!(await areZonesPopulated())) {
    const timezones = (await getAllTimezones()).data as Array<string>;

    timezones.forEach((timezone) => {
      const regions = timezone.getRegions();
      const last = regions.pop();

      let parent = null;

      regions.forEach(async (region) => {
        await tryInsertRegion(region, parent, region == last);
      });
    });
  }
};

const timeAt = async (input: string) => {
  await populateTimezones();

  const isKnown = await isKnownZone(input.getLastRegion());

  if (!isKnown) {
    throw new AppError("unknown timezone");
  }

  await insertRequest(input);

  const path = await getValidRegionPath(input);
  const isCacheInvalid = await shouldUpdateCache(path);

  if (!isCacheInvalid) {
    return moment.parseZone(await getCachedTimeZone(path)).lxFormat();
  }

  const time = await getTimeBy(path);

  const timezoneMoment = moment.parseZone(time.datetime, moment.ISO_8601);

  if (timezoneMoment) {
    await upsertTimezoneCache(
      path,
      timezoneMoment.lxStoreFormat(),
      moment().lxStoreFormat()
    );
    return timezoneMoment.lxFormat();
  }

  throw new AppError("invalid timezone");
};

const timePopularity = async (input: string) => {
  await populateTimezones();

  return await getRequestsCount(input);
};

export { timeAt, timePopularity };
