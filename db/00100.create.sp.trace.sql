DO
$body$
BEGIN
raise notice 'create procedure TRACE';
END
$body$;


create or replace procedure TRACE(str varchar(500)) 
as $$
begin
raise notice '%', str;
end
$$
language plpgsql;


