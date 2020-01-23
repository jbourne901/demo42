
call TRACE('create trigger UserNotify');

drop trigger if exists UserNotify on users cascade;
create trigger UserNotify
AFTER INSERT OR UPDATE OR DELETE
ON users
for each statement
execute procedure EventNotify();


call TRACE('create SP TestUserNotify');

create or replace procedure  TestUserNotify()
as $$
declare
_js JSONB;
begin

call TRACE('TestUserNotify');

delete from users;

LISTEN datachange;

call TRACE('TestUserNotify1 - adding');

insert into users(username,name)
select 'admin8', 'admin8';

delete from users;



end
$$
language plpgsql;


call TestUserNotify();
