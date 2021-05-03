CREATE OR REPLACE FUNCTION fn_insert_request(timezone VARCHAR(20))
RETURNS VOID AS
$$
BEGIN
    INSERT INTO requests (user_id,zone_id) 
    SELECT 1, id 
    FROM zones 
    WHERE zone = timezone;
END
$$ LANGUAGE plpgsql;