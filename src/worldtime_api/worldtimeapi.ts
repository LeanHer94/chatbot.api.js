import axios from "axios";
import { apiRetry, apiRetryTime, worldtimeapi } from "../config";
import { AppError } from "../core/appError";

const retry = (func: Function, retryCount: number, err) => {
  //retry strategy
  if (err.response.status == 503 && (!retryCount || retryCount <= +apiRetry)) {
    setTimeout((_) => func(retryCount ? retryCount++ : 1), +apiRetryTime);
  }

  throw new AppError("world api error", err);
};

const getTimeBy = async (timezone: string, retryCount?: number) => {
  try {
    const response = await axios.get(`${worldtimeapi}${timezone}`);

    return response.data;
  } catch (err) {
    retry((count) => getTimeBy(timezone, count), retryCount, err);
  }
};

const getAllTimezones = () => {
  return axios.get(worldtimeapi);
};

export { getTimeBy, getAllTimezones };
