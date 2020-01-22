call TRACE('create procedure LOGJSONADD');


create or replace procedure LOGJSONADD(str varchar(500), js JSONB) 
as $$
begin
insert into log(str, js)
select str, js;
end
$$
language plpgsql;


