call TRACE('create SP StandardDeleteActionJSON');

create or replace function StandardDeleteActionJSON(entity varchar(40))
returns JSONB
as $$
declare
_js JSONB;
begin

_js := '{"name": "delete", "label": "Delete", "type": "trigger", "isitemaction": true}';
select * from jsetstr(_js, 'query', concat(entity,'DeleteJSON($1, $2)') ) into _js;
select * from jsetstr(_js, 'confirm', 'confirm_listitemdelete' )  into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardDeleteActionJSON');

create or replace procedure TestStandardDeleteActionJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardDeleteActionJSON1');


select * from StandardDeleteActionJSON('user') into _js;

call TRACE( concat( '1TestStandardDeleteActionJSON ', _js) );

end
$$
language plpgsql;

call TestStandardDeleteActionJSON();

