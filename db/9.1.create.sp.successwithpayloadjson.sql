call TRACE('create function successWithPayloadJSON');


create or replace function SuccessWithPayloadJSON(payload JSONB)
returns JSONB
as $$
declare
_js JSONB;
begin

_js:='{}';

_js:=jsonb_set(_js, '{result}', '"OK"', true);
_js:=jsonb_set(_js, '{payload}', payload, true);

return _js;


end
$$
language plpgsql;



call TRACE('create procedure TestSuccessWithPayloadJSON');


create or replace procedure TestSuccessWithPayloadJSON()
as $$
declare
_js JSONB;
payload JSONB;
begin

payload:='{"hello": "world"}';

select SuccessWithPayloadJSON(payload) into _js;

call TRACE( concat('TestSuccessWithPayloadJSON', _js) );


end
$$
language plpgsql;

call TestSuccessWithPayloadJSON();






