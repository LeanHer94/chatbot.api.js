CREATE OR REPLACE FUNCTION fn_insert_logs(descrip VARCHAR(50), ex VARCHAR)
RETURNS VOID AS
$$
BEGIN
    INSERT INTO logs (description, exception) VALUES (descrip, ex);
END
$$ LANGUAGE plpgsql;