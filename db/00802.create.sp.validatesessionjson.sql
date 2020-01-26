call TRACE('create function ValidateSessionJSON');


create or replace function ValidateSessionJSON(session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare 
_sessionkey session.sessionkey%TYPE;
userid session.userid%TYPE;
_js JSONB;

begin

select session->>'sessionkey' into _sessionkey;

select session.userid into userid from session where session.sessionkey=_sessionkey;

if userid is null then
  select ErrsJSON('{"error": "Invalid session"}') into _js;
else
  _js:=jsetint('{}', 'userid', userid);
  select SuccessWithPayloadJSON(_js) into _js;
end if;

return _js;

end
$$
language plpgsql;



call TRACE('create procedure TestValidateSessionJSON');

create or replace procedure TestValidateSessionJSON()
as $$
declare
_js JSONB;
begin

select * from ValidateSessionJSON(testsession()) into _js;

call TRACE( concat('TestValidateSessionJSON', _js) );

select * from ValidateSessionJSON(testsession2()) into _js;

call TRACE( concat('TestValidateSessionJSON', _js) );


end
$$
language plpgsql;


call TestValidateSessionJSON();



