CREATE OR REPLACE FUNCTION fn_should_update_cache(lookup VARCHAR(20), cache_time INTEGER)
RETURNS BOOLEAN AS 
$$
BEGIN
    RETURN (
        SELECT EXTRACT(MINUTE FROM NOW()-time_request) > cache_time
        FROM requestsCache 
        WHERE timezone = lookup);
END
$$ LANGUAGE plpgsql;