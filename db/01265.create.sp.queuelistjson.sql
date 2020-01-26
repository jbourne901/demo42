call TRACE('create SP QueueListJSON');

create or replace function QueueListJSON( session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select json_agg(q) into _js from (select name,id from queue) q;

if _js is null then
  _js = '[]';
end if;

select SuccessWithPayloadJSON(_js) into _js;

return _js;

end
$$
language plpgsql;






call TRACE('create SP TestQueueListJSON');

create or replace procedure  TestQueueListJSON()
as $$
declare
_js JSONB;
begin

select * from QueueListJSON(testsession()) into _js;

call TRACE( concat('TestQueueListJSON ', _js) );

end
$$
language plpgsql;


call TestQueueListJSON();
