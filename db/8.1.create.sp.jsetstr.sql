call TRACE('create function jsetstr');


create or replace function jsetstr(src JSONB, fieldname text, value text)
returns JSONB
as $$
declare
_js JSONB;
_value JSONB;
begin


if not fieldname like '{%}' then
   fieldname:=concat('{',fieldname,'}');
end if;

_value := to_jsonb(value);

_js := jsonb_set(src::jsonb, fieldname::text[], _value, true);

return _js;


end
$$
language plpgsql;



call TRACE('create procedure Testjsetstr');

create or replace procedure Testjsetstr()
as $$
declare
_js JSONB;
begin

_js:='{}';
select * from jsetstr(_js, 'myfield', 'myvalue') into _js;

call TRACE( concat('Testjsetstr', _js) );

end
$$
language plpgsql;


call Testjsetstr();



