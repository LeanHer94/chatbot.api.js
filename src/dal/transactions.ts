import prisma from "./prisma/prismaClient";
export class Transaction {
  upsertTimezoneCache = async (
    timezone: string,
    timeAtTimezone: string
  ) => {
    return await prisma.$executeRaw`
      INSERT INTO requestsCache (timezone, time_at_timezone, time_request) 
      VALUES (${timezone}, to_timestamp(${timeAtTimezone}, 'YYYY/MM/DD hh24:mi:ss')::timestamp, NOW())
      ON CONFLICT (timezone) DO UPDATE 
      SET time_at_timezone = to_timestamp(${timeAtTimezone}, 'YYYY/MM/DD hh24:mi:ss')::timestamp, time_request = NOW()` 
  };

  insertLog = async (description: string, exception: any) => {
    return await prisma.$executeRaw`INSERT INTO logs (description, exception) VALUES (${description}, ${exception})`;
  };

  insertRequest = async (timezone: string) => {
    return await prisma.$executeRaw`INSERT INTO requests (user_id,zone_id) SELECT 1, id FROM zones WHERE zone = ${timezone}`;
  };

  tryInsertRegion = async (
    region: string,
    parent: string,
    available: boolean
  ) => {
    return await prisma.$executeRaw`
      INSERT INTO zones (zone, parent, available) SELECT ${region}, ${parent}, ${available}
      WHERE NOT EXISTS (SELECT 1 FROM zones WHERE zone = ${region})`;
  };
}