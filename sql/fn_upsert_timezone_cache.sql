CREATE OR REPLACE FUNCTION fn_upsert_timezone_cache(tz VARCHAR, time_at VARCHAR)
RETURNS VOID AS
$$
BEGIN
    INSERT INTO requestsCache (timezone, time_at_timezone, time_request) 
    VALUES (tz, to_timestamp(time_at, 'YYYY/MM/DD hh24:mi:ss')::timestamp, NOW())
    ON CONFLICT (timezone) DO UPDATE 
    SET time_at_timezone = to_timestamp(time_at, 'YYYY/MM/DD hh24:mi:ss')::timestamp, time_request = NOW();
END
$$ LANGUAGE plpgsql;