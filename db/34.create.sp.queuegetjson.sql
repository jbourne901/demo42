call TRACE('create SP QueueGetJSON');

create or replace function QueueGetJSON(id queue.id%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_id alias for id;
begin

select row_to_json(q) into _js from (select name,queue.id from queue where queue.id=_id) q;

if _js is null then
   select UnknownErrJSON() into _js;
else
   select SuccessWithPayloadJSON(_js) into _js;
end if;

return _js;

end
$$
language plpgsql;





call TRACE('create SP TestQueueGetJSON');

create or replace procedure TestQueueGetJSON()
as $$
declare
_js JSONB;
begin

select * from QueueGetJSON(1) into _js;

call TRACE( concat ('TestQueueGetJSON ', _js) );

end
$$
language plpgsql;

call TestQueueGetJSON();


