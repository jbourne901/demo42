call TRACE('create SP UserSaveJSON');

create or replace function UserSaveJSON(userDoc JSONB)
returns JSONB
as $$
declare
_id users.id%TYPE;
_js JSONB;
begin

select userDoc->>'id' into _id;

call LOGJSONADD( concat('UserSaveJSON1 id=',_id), userDoc);

if _id is null then
  select * from UserAddJSON(userDoc) into _js;
else
  select * from UserUpdateJSON(userDoc) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestUserSaveJSON');

create or replace procedure TestUserSaveJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestUserSaveJSON1');

_js:='{ "name": "admin7", "username": "admin7", "password": "12345",  "password2": "12345", "hashpassword": "$2a$10$XGzmW4SE6cgvFfPVw9Jz8eaJm7lyUtLB7AotYlUSxm7bumm/tmm.O" }';

select UserSaveJSON(_js) into _js;

call TRACE( concat('TestUserSaveJSON ', _js) );

end
$$
language plpgsql;

call TestUserSaveJSON();

