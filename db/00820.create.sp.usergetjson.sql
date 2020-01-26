call TRACE('create SP UserGetJSON');

create or replace function UserGetJSON(id users.id%TYPE, session TYPE_SESSIONPARAM)
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


select row_to_json(q) into _js from (select name,username,users.id, '' as password, '' as password2 from users where users.id=_id) q;

if _js is null then
   select UnknownErrJSON() into _js;
else
   select SuccessWithPayloadJSON(_js) into _js;
end if;

return _js;

end
$$
language plpgsql;





call TRACE('create SP TestUserGetJSON');

create or replace procedure TestUserGetJSON()
as $$
declare
_js JSONB;
begin

select * from UserGetJSON(1, testsession()) into _js;

call TRACE( concat ('TestUserGetJSON ', _js) );

end
$$
language plpgsql;

call TestUserGetJSON();


