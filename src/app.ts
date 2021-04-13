import "./extension_methods/String";
import "./extension_methods/Moment";

import express from "express";
import { serverPort } from "./config";
import { timeAt, timePopularity } from "./timezoneService";
import { handleError } from "./core/errorHandler";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("api working");
});

app.post("/timeat", async (req, res, next) => {
  try {
    const result = await timeAt(req.body?.Timezone);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

app.post("/timepopularity", async (req, res, next) => {
  try {
    const result = await timePopularity(req.body?.Timezone);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware, we delegate the handling to the centralized error handler
app.use(async (err: Error, req, res, next) => {
  await handleError(err, res);
});

process.on("uncaughtException", (error: Error) => {
  handleError(error);
});

process.on("unhandledRejection", (reason) => {
  handleError(reason);
});

app.listen(serverPort, () => {
  console.log(`Example app listening at http://localhost:${serverPort}`);
});
