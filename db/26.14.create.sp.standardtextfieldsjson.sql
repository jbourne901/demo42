call TRACE('create SP StandardTextFieldsJSON');

create or replace function StandardTextFieldsJSON(fields varchar)
returns JSONB
as $$
declare
_js JSONB;
begin

_js:='{}';

select json_agg( StandardTextFieldFromTextJSON(splitstring, '/') )from (select * from SplitString(fields, ',')) q into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardTextFieldsJSON');

create or replace procedure TestStandardTextFieldsJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardTextFieldsJSON1');


select * from StandardTextFieldsJSON('name/Name, username/Username, password/Password/password, password2/Confirm password/password') into _js;

call TRACE( concat( '1TestStandardTextFieldsJSON ', _js) );

end
$$
language plpgsql;

call TestStandardTextFieldsJSON();

