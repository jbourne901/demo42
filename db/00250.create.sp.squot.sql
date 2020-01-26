call TRACE('create SP squot');

create or replace function squot(value text)
returns text
as $$
begin

return concat('''', value, '''');

end
$$
language plpgsql;






call TRACE('create SP Testsquot');

create or replace procedure  Testsquot()
as $$
declare
_str text;
begin


select * from squot('name') into _str;


call TRACE( concat('Testsquot ', _str) );

end
$$
language plpgsql;


call Testsquot();


