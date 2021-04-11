import dotenv from 'dotenv'

dotenv.config()

const worldtimeapi = process.env.TIME_API
const apiCacheTime = process.env.API_CACHE_TIME

export {
    worldtimeapi,
    apiCacheTime
}