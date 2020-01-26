call TRACE('create SP UserSaveJSON');

create or replace function UserSaveJSON(doc JSONB, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_id users.id%TYPE;
_js JSONB;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select doc->>'id' into _id;

call LOGJSONADD( concat('UserSaveJSON1 id=',_id), doc);

if _id is null then
  select * from UserAddJSON(doc, session) into _js;
else
  select * from UserUpdateJSON(doc, session) into _js;
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

_js:='{ "name": "admin7", "username": "admin7", "password": "12345",  "password2": "12345" }';
_js:=jsetstr(_js, 'hashpassword', PasswordHash('12345'));

select UserSaveJSON(_js, testsession()) into _js;

call TRACE( concat('TestUserSaveJSON ', _js) );

end
$$
language plpgsql;

call TestUserSaveJSON();

