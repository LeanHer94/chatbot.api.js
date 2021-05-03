CREATE OR REPLACE FUNCTION fn_is_known_zone(lookup VARCHAR(20))
RETURNS BOOLEAN AS 
$$
BEGIN
    RETURN (SELECT COUNT(1) FROM zones WHERE zone = lookup AND available = true);
END
$$ LANGUAGE plpgsql;