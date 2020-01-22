call TRACE(' create procedure ENSURE');

create or replace procedure ENSURE( condition boolean, str varchar(500))
as $$
begin

if condition then
  call TRACE( concat(str, ' OK' ) );
else
  call TRACE( concat(str, ' FAIL' ) );
end if;

end
$$
language plpgsql;


