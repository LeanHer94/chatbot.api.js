import prisma from './prismaClient';

const getRequestsCount = async (lookup: string): Promise<number> => {
        return await prisma.$queryRaw`
            SELECT count(1) FROM requests h
            WHERE EXISTS(
                SELECT 1 FROM
                    (SELECT id FROM zones WHERE zone = ${lookup} AND available = 1 union
                    SELECT id FROM zones WHERE parent = ${lookup} AND available = 1 union
                    SELECT id FROM zones z1 WHERE
                                EXISTS(SELECT zone FROM zones z2
                                        WHERE z2.parent = ${lookup}
                                        AND z2.available = 0
                                        AND z2.zone = z1.parent)) as ids
                WHERE ids.id = h.zone_id);`
    }

const getValidRegionPath = async (lookup: string): Promise<string> => {
        return await prisma.$queryRaw`
            SELECT zone FROM zones WHERE zone = ${lookup} and parent IS NULL
            UNION ALL
            SELECT CONCAT(parent, '/', zone) 
            FROM zones z1 
            WHERE zone = ${lookup} AND EXISTS (SELECT 1 FROM zones z2 WHERE z1.parent = z2.zone AND z2.parent IS NULL)
            UNION ALL
            SELECT CONCAT(parent, '/', zone, '/', ${lookup}) 
            FROM zones z1
            WHERE parent IS NOT NULL AND EXISTS (SELECT 1 FROM zones z2 WHERE zone = ${lookup} AND z1.zone = z2.parent)`
    }

const getCachedTimeZone = async (lookup: string): Promise<Date> => {
        return await prisma.$queryRaw`SELECT time_at_timezone from requestsCache WHERE timezone = ${lookup}`
    }

const isKnownZone = (lookup: string): Promise<boolean> => {
        return prisma
            .$queryRaw`SELECT COUNT(1) AS result FROM zones WHERE zone = ${lookup} AND available = 1`
            .then(count => {
                return count[0].result > 0;
            });
    }

const areZonesPopulated = (): Promise<boolean> => {
        return prisma
            .$queryRaw`SELECT COUNT(1) as result FROM zones`
            .then(count => {
                return count[0].result > 0;
            });
    }

const shouldUpdateCache = (lookup: string): Promise<boolean> => {
        return prisma
            .$queryRaw`SELECT DATEDIFF(MINUTE, time_request, GETDATE()) as result from requestsCache WHERE timezone = ${lookup}`
            .then(r => {
                return r[0].result > 1;
            });
    }

export {
    getRequestsCount,
    getValidRegionPath,
    getCachedTimeZone,
    isKnownZone,
    areZonesPopulated,
    shouldUpdateCache
}