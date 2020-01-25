call TRACE('create SP StandardEPageAddJSON');

create or replace function StandardEPageAddJSON(entity varchar(40), entitylabel epage.label%TYPE, listfieldstr text, editfieldstr text)
returns JSONB
as $$
declare
_js JSONB;
listlabel epage.label%TYPE;
editlabel epage.label%TYPE;
addlabel epage.label%TYPE;
begin

listlabel:=entitylabel;
select * from StandardListPageJSON(entity, listlabel, listfieldstr) into _js;

call LOGJSONADD( concat('StandardListPageJSON entity=', entity, ' listfieldstr=', listfieldstr, ' editfieldstr=', editfieldstr), _js);

select * from EPageAddJSON(_js) into _js;


editlabel := concat('Edit ',entitylabel);
if editfieldstr is null or length(editfieldstr)=0 then
  editfieldstr:=listfieldstr;
end if;

select * from StandardEditPageJSON(entity, editlabel, editfieldstr, false) into _js;

call LOGJSONADD( concat('StandardEditPageJSON entity=', entity, ' listfieldstr=', listfieldstr, ' editfieldstr=', editfieldstr), _js);

select * from EPageAddJSON(_js) into _js;


addlabel := concat('Add ', entitylabel);
select * from StandardEditPageJSON(entity, addlabel, editfieldstr, true) into _js;

call LOGJSONADD( concat('StandardEditPageJSON entity=', entity, ' listfieldstr=', listfieldstr, ' editfieldstr=', editfieldstr), _js);



select * from EPageAddJSON(_js) into _js;


return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardEPageAddJSON');

create or replace procedure TestStandardEPageAddJSON()
as $$
declare
_js JSONB;
begin



select * from StandardEPageAddJSON('user', 'Users(EPage)', 'name/Name, username/Username',  'name/Name, username/Username, password/Password/password, password2/Confirm Password/password' ) into _js;

call TRACE( concat( 'TestEPageAddJSON1 ', _js) );


select * from StandardEPageAddJSON('queue', 'Queues', 'name/Name', 'name/Name' ) into _js;

call TRACE( concat( 'TestEPageAddJSON1 ', _js) );


select * from StandardEPageAddJSON('localization', 'Localization', 'grp/Resource, key/Key, language/Language, value/Value', 'grp/Resource, key/Key, language/Language, value/Value' ) into _js;

call TRACE( concat( 'TestEPageAddJSON1 ', _js) );



end
$$
language plpgsql;

call TestStandardEPageAddJSON();

