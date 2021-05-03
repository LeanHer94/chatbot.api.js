CREATE OR REPLACE FUNCTION fn_get_cached_timezone(lookup VARCHAR(20))
RETURNS TIMESTAMP AS 
$$
BEGIN
    RETURN (SELECT time_at_timezone from requestsCache WHERE timezone = lookup);
END
$$ LANGUAGE plpgsql;