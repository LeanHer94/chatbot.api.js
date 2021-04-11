import './extension_methods/String';
import express from "express";
import { areZonesPopulated, getCachedTimeZone, getRequestsCount, getValidRegionPath, isKnownZone, shouldUpdateCache } from "./prisma/queries";
import { insertRequest, upsertTimezoneCache } from "./prisma/transactions";

const app = express()
const port = 3000

app.use(express.json());

const populateTimezones = async () => {
  if (!await areZonesPopulated()) {
      var timezones = []; // this.timeAtApi.GetAll();

      //this.botRepository.TryInsert(timezones);
  }
}

app.get('/', (req, res) => {
  res.send('pepe')
})

app.post('/timeat', async (req, res) => {
  await populateTimezones(); 

  var input = req.body?.Timezone as string;
  var result: any;

  const isKnown = await isKnownZone(input.getLastRegion());

  if (isKnown) {
    await insertRequest(input);

    var path = await getValidRegionPath(input);

    if (await shouldUpdateCache(path)) {
      var unixtime = Date.parse('new Date()'); //call external api
      
      if (unixtime)
      {
        const date = new Date(unixtime);
        upsertTimezoneCache(path, date, new Date());
        //return date.ToString("d MMM yyy HH:mm");
      }

      result = 'invalid timezone';
    } else {
      result = await getCachedTimeZone(path)
    }

    res.send(result); //format ("d MMM yyy HH:mm")
  }

  return res.send('unknown timezone');
})

app.post('/timepopularity', async (req, res) => {
  var input = req.body?.Timezone;

  await populateTimezones();
  return await getRequestsCount(input)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
