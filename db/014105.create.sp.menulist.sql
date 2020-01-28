call TRACE('create SP MenuListJSON');

create or replace function MenuListJSON(session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select json_agg(q) into _js from (select * from menu) q;

if _js is null then
  _js = '[]';
end if;

select SuccessWithPayloadJSON(_js) into _js;

return _js;

end
$$
language plpgsql;






call TRACE('create SP TestMenuListJSON');

create or replace procedure  TestMenuListJSON()
as $$
declare
_js JSONB;
begin

select * from MenuListJSON(testsession()) into _js;

call TRACE( concat('TestMenuListJSON ', _js) );

end
$$
language plpgsql;


call TestMenuListJSON();
