import "./extension_methods/String";
import "./extension_methods/Moment";

import express from "express";
import { serverPort } from "./config";
import { timeAt, timePopularity } from "./timezoneService";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("api working");
});

app.post("/timeat", async (req, res) => {
  const result = await timeAt(req.body?.Timezone);

  res.send(result);
});

app.post("/timepopularity", async (req, res) => {
  const result = await timePopularity(req.body?.Timezone);
  res.send(result);
});

app.listen(serverPort, () => {
  console.log(`Example app listening at http://localhost:${serverPort}`);
});
