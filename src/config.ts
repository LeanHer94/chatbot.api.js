import dotenv from 'dotenv'

dotenv.config()

const serverPort = process.env.PORT
const worldtimeapi = process.env.TIME_API
const apiCacheTime = process.env.API_CACHE_TIME
const apiRetry = process.env.API_RETRY
const apiRetryTime = process.env.API_RETRY_MILLISECONDS
const database = process.env.DATABASE_URL;

export {
    serverPort,
    worldtimeapi,
    apiCacheTime,
    apiRetry,
    apiRetryTime,
    database
}