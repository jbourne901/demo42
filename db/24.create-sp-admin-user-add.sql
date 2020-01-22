call TRACE('create SP AdminUserAdd');

drop procedure if exists AdminUserAdd;

create procedure AdminUserAdd()
as $$
begin

  insert into users(username,name,hashpassword)
  select 'admin', 'admin','$2a$10$XGzmW4SE6cgvFfPVw9Jz8eaJm7lyUtLB7AotYlUSxm7bumm/tmm.O';

end
$$
language plpgsql;

call TRACE('call AdminUserAdd');

call AdminUserAdd();

