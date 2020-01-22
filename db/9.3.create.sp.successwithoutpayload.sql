call TRACE('create function successWithoutPayloadJSON');


create or replace function SuccessWithoutPayloadJSON()
returns JSONB
as $$
declare
_js JSONB;
begin

_js:='{}';

_js:=jsonb_set(_js, '{result}', '"OK"', true);

return _js;


end
$$
language plpgsql;



call TRACE('create procedure TestSuccessWithoutPayloadJSON');


create or replace procedure TestSuccessWithoutPayloadJSON()
as $$
declare
_js JSONB;
begin

select SuccessWithoutPayloadJSON() into _js;

call TRACE( concat('TestSuccessWithoutPayloadJSON', _js) );

end
$$
language plpgsql;

call TestSuccessWithoutPayloadJSON();






