call TRACE('create SP UserDeleteJSON');

create or replace function UserDeleteJSON(id users.id%TYPE, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
_id alias for id;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


_js:='{}';

delete from users where users.id=_id;

select * from  SuccessWithoutPayloadJSON() into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestUserDeleteJSON');

create or replace procedure TestUserDeleteJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestUserDeleteJSON1');

select * from UserDeleteJSON(7777, testsession()) into _js;

call TRACE( concat('TestUserDeleteJSON ', _js) );


end
$$
language plpgsql;

call TestUserDeleteJSON();

