DO
$body$
BEGIN
raise notice ' create procedure LOGADD';
END
$body$;


create or replace procedure LOGADD(str varchar(500)) 
as $$
begin
insert into log(str)
select str;
end
$$
language plpgsql;


