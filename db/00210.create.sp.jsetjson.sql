call TRACE('create function jsetjson');

create or replace function jsetjson(src JSONB, fieldname varchar(100), value jsonb)
returns JSONB
as $$
declare
_js JSONB;
_value alias for value;
begin

if not fieldname like '{%}' then
   fieldname:=concat('{',fieldname,'}');
end if;

_js := jsonb_set(src::jsonb, fieldname::text[], _value::jsonb, true);


return _js;


end
$$
language plpgsql;



call TRACE('create procedure Testjsetjson');

create or replace procedure Testjsetjson()
as $$
declare
_js JSONB;
begin

_js:='{}';
select * from jsetjson(_js, 'myfield', '{"name": "username"}' ) into  _js;
call TRACE( concat('Testjsetjson', _js) );

end
$$
language plpgsql;


call Testjsetjson();



