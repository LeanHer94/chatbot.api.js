import { apiCacheTime } from "../config";
import prisma from "./prisma/prismaClient";

export class Query {
  async getRequestsCount(lookup: string): Promise<string> {
    return await prisma.$queryRaw`
            SELECT count(1) as result FROM requests h
            WHERE EXISTS(
                SELECT 1 FROM
                    (SELECT id FROM zones WHERE zone = ${lookup} AND available = true union
                    SELECT id FROM zones WHERE parent = ${lookup} AND available = true union
                    SELECT id FROM zones z1 WHERE
                                EXISTS(SELECT zone FROM zones z2
                                        WHERE z2.parent = ${lookup}
                                        AND z2.available = false
                                        AND z2.zone = z1.parent)) as ids
                WHERE ids.id = h.zone_id);`.then((r) => {
      return r[0].result.toString();
    });
  }

  async getValidRegionPath(lookup: string): Promise<string> {
    return await prisma.$queryRaw`
            SELECT zone FROM zones WHERE zone = ${lookup} and parent IS NULL
            UNION ALL
            SELECT CONCAT(parent, '/', zone) 
            FROM zones z1 
            WHERE zone = ${lookup} AND EXISTS (SELECT 1 FROM zones z2 WHERE z1.parent = z2.zone AND z2.parent IS NULL)
            UNION ALL
            SELECT CONCAT(z1.parent, '/', z1.zone, '/', z2.zone) 
            FROM zones z1 INNER JOIN zones z2 ON z2.zone = ${lookup}
            WHERE z1.parent IS NOT NULL AND EXISTS (SELECT 1 FROM zones z2 WHERE zone = ${lookup} AND z1.zone = z2.parent)`.then(
      (r) => {
        return r[0].zone;
      }
    );
  }

  async getCachedTimeZone(lookup: string): Promise<string> {
    return await prisma.$queryRaw`SELECT time_at_timezone from requestsCache WHERE timezone = ${lookup}`.then(
      (r) => {
        return r[0].time_at_timezone;
      }
    );
  }

  isKnownZone(lookup: string): Promise<boolean> {
    return prisma.$queryRaw`SELECT COUNT(1) AS result FROM zones WHERE zone = ${lookup} AND available = true`.then(
      (count) => {
        return count.length > 0 && count[0].result > 0;
      }
    );
  }

  areZonesPopulated(): Promise<boolean> {
    return prisma.$queryRaw`SELECT COUNT(1) as result FROM zones`.then(
      (count) => {
        return count[0].result > 0;
      }
    );
  }

  shouldUpdateCache(lookup: string): Promise<boolean> {
    return prisma.$queryRaw`SELECT EXTRACT(MINUTE FROM NOW()-time_request) as result from requestsCache WHERE timezone = ${lookup}`.then(
      (r) => {
        return r.length == 0 || r[0].result > apiCacheTime;
      }
    );
  }
}
