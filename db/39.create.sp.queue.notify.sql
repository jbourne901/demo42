
call TRACE('create trigger QueueNotify');

drop trigger if exists QueueNotify on queue cascade;
create trigger QueueNotify
AFTER INSERT OR UPDATE OR DELETE
ON queue
for each statement
execute procedure EventNotify();


call TRACE('create SP TestQueueNotify');

create or replace procedure  TestQueueNotify()
as $$
declare
_js JSONB;
begin

call TRACE('TestQueueNotify');

delete from queue;

LISTEN datachange;

call TRACE('TestQueueNotify1 - adding');

insert into queue(name)
select 'testqueue8';

delete from queue;



end
$$
language plpgsql;


call TestQueueNotify();
