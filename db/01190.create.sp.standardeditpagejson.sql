call TRACE('create SP StandardEditPageJSON');

create or replace function StandardEditPageJSON(entity varchar(40), label epage.label%TYPE, _fieldstr text, isadd bool)
returns JSONB
as $$
declare
_js JSONB;
_fields JSONB;
_pageactions JSONB;
_name epage.name%TYPE;
begin

--_js:='{ "name": "user", "type":"list", "label": "Users (EPage)", "query": "UserEditJSON()",  "pkname": "id" }';
--_js:=jsetjson(_js, 'fields', _fields);
--_js:=jsetjson(_js, 'pageactions', _pageactions);

select * from StandardEditActionsJSON(entity, isadd) into _pageactions;

select * from StandardTextFieldsJSON(_fieldstr) into _fields;

_js:='{"type":"edit",  "pkname": "id" }';

_name:=concat(entity, 'edit');
if isAdd then
  _name:=concat(entity, 'add');
end if;
select * from jsetstr(_js, 'name', _name ) into _js;
select * from jsetstr(_js, 'label', label) into _js;
select * from jsetstr(_js, 'query', concat(entity, 'GetJSON($1, $2)') ) into _js;
select * from jsetjson(_js, 'fields', _fields) into _js;
select * from jsetjson(_js, 'pageactions', _pageactions) into _js;
select * from jsetstr(_js, 'entity', entity ) into _js;




return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardEditPageJSON');

create or replace procedure TestStandardEditPageJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardEditPageJSON1');

select * from StandardEditPageJSON('workgroup', 'Edit Workgroup', 'name/Name', false) into _js;

call TRACE( concat( '1TestStandardEditPageJSON ', _js) );

end
$$
language plpgsql;

call TestStandardEditPageJSON();

