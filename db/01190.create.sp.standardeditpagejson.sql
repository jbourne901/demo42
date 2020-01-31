call TRACE('create SP StandardEditPageJSON');

create or replace function StandardEditPageJSON(entity varchar(40), label epage.label%TYPE, _fieldstr text, isadd bool, options JSONB default null)
returns JSONB
as $$
declare
_js JSONB;
_fields JSONB;
_pageactions JSONB;
_name epage.name%TYPE;
pageoptions JSONB;
fieldsoptions JSONB;
actionsoptions JSONB;
begin

--_js:='{ "name": "user", "type":"list", "label": "Users (EPage)", "query": "UserEditJSON()",  "pkname": "id" }';
--_js:=jsetjson(_js, 'fields', _fields);
--_js:=jsetjson(_js, 'pageactions', _pageactions);

if options is not null then
   pageoptions := options->'page';
   fieldsoptions := options->'fields';
   actionsoptions := options->'actions';
end if;

select * from StandardEditActionsJSON(entity, isadd, actionsoptions) into _pageactions;

select * from StandardEditFieldsJSON(_fieldstr, fieldsoptions) into _fields;

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


_js := SafeMergeOptionsJSON(pageoptions, 'page', _js);

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

