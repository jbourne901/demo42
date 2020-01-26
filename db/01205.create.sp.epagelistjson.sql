call TRACE('create SP EPageListJSON');

create or replace function EPageListJSON(session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select  json_agg(q) into _js from (select name,label,type,id from epage order by ordno) q;

if _js is null then
  _js:='[]';
end if;

select SuccessWithPayloadJSON(_js) into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create SP TestEPageListJSON');

create or replace procedure TestEPageListJSON()
as $$
declare
_js JSONB;
begin

select * from EPageListJSON(testsession()) into _js;

call TRACE( concat('TestEPageListJSON ', _js) );

end
$$
language plpgsql;

