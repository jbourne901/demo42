call TRACE('create function UserLoginJSON');

create or replace function UserLoginJSON(login JSONB, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
_username users.username%TYPE;
_password varchar(40);
_hashpassword users.hashpassword%TYPE;
_name users.name%TYPE;
_id users.id%TYPE;
_u JSONB;
_js1 JSONB;
_sessionkey session.sessionkey%TYPE;
begin

-- here we dont need to cvalidae user session

select login->>'username' into _username;
select login->>'password' into _password;

_hashpassword:=PasswordHash(_password);

call LOGJSONADD(concat('UserLoginJSON ', _username, ' ', _password, ' ',  _hashpassword), login);

select u.id, u.name into _id, _name from users u where u.username=_username and u.hashpassword=_hashpassword;
if _id is null then
   select ErrsJSON('{"error": "Login failed"}') into _js;
else
   delete from session where session.userid = _id;
   _sessionkey:=uuid_generate_v4()::varchar;
   insert into session(userid, sessionkey)
   select _id, _sessionkey;
   select row_to_json(q) as payload from (select id, name, _sessionkey sessionkey from users where users.id = _id) q into _js;
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

_login:='{"username": "admin", "password": "12345" }';

select * from UserLoginJSON(_login, testsession()) into _js;

call TRACE( concat('TestUserLoginJSON ', _js )  );

end
$$
language plpgsql;


call TestUserLoginJSON();



