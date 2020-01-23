call TRACE('create SP SplitString');

create or replace function SplitString(str text, delim varchar(10))
returns setof text
as $$
declare
begin

return query select trim(unnest(string_to_array(str, delim) ) ) s;

end
$$
language plpgsql;






call TRACE('create SP TestSplitString');

create or replace procedure  TestSplitString()
as $$
declare
_js JSONB;
begin


select json_agg(q) res from (select * from SplitString('name/Name, username/Username', ',') as x ) q into _js;


call TRACE( concat('TestSplitString ', _js) );

end
$$
language plpgsql;


call TestSplitString();


