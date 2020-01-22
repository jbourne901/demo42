call TRACE('create SP UserUpdateJSON');

create or replace function UserUpdateJSON(userDoc JSONB)
returns JSONB
as $$
declare
_js JSONB;
_name users.name%TYPE;
_username users.username%TYPE;
_password varchar(100);
_password2 varchar(100);
_hashpassword users.hashpassword%TYPE;
_id users.id%TYPE;
isValid bool;
errors JSONB;
usernameInvalid bool;
begin

select userDoc->>'name' into _name;
select userDoc->>'username' into _username;
select userDoc->>'password' into _password;
select userDoc->>'password2' into _password2;
select userDoc->>'hashpassword' into _hashpassword;
select userDoc->>'id' into _id;

call LOGJSONADD( concat('UserUpdateJSON1 name=',_name,',username=',_username,',password=',_password,',_password2=',_password2,',_id=',_id), userDoc);

isValid := true;
usernameInvalid:=false;

errors := '{}';
_js:='{}';

if exists (select 1 from users where users.id=_id) then
  call LOGADD('UserUpdateJSON1.1 record exists');
else
  call LOGADD('UserUpdateJSON1.1 record does not exist');
  isValid:=false;
  select jsetstr(errors, 'error', 'Unknown error (record not found)') into errors;
end if;


if _name is null or length(_name)=0 then
  isValid:=false;
  select jsetstr(errors, 'name', 'Name is required') into errors;
end if;

if _username is null or length(_username)=0 then
  isValid:=false;
  usernameInvalid:=true;
  select jsetstr(errors, 'Username', 'Username is required') into errors;
end if;

if _password is null or length(_password)=0 then
  isValid:=false;
  select jsetstr(errors, 'password', 'Password is required') into errors;
end if;

if _password2 is null or _password<>_password2 then
  isValid:=false;
  select jsetstr(errors, 'password2', 'Passwords dont match') into errors;
end if;

if not usernameInvalid and  _id>0 and exists (select 1 from users where users.id<>_id and username=_username) then
  isValid:=false;
  select jsetstr(errors, 'username', 'Username must be unique') into errors;
end if;

call LOGJSONADD( concat('UserUpdateJSON2 isValid=',isValid), errors );

if isValid then
  update users set name=_name, username=_username, hashpassword=_hashpassword where users.id=_id;
  select SuccessWithoutPayloadJSON() into _js;
else
  select ErrsJSON( errors ) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestUserUpdateJSON');

create or replace procedure TestUserUpdateJSON()
as $$
declare
_js JSONB;
_res JSONB;
begin

call TRACE('1TestUserUpdateJSON1');

_js:='{ "name": "admin", "username": "admin", "id": 1, "password": "12345",  "password2": "12345" }';

select UserUpdateJSON(_js) into _js;

call TRACE( concat('TestUserUpdateJSON ', _js) );

end
$$
language plpgsql;

call TestUserUpdateJSON();

