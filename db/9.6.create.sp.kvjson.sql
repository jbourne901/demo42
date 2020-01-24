call TRACE('create SP KVJSON');

create or replace function KVJSON(key varchar(100), value text)
returns JSON
as $$
declare
_js JSONB;
begin

_js:='{}';
_js:=jsetstr(_js, key,value);

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


select * from KVJSON('name', 'Joh') into _js;


call TRACE( concat('TestKVJSON ', _js) );

end
$$
language plpgsql;


call TestKVJSON();


