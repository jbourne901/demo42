call TRACE('create SP UserAddJSON');

create or replace function UserAddJSON(userDoc JSONB)
returns JSONB
as $$
declare
_js JSONB;
_name users.name%TYPE;
_username users.username%TYPE;
_password varchar(100);
_password2 varchar(100);
_hashpassword users.hashpassword%TYPE;
isValid bool;
errors JSONB;
usernameInvalid bool;
_id users.id%TYPE;
begin

select userDoc->>'name' into _name;
select userDoc->>'username' into _username;
select userDoc->>'password' into _password;
select userDoc->>'password2' into _password2;
select userDoc->>'hashpassword' into _hashpassword;

call LOGJSONADD( concat('UserAddJSON1 name=',_name,',username=',_username,',password=',_password,',_password2=',_password2), userDoc);

isValid := true;
usernameInvalid:=false;

errors := '{}';
_js:='{}';

if _name is null or length(_name)=0 then
  isValid:=false;
  select jsetstr(errors, 'name', 'Name is required') into errors;
end if;

if _username is null or length(_username)=0 then
  isValid:=false;
  usernameInvalid:=true;
  select jsetstr(errors, 'username', 'Username is required') into errors;
end if;

if _password is null or length(_password)=0 then
  isValid:=false;
  select jsetstr(errors, 'password', 'Password is required') into errors;
end if;

if _password2 is null or _password<>_password2 then
  isValid:=false;
  select jsetstr(errors, 'password2', 'Passwords dont match') into errors;
end if;

if not usernameInvalid and exists (select 1 from users where username=_username) then
  isValid:=false;
   select jsetstr(errors, 'username', 'Username must be unique') into errors;
end if;

call LOGJSONADD( concat('UserAddJSON2 isValid=',isValid), errors );

if isValid then
  insert into users(username, name, hashpassword)
  select _username, _name, _hashpassword;
  select users.id into _id from users where users.username=_username;
  select jsetint('{}', 'id', _id) into _js;
  select SuccessWithPayloadJSON(_js) into _js;
else
  select ErrsJSON(errors) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestUserAddJSON');

create or replace procedure TestUserAddJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestUserAddJSON1');

_js:='{ "name": "admin7", "username": "admin7", "password": "12345",  "password2": "12345", "hashpassword": "$2a$10$XGzmW4SE6cgvFfPVw9Jz8eaJm7lyUtLB7AotYlUSxm7bumm/tmm.O" }';

select UserAddJSON(_js) into _js;

call TRACE( concat('TestUserAddJSON ', _js) );

end
$$
language plpgsql;

call TestUserAddJSON();

