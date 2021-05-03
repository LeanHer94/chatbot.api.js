CREATE OR REPLACE FUNCTION fn_try_insert_region(region VARCHAR(20), parent VARCHAR(20), available BOOLEAN)
RETURNS VOID AS
$$
BEGIN
    INSERT INTO zones (zone, parent, available) SELECT region, parent, available
    WHERE NOT EXISTS (SELECT 1 FROM zones WHERE zone = region);
END
$$ LANGUAGE plpgsql;