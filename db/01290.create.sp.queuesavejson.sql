call TRACE('create SP QueueSaveJSON');

create or replace function QueueSaveJSON(doc JSONB, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_id queue.id%TYPE;
_js JSONB;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select doc->>'id' into _id;

call LOGJSONADD( concat('QueueSaveJSON1 id=',_id), doc);

if _id is null then
  select * from QueueAddJSON(doc, session) into _js;
else
  select * from QueueUpdateJSON(doc, session) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestQueueSaveJSON');

create or replace procedure TestQueueSaveJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestQueueSaveJSON1');

_js:='{ "name": "testqueue2" }';

select QueueSaveJSON(_js, testsession()) into _js;

call TRACE( concat('TestQueueSaveJSON ', _js) );

end
$$
language plpgsql;

call TestQueueSaveJSON();

