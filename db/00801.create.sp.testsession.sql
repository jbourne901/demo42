call TRACE('create function TestSession');


create or replace function TestSession()
returns TYPE_SESSIONPARAM
as $$
begin


return '{}';


end
$$
language plpgsql;

-----------------------------------------

call TRACE('create function TestSession2');

create or replace function TestSession2()
returns TYPE_SESSIONPARAM
as $$
declare
_sessionkey session.sessionkey%TYPE;
begin


delete from users where users.name='admin5';

insert into users(username, name)
select 'admin5', 'admin5';

_sessionkey:='9a339d2a-d412-4823-abb4-f8371bb44601';

insert into session(sessionkey, userid)
select _sessionkey, users.id from users where username='admin5';

return jsetstr('{}', 'sessionkey', _sessionkey::varchar);


end
$$
language plpgsql;

--------------------------------------

call TRACE('create procedure TestTestSession');

create or replace procedure TestTestSession()
as $$
declare
_js JSONB;
begin

select * from TestSession() into _js;

call TRACE( concat('TestTestSession', _js) );

select * from TestSession2() into _js;

call TRACE( concat('TestTestSession2', _js) );



end
$$
language plpgsql;


call TestTestSession();



