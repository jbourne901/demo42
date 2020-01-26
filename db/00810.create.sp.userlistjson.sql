call TRACE('create SP UserListJSON');

create or replace function UserListJSON(session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select json_agg(q) into _js from (select name,username,id from users) q;

if _js is null then
  _js = '[]';
end if;

select SuccessWithPayloadJSON(_js) into _js;

return _js;

end
$$
language plpgsql;






call TRACE('create SP TestUserListJSON');

create or replace procedure  TestUserListJSON()
as $$
declare
_js JSONB;
begin

select * from UserListJSON(testsession()) into _js;

call TRACE( concat('TestUserListJSON ', _js) );

end
$$
language plpgsql;


call TestUserListJSON();
