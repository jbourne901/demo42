call TRACE('create SP StandardListFieldsJSON');

create or replace function StandardListFieldsJSON(fields varchar)
returns JSONB
as $$
declare
_js JSONB;
begin

_js:='{}';

select json_agg( StandardListFieldFromTextJSON(splitstring, '/') )from (select * from SplitString(fields, ',')) q into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardListFieldsJSON');

create or replace procedure TestStandardListFieldsJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardListFieldsJSON1');


select * from StandardListFieldsJSON('name/Name, username/Username') into _js;

call TRACE( concat( '1TestStandardListFieldsJSON ', _js) );

end
$$
language plpgsql;

call TestStandardListFieldsJSON();

