import prisma from './prismaClient';

const upsertTimezoneCache = async (timezone: string, timeAtTimezone: Date, requestTime: Date) => {
    return await prisma.$queryRaw`
        IF NOT EXISTS (SELECT 1 FROM requestsCache WHERE timezone = ${timezone})
        BEGIN
            INSERT INTO requestsCache (timezone, time_at_timezone, time_request) 
            VALUES (${timezone}, ${timeAtTimezone}, ${requestTime})
        END ELSE
            UPDATE requestsCache SET time_at_timezone = ${timeAtTimezone}, time_request = ${requestTime}
            WHERE timezone = ${timezone}`
}

const insertLog = async (description: string, exception: any) => {
    return await prisma.$queryRaw`INSERT INTO logs (description, exception) VALUES (${description}, ${exception})`
}

const insertRequest = async (timezone: string) => {
    return await prisma.$queryRaw`INSERT INTO requests (user_id,zone_id) SELECT 1, id FROM zones WHERE zone = ${timezone}`
}

export {
    upsertTimezoneCache,
    insertLog,
    insertRequest
}