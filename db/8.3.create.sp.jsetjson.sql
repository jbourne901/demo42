call TRACE('create function jsetjson');


create or replace function jsetjson(src JSONB, fieldname varchar(100), value JSONB)
returns JSONB
as $$
declare
_js JSONB;
begin

if not fieldname like '{%}' then
   fieldname:=concat('{',fieldname,'}');
end if;

_js := jsonb_set(src, fieldname::text[], value, true);

return _js;


end
$$
language plpgsql;



call TRACE('create procedure Testjsetjson');

create or replace procedure Testjsetjson()
as $$
declare
_js JSONB;
_value JSONB;
begin

_js:='{}';
_value:='{"name": "Add", "value": "dff" }';

select * from jsetjson(_js, 'myfield', _value ) into _js;

call TRACE( concat('Testjsetjson', _js) );


end
$$
language plpgsql;


call Testjsetjson();



