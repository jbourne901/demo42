call TRACE('create SP QueueDeleteJSON');

create or replace function QueueDeleteJSON(id queue.id%TYPE)
returns JSONB
as $$
declare
_js JSONB;
_id alias for id;
begin

_js:='{}';

delete from queue where queue.id=_id;

select * from  SuccessWithoutPayloadJSON() into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestQueueDeleteJSON');

create or replace procedure TestQueueDeleteJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestQueueDeleteJSON1');

select * from QueueDeleteJSON(7777) into _js;

call TRACE( concat('TestQueueDeleteJSON ', _js) );


end
$$
language plpgsql;

call TestQueueDeleteJSON();

