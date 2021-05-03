CREATE OR REPLACE FUNCTION fn_get_request_count(lookup VARCHAR(20))
RETURNS VARCHAR AS 
$$
BEGIN
    RETURN (SELECT count(1) FROM requests h
            WHERE EXISTS(
                SELECT 1 FROM
                    (SELECT id FROM zones WHERE zone = lookup AND available = true union
                    SELECT id FROM zones WHERE parent = lookup AND available = true union
                    SELECT id FROM zones z1 WHERE
                                EXISTS(SELECT zone FROM zones z2
                                        WHERE z2.parent = lookup
                                        AND z2.available = false
                                        AND z2.zone = z1.parent)) as ids
                WHERE ids.id = h.zone_id));
END
$$ LANGUAGE plpgsql;