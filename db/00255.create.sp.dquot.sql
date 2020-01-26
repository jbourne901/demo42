call TRACE('create SP dquot');

create or replace function dquot(value text)
returns text
as $$
begin

return concat('"', value, '"');

end
$$
language plpgsql;






call TRACE('create SP Testdquot');

create or replace procedure  Testdquot()
as $$
declare
_str text;
begin


select * from dquot('name') into _str;


call TRACE( concat('Testdquot ', _str) );

end
$$
language plpgsql;


call Testdquot();


