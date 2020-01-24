call TRACE('create SP LanguageListAllJSON');

create or replace function LanguageListAllJSON()
returns JSONB
as $$
declare
_js JSONB;
begin

select json_agg(q) into _js from (select * from language) q;

if _js is null then
  _js = '[]';
end if;

select SuccessWithPayloadJSON(_js) into _js;

return _js;

end
$$
language plpgsql;






call TRACE('create SP TestLanguageListAllJSON');

create or replace procedure  TestLanguageListAllJSON()
as $$
declare
_js JSONB;
begin

select * from LanguageListAllJSON() into _js;

call TRACE( concat('TestLanguageListAllJSON ', _js) );

end
$$
language plpgsql;


call TestLanguageListAllJSON();

