call TRACE('create SP StandardEditActionJSON');

create or replace function StandardEditActionJSON(entity varchar(40))
returns JSONB
as $$
declare
_js JSONB;
begin

_js := '{"name": "edit", "label": "Edit", "type": "redirect", "isitemaction": true}';

select * from jsetstr(_js, 'nextpage', concat(entity,'edit') ) into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardEditActionJSON');

create or replace procedure TestStandardEditActionJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardEditActionJSON1');


select * from StandardEditActionJSON('user') into _js;

call TRACE( concat( '1TestStandardEditActionJSON ', _js) );

end
$$
language plpgsql;

call TestStandardEditActionJSON();

