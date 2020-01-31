call TRACE('create SP LocalizationGetJSON');

create or replace function LocalizationGetJSON(id localization.id%TYPE, session TYPE_SESSIONPARAM)
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


select row_to_json(q) into _js from (select * from localization where localization.id=_id) q;

if _js is null then
   select UnknownErrJSON() into _js;
else
   select SuccessWithPayloadJSON(_js) into _js;
end if;

return _js;

end
$$
language plpgsql;





call TRACE('create SP TestLocalizationGetJSON');

create or replace procedure TestLocalizationGetJSON()
as $$
declare
_js JSONB;
begin

select * from LocalizationGetJSON(3, testsession2()) into _js;

call TRACE( concat ('TestLocalizationGetJSON ', _js) );

end
$$
language plpgsql;

call TestLocalizationGetJSON();


