call TRACE('create SP StandardSaveActionJSON');

create or replace function StandardSaveActionJSON(entity varchar(40), isadd bool)
returns JSONB
as $$
declare
_js JSONB;
_name epageaction.name%TYPE;
_label epageaction.label%TYPE;
begin


--//_saveaction := '{"name": "save", "label": "Save", "type": "trigger", "isitemaction": false, "query": "UserSaveJSON($1)", "nextpage": "user"}';

_name:='save';
_label:='Save';
if isadd then
   _name:='add';
   _label:='Add';
end if;

_js := '{"type": "trigger", "isitemaction": false}';

select * from jsetstr(_js, 'name', _name ) into _js;
select * from jsetstr(_js, 'label', _label ) into _js;

select * from jsetstr(_js, 'nextpage', entity ) into _js;
select * from jsetstr(_js, 'query', concat(entity,'SaveJSON($1)') ) into _js;


return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardSaveActionJSON');

create or replace procedure TestStandardSaveActionJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardSaveActionJSON1');


select * from StandardSaveActionJSON('user', false) into _js;

call TRACE( concat( '1TestStandardSaveActionJSON ', _js) );

end
$$
language plpgsql;

call TestStandardSaveActionJSON();

