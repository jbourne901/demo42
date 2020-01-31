call TRACE('create SP LocalizationSaveJSON');

create or replace function LocalizationSaveJSON(doc JSONB, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_id localization.id%TYPE;
_js JSONB;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select doc->>'id' into _id;

call LOGJSONADD( concat('LocalizationSaveJSON1 id=',_id), doc);

if _id is null then
  select * from LocalizationAddJSON(doc, session) into _js;
else
  select * from LocalizationUpdateJSON(doc, session) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestLocalizationSaveJSON');

create or replace procedure TestLocalizationSaveJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestLocalizationSaveJSON1');

_js:='{ "grp": "testgrp", "key": "testheader", "value": "12345",  "language": "en" }';

_js:='{ "id":59, "grp": "qq", "key": "qq", "language": "en",  "value": "qq" }';


select LocalizationSaveJSON(_js, testsession2()) into _js;

call TRACE( concat('TestLocalizationSaveJSON ', _js) );

end
$$
language plpgsql;

call TestLocalizationSaveJSON();

