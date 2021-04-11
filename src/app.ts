import './extension_methods/String';
import './extension_methods/Moment';

import express from "express";
import { areZonesPopulated, getCachedTimeZone, getRequestsCount, getValidRegionPath, isKnownZone, shouldUpdateCache } from "./prisma/queries";
import { insertRequest, tryInsertRegion, upsertTimezoneCache } from "./prisma/transactions";
import { getAllTimezones, getTimeBy } from './worldtime_api/worldtimeapi';
import moment from 'moment';
import { serverPort } from './config';

const app = express()
const port = serverPort

app.use(express.json());

const populateTimezones = async () => {
  if (!await areZonesPopulated()) {
    const timezones = (await getAllTimezones()).data as Array<string>;

    timezones.forEach(timezone => {
      const regions = timezone.getRegions();
      const last = regions.pop();

      var parent = null;

      regions.forEach(async region => {
        await tryInsertRegion(region, parent, region == last);
      })
    })
  }
}

app.get('/', (req, res) => {
  res.send('api working')
})

app.post('/timeat', async (req, res) => {
  await populateTimezones(); 

  var input = req.body?.Timezone as string;
  var result = 'unknown timezone';

  const isKnown = await isKnownZone(input.getLastRegion());

  if (isKnown) {
    await insertRequest(input);

    var path = await getValidRegionPath(input);

    if (await shouldUpdateCache(path)) {
      const time = await getTimeBy(path);

      if (time) {
        const timezoneMoment = moment.parseZone(time.datetime, moment.ISO_8601);

        if (timezoneMoment)
        {
          await upsertTimezoneCache(path, timezoneMoment.lxStoreFormat(), moment().lxStoreFormat());
          result = timezoneMoment.lxFormat();
        } else {
          result = 'invalid timezone';
        }
      } else {
        result = 'world api error';
      }     
    } else {
      result = moment.parseZone((await getCachedTimeZone(path))).lxFormat();
    }
  }
    
  res.send(result);  
})

app.post('/timepopularity', async (req, res) => {
  var input = req.body?.Timezone;

  await populateTimezones();
  return await getRequestsCount(input)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})