DO
$body$
        BEGIN
            raise notice  ' create function auto_grant_func' ;
        END
$body$;


CREATE OR REPLACE FUNCTION auto_grant_func()
RETURNS event_trigger AS $$
BEGIN
    grant all on all tables in schema public to ${USERNAME};
    grant all on all sequences in schema public to ${USERNAME};
    grant select on all tables in schema public to ${USERNAME};
    grant select on all sequences in schema public to ${USERNAME};
END;
$$ LANGUAGE plpgsql;

DO
$body$
        BEGIN
            raise notice  ' crate trigger auto_grant' ;
        END
$body$;


CREATE EVENT TRIGGER auto_grant_trigger
    ON ddl_command_end
    WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS')
EXECUTE PROCEDURE auto_grant_func();



