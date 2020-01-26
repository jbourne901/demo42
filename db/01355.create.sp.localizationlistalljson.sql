call TRACE('create SP LocalizationListAllJSON');

create or replace function LocalizationListAllJSON(session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
r localization%rowtype;
_key varchar(100);
begin

-- here we dont need to check for session because localizations we need in login form as well

    _js:='{}';

    FOR r IN SELECT * FROM localization
    LOOP 
      _key:=concat(r.grp,'.',r.key,'.',r.language);
      _js:=jsetstr(_js, _key, r.value);
    END LOOP;

select SuccessWithPayloadJSON(_js) into _js;

return _js;

end
$$
language plpgsql;






call TRACE('create SP TestLocalizationListAllJSON');

create or replace procedure  TestLocalizationListAllJSON()
as $$
declare
_js JSONB;
begin

select * from LocalizationListAllJSON(testsession()) into _js;

call TRACE( concat('TestLocalizationListAllJSON ', _js) );

end
$$
language plpgsql;


call TestLocalizationListAllJSON();
