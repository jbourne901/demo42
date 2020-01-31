call TRACE('create SP LocalizationUpdateJSON');

create or replace function LocalizationUpdateJSON(doc JSONB, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
_grp localization.grp%TYPE;
_key localization.key%TYPE;
_language localization.language%TYPE;
_value localization.value%TYPE;
isValid bool;
errors JSONB;
_id localization.id%TYPE;
isDup bool;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;

select doc->>'id' into _id;
select doc->>'grp' into _grp;
select doc->>'key' into _key;
select doc->>'language' into _language;
select doc->>'value' into _value;

call LOGJSONADD( concat('LocalizationUpdateJSON1 id=', _id, ' grp=',_grp,',key=',_key,',language=',_language,',_value=',_value), doc);

isValid := true;
isDup:=false;

errors := '{}';
_js:='{}';

if _id is null then
  isValid:=false;
  select UnknownErrJSON() into _js;
  return _js;
end if;

if _grp is null or length(_grp)=0 then
  isValid:=false;
  select jsetstr(errors, 'grp', 'Group is required') into errors;
end if;

if _key is null or length(_key)=0 then
  isValid:=false;
  select jsetstr(errors, 'key', 'Key is required') into errors;
end if;

if _language is null or length(_language)=0 then
  isValid:=false;
  select jsetstr(errors, 'language', 'Language is required') into errors;
end if;

if _value is null or length(_value)=0 then
  isValid:=false;
  select jsetstr(errors, 'value', 'Value is required') into errors;
end if;

if length(_language)>0  and not exists (select 1 from language where language.language = _language) then
  isValid:=false;
  select jsetstr(errors, 'language', 'A valid language is required') into errors;
end if;


if exists (select 1 from localization where grp = _grp and key = _key and language = _language and id <> _id) then
  isValid:=false;
   select jsetstr(errors, 'error', 'Duplicate localization resource') into errors;
end if;

call LOGJSONADD( concat('LocalizationUpdateJSON2 isValid=',isValid), errors );

if isValid then
  update localization set grp=_grp, key=_key, language=_language, value=_value
  where id=_id;
  select SuccessWithoutPayloadJSON() into _js;
else
  select ErrsJSON(errors) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestLocalizationUpdateJSON');

create or replace procedure TestLocalizationUpdateJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestLocalizationUpdateJSON1');

_js:='{ "id":59, "grp": "qq", "key": "qq", "language": "en",  "value": "qq" }';

select LocalizationUpdateJSON(_js, testsession2()) into _js;

call TRACE( concat('TestLocalizationUpdateJSON ', _js) );

end
$$
language plpgsql;

call TestLocalizationUpdateJSON();

