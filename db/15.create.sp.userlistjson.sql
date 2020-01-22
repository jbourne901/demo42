call TRACE('create SP UserListJSON');

create or replace function UserListJSON()
returns JSONB
as $$
declare
_js JSONB;
begin

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

select * from UserListJSON() into _js;

call TRACE( concat('TestUserListJSON ', _js) );

end
$$
language plpgsql;


call TestUserListJSON();
