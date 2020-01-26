call TRACE('create function jarraddint');


create or replace function jarraddint(src JSONB, value int )
returns JSONB
as $$
declare
_js JSONB;
_value JSONB;
begin

_value := to_jsonb( value );


_js := src || _value;

return _js;


end
$$
language plpgsql;



call TRACE('create procedure Testjarraddint');

create or replace procedure Testjarraddint()
as $$
declare
_js JSONB;
begin

_js:='[]';
select * from jarraddint(_js, 898) into _js;

call TRACE( concat('Testjsarraddint', _js) );


end
$$
language plpgsql;


call Testjarraddint();

