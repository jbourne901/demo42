call TRACE('create SP StandardEditFieldsJSON');

create or replace function StandardEditFieldsJSON(fields varchar, options JSONB default null)
returns JSONB
as $$
declare
_js JSONB;
begin

_js:='{}';

select json_agg( StandardEditFieldFromTextJSON(splitstring, '/', options) )from (select * from SplitString(fields, ',')) q into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardEditFieldsJSON');

create or replace procedure TestStandardEditFieldsJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardEditFieldsJSON1');


select * from StandardEditFieldsJSON('name/Name, username/Username, password/Password/password, password2/Confirm password/password') into _js;

call TRACE( concat( '1TestStandardEditFieldsJSON ', _js) );

end
$$
language plpgsql;

call TestStandardEditFieldsJSON();

