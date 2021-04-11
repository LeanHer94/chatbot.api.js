import axios from "axios";
import { worldtimeapi } from "../config";

const api = worldtimeapi;

const getTimeBy = (timezone: string) => {
    return axios.get(`${worldtimeapi}${timezone}`);
}

const getAllTimezones = () => {
    return axios.get(worldtimeapi)
}

export {
    getTimeBy,
    getAllTimezones
}