call TRACE('create SP LocalizationListAllJSON');

create or replace function LocalizationListAllJSON()
returns JSONB
as $$
declare
_js JSONB;
r localization%rowtype;
_key varchar(100);
begin

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

select * from LocalizationListAllJSON() into _js;

call TRACE( concat('TestLocalizationListAllJSON ', _js) );

end
$$
language plpgsql;


call TestLocalizationListAllJSON();
