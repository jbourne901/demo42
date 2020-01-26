call TRACE('create function jarraddstr');


create or replace function jarraddstr(src JSONB, value text)
returns JSONB
as $$
declare
_js JSONB;
_value JSONB;
begin

_value = to_jsonb(value);
_js := src || _value;

return _js;


end
$$
language plpgsql;



call TRACE('create procedure Testjarraddstr');

create or replace procedure Testjarraddstr()
as $$
declare
_js JSONB;
begin

_js:='[]';
select * from jarraddstr(_js, 'myvalue') into _js;

call TRACE( concat('Testjsarraddstr', _js) );


end
$$
language plpgsql;


call Testjarraddstr();

