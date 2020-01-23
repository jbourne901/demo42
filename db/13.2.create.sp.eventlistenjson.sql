call TRACE('create SP EventListenJSON');

create or replace function EventListenJSON()
returns JSONB
as $$
declare
_js JSONB;
begin

LISTEN datachange;

select row_to_json(q) into _js from (select * from pg_listening_channels() ) q;

return _js;

end
$$
language plpgsql;


call TRACE('create SP TestEventListenJSON');

create or replace procedure TestEventListenJSON()
as $$
declare
_js JSONB;
begin

select * into _js from EventListenJSON();

call TRACE( concat( 'TestEventListenJSON ', _js) );

end
$$
language plpgsql;

call TestEventListenJSON();


