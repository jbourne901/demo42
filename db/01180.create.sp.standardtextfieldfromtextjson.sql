call TRACE('create SP StandardTextFieldFromTextJSON');

create or replace function StandardTextFieldFromTextJSON(str text, delim varchar(10))
returns JSON
as $$
declare
_js JSONB;
_name varchar(50);
_label text;
_type varchar(40);
begin

select split_part(str, delim,1) into _name;
select split_part(str, delim,2) into _label;
select split_part(str, delim,3) into _type;


select StandardTextFieldJSON(_name, _label, _type) into _js;

return _js;

end
$$
language plpgsql;






call TRACE('create SP TestStandardTextFieldFromTextJSON');

create or replace procedure  TestStandardTextFieldFromTextJSON()
as $$
declare
_js JSONB;
begin


select * from StandardTextFieldFromTextJSON('name/Name', '/') into _js;
call TRACE( concat('TestStandardTextFieldFromTextJSON ', _js) );

select * from StandardTextFieldFromTextJSON('password/Password/password', '/') into _js;
call TRACE( concat('TestStandardTextFieldFromTextJSON ', _js) );


end
$$
language plpgsql;


call TestStandardTextFieldFromTextJSON();


