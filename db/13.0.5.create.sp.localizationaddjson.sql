call TRACE('create SP LocalizationAddJSON');

create or replace function LocalizationAddJSON(doc JSONB)
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

select doc->>'grp' into _grp;
select doc->>'key' into _key;
select doc->>'language' into _language;
select doc->>'value' into _value;

call LOGJSONADD( concat('LocalizationAddJSON1 grp=',_grp,',key=',_key,',language=',_language,',_value=',_value), doc);

isValid := true;
isDup:=false;

errors := '{}';
_js:='{}';

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


if exists (select 1 from localization where grp = _grp and key = _key and language = _language) then
  isValid:=false;
   select jsetstr(errors, 'error', 'Duplicate localization resource') into errors;
end if;

call LOGJSONADD( concat('LocalizationAddJSON2 isValid=',isValid), errors );

if isValid then
  insert into localization(grp, key, language, value)
  select _grp, _key, _language, _value;
  select localization.id into _id from localization where localization.grp=_grp and localization.key=_key and localization.language=_language;
  select jsetint('{}', 'id', _id) into _js;
  select SuccessWithPayloadJSON(_js) into _js;
else
  select ErrsJSON(errors) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestLocalizationAddJSON');

create or replace procedure TestLocalizationAddJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestLocalizationAddJSON1');

_js:='{ "grp": "workgroup", "key": "delete", "language": "en",  "value": "Delete" }';

select LocalizationAddJSON(_js) into _js;

call TRACE( concat('TestLocalizationAddJSON ', _js) );

end
$$
language plpgsql;

call TestLocalizationAddJSON();

