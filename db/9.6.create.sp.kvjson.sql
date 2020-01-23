call TRACE('create SP KVJSON');

create or replace function KVJSON(str text, delim varchar(10))
returns JSON
as $$
declare
_js JSONB;
_key varchar(50);
_val text;
begin

select split_part(str, delim,1) into _key;
select split_part(str, delim,2) into _val;

_js:='{}';
_js:=jsetstr(_js, _key,_val);

return _js;


end
$$
language plpgsql;






call TRACE('create SP TestKVJSON');

create or replace procedure  TestKVJSON()
as $$
declare
_js JSONB;
begin


select * from KVJSON('name/Name', '/') into _js;


call TRACE( concat('TestKVJSON ', _js) );

end
$$
language plpgsql;


call TestKVJSON();


