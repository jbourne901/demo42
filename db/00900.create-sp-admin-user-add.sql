call TRACE('create SP AdminUserAdd');

drop procedure if exists AdminUserAdd;

create procedure AdminUserAdd()
as $$
begin

  insert into users(username,name,hashpassword)
  select 'admin', 'admin',passwordhash('12345');

end
$$
language plpgsql;

call TRACE('call AdminUserAdd');

call AdminUserAdd();

