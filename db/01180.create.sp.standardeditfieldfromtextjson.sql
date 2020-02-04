call TRACE('create SP StandardEditFieldFromTextJSON');

create or replace function StandardEditFieldFromTextJSON(str text, delim varchar(10), options JSONB default null)
returns JSON
as $$
declare
_js JSONB;
_name varchar(50);
_label text;
_type varchar(40);
_tab varchar(40);
begin

select split_part(str, delim,1) into _name;
select split_part(str, delim,2) into _label;
select split_part(str, delim,3) into _type;
select split_part(str, delim,4) into _tab;



select StandardEditFieldJSON(_name, _label, _type, _tab) into _js;

_js := SafeMergeOptionsJSON(options, _name, _js);

return _js;

end
$$
language plpgsql;






call TRACE('create SP TestStandardEditFieldFromTextJSON');

create or replace procedure  TestStandardEditFieldFromTextJSON()
as $$
declare
_js JSONB;
begin


select * from StandardEditFieldFromTextJSON('name/Name', '/') into _js;
call TRACE( concat('TestStandardEditFieldFromTextJSON ', _js) );

select * from StandardEditFieldFromTextJSON('password/Password/password/tab40', '/') into _js;
call TRACE( concat('TestStandardEditFieldFromTextJSON ', _js) );


end
$$
language plpgsql;


call TestStandardEditFieldFromTextJSON();


