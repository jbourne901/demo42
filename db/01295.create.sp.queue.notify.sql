

create or replace procedure  TestQueueNotify()
as $$
declare
_js JSONB;
begin

call TRACE('TestQueueNotify');

LISTEN datachange;

call TRACE('TestQueueNotify1 - adding');

insert into queue(name)
select 'testqueue8';

delete from queue where name='testqueue8';



end
$$
language plpgsql;


call TestQueueNotify();
