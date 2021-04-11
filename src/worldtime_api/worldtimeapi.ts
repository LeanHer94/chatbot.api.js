import axios from "axios";
import { apiRetry, apiRetryTime, worldtimeapi } from "../config";

const api = worldtimeapi;

const getTimeBy = async (timezone: string, retryCount?: number) => {
    try {
        if (!retryCount || retryCount <= +apiRetry) {
            const response = await axios.get(`${worldtimeapi}${timezone}`);

            return response.data;
        }
        
        return null;
    } catch(e) {
        //retry strategy
        if (e.response.status == 503) {
            setTimeout(_ => getTimeBy(timezone, retryCount ? retryCount++ : 1), +apiRetryTime);
        }
    }
}

const getAllTimezones = () => {
    return axios.get(worldtimeapi)
}

export {
    getTimeBy,
    getAllTimezones
}