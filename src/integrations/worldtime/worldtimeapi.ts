import axios from "axios";
import { apiRetry, apiRetryTime, worldtimeapi } from "../../config";
import { AppError } from "../../core/appError";

export class WorldTimeApi {
  async getTimeBy(timezone: string, retryCount?: number) {
    try {
      const response = await axios.get(`${worldtimeapi}${timezone}`);

      return response.data;
    } catch (err) {
      this.retry((count) => this.getTimeBy(timezone, count), retryCount, err);
    }
  }

  getAllTimezones(): Promise<any> {
    return axios.get(worldtimeapi);
  }

  retry(func: Function, retryCount: number, err) {
    //retry strategy
    if (
      err.response.status == 503 &&
      (!retryCount || retryCount <= +apiRetry)
    ) {
      setTimeout((_) => func(retryCount ? retryCount++ : 1), +apiRetryTime);
    }

    throw new AppError("world api error", err);
  }
}
