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
  let result = "unknown timezone";

  const isKnown = await isKnownZone(input.getLastRegion());

  if (isKnown) {
    await insertRequest(input);

    const path = await getValidRegionPath(input);

    if (await shouldUpdateCache(path)) {
      const time = await getTimeBy(path);

      if (time) {
        const timezoneMoment = moment.parseZone(time.datetime, moment.ISO_8601);

        if (timezoneMoment) {
          await upsertTimezoneCache(
            path,
            timezoneMoment.lxStoreFormat(),
            moment().lxStoreFormat()
          );
          result = timezoneMoment.lxFormat();
        } else {
          result = "invalid timezone";
        }
      } else {
        result = "world api error";
      }
    } else {
      result = moment.parseZone(await getCachedTimeZone(path)).lxFormat();
    }
  }
};

const timePopularity = async (input: string) => {
  await populateTimezones();

  return await getRequestsCount(input);
};

export { timeAt, timePopularity };
