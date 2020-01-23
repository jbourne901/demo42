call TRACE('create SP StandardAddActionJSON');

create or replace function StandardAddActionJSON(entity varchar(40))
returns JSONB
as $$
declare
_js JSONB;
begin

_js := '{"name": "add", "label": "Add", "type": "redirect", "isitemaction": false}';
select * from jsetstr(_js, 'nextpage', concat(entity,'add') ) into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardAddActionJSON');

create or replace procedure TestStandardAddActionJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardAddActionJSON1');


select * from StandardAddActionJSON('user') into _js;

call TRACE( concat( '1TestStandardAddActionJSON ', _js) );

end
$$
language plpgsql;

call TestStandardAddActionJSON();

