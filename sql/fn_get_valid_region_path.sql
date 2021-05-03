CREATE OR REPLACE FUNCTION fn_get_valid_region_path(lookup VARCHAR(20))
RETURNS VARCHAR AS 
$$
BEGIN
    RETURN (SELECT zone FROM zones WHERE zone = lookup and parent IS NULL
            UNION ALL
            SELECT CONCAT(parent, '/', zone) 
            FROM zones z1 
            WHERE zone = lookup AND EXISTS (SELECT 1 FROM zones z2 WHERE z1.parent = z2.zone AND z2.parent IS NULL)
            UNION ALL
            SELECT CONCAT(z1.parent, '/', z1.zone, '/', z2.zone) 
            FROM zones z1 INNER JOIN zones z2 ON z2.zone = lookup
            WHERE z1.parent IS NOT NULL AND EXISTS (SELECT 1 FROM zones z2 WHERE zone = lookup AND z1.zone = z2.parent));
END
$$ LANGUAGE plpgsql;