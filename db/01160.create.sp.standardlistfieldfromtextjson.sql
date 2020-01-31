call TRACE('create SP StandardListFieldFromTextJSON');

create or replace function StandardListFieldFromTextJSON(str text, delim varchar(10), options JSONB default null)
returns JSON
as $$
declare
_js JSONB;
_name varchar(50);
_label text;
begin

select split_part(str, delim,1) into _name;
select split_part(str, delim,2) into _label;


_js:='{}';
_js:=jsetstr(_js, 'name',_name);
_js:=jsetstr(_js, 'label',_label);

_js := SafeMergeOptionsJSON( options, _name, _js);

return _js;

end
$$
language plpgsql;






call TRACE('create SP TestStandardListFieldFromTextJSON');

create or replace procedure  TestStandardListFieldFromTextJSON()
as $$
declare
_js JSONB;
begin


select * from StandardListFieldFromTextJSON('name/Name', '/') into _js;


call TRACE( concat('TestStandardListFieldFromTextJSON ', _js) );

end
$$
language plpgsql;


call TestStandardListFieldFromTextJSON();


