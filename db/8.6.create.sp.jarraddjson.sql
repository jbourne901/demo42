call TRACE('create function jarraddjson');


create or replace function jarraddjson(src JSONB, value JSONB )
returns JSONB
as $$
declare
_js JSONB;
begin


_js := src || value;

return _js;


end
$$
language plpgsql;



call TRACE('create procedure Testjarraddjson');

create or replace procedure Testjarraddjson()
as $$
declare
_js JSONB;
_value JSONB;
begin

_js:='[]';
_value:='{"name": "test"}';
select * from jarraddjson(_js, _value) into _js;

call TRACE( concat('Testjsarraddjson', _js) );


end
$$
language plpgsql;


call Testjarraddjson();

