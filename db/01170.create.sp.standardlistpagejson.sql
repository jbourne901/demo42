call TRACE('create SP StandardListPageJSON');

create or replace function StandardListPageJSON(entity varchar(40), label epage.label%TYPE, _fieldstr text, options JSONB default null)
returns JSONB
as $$
declare
_js JSONB;
_fields JSONB;
_pageactions JSONB;
actionsoptions JSONB;
pageoptions JSONB;
fieldsoptions JSONB;
begin

--_js:='{ "name": "user", "type":"list", "label": "Users (EPage)", "query": "UserListJSON()",  "pkname": "id" }';
--_js:=jsetjson(_js, 'fields', _fields);
--_js:=jsetjson(_js, 'pageactions', _pageactions);

if options is not null then
  actionsoptions := options->'actions';
  pageoptions := options->'page';
  fieldsoptions := options->'fields';
end if;



select * from StandardPageActionsJSON(entity, actionsoptions) into _pageactions;

select * from StandardListFieldsJSON(_fieldstr, fieldsoptions) into _fields;

_js:='{"type":"list",  "pkname": "id" }';
select * from jsetstr(_js, 'name', entity) into _js;
select * from jsetstr(_js, 'label', label) into _js;
select * from jsetstr(_js, 'query', concat(entity, 'ListJSON($1)') ) into _js;
select * from jsetjson(_js, 'fields', _fields) into _js;
select * from jsetjson(_js, 'pageactions', _pageactions) into _js;
select * from jsetstr(_js, 'entity', entity) into _js;



return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardListPageJSON');

create or replace procedure TestStandardListPageJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardListPageJSON1');

select * from StandardListPageJSON('workgroup', 'Workgroup', 'name/Name') into _js;

call TRACE( concat( '1TestStandardListPageJSON ', _js) );

end
$$
language plpgsql;

call TestStandardListPageJSON();

