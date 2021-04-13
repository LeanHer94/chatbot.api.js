import "./core/extension_methods/String";
import "./core/extension_methods/Moment";

import express from "express";
import { serverPort } from "./config";
import { handleError } from "./core/errorHandler";
import { DIProvider } from "./core/diProvider";

const app = express();
const diProvider = new DIProvider();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("api working");
});

app.post("/timeat", async (req, res, next) => {
  try {
    const result = await diProvider.getTimezoneService().timeAt(req.body?.Timezone);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

app.post("/timepopularity", async (req, res, next) => {
  try {
    const result = await diProvider.getTimezoneService().timePopularity(req.body?.Timezone);
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
