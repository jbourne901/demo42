call TRACE('create function UserLoginJSON');

create or replace function UserLoginJSON(login JSONB)
returns JSONB
as $$
declare
_js JSONB;
_username users.username%TYPE;
_hashpassword users.hashpassword%TYPE;
_name users.name%TYPE;
_id users.id%TYPE;
_u JSONB;
_js1 JSONB;
begin


select login->>'username' into _username;
select login->>'hashpassword' into _hashpassword;

call LOGJSONADD(concat('UserLoginJSON ', _username, ' ', _hashpassword), login);

select u.id, u.name into _id, _name from users u where u.username=_username and u.hashpassword=_hashpassword;
if _id is null then
   select ErrsJSON('{"error": "Login failed"}') into _js;
else
   select row_to_json(q) as payload from (select id, name from users where users.id = _id) q into _js;
   select SuccessWithPayloadJSON(_js) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestUserLoginJSON');


create or replace procedure TestUserLoginJSON()
as $$
declare
_login JSONB;
_js JSONB;
begin

_login:='{"username": "admin", "hashpassword": "$2a$10$XGzmW4SE6cgvFfPVw9Jz8eaJm7lyUtLB7AotYlUSxm7bumm/tmm.O"}';

select * from UserLoginJSON(_login) into _js;

call TRACE( concat('TestUserLoginJSON ', _js )  );

end
$$
language plpgsql;


call TestUserLoginJSON();



