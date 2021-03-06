call TRACE('create SP StandardEPageAddJSON');

create or replace function StandardEPageAddJSON(entity varchar(40), entitylabel epage.label%TYPE, listfieldstr text, editfieldstr text, session TYPE_SESSIONPARAM, options JSON default null)
returns JSONB
as $$
declare
_js JSONB;
listlabel epage.label%TYPE;
editlabel epage.label%TYPE;
addlabel epage.label%TYPE;
_listoptions JSONB;
_editoptions JSONB;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;

if options is not null then
  _listoptions := options->'listpage';
  _editoptions := options->'editpage';
end if;

listlabel:=entitylabel;
select * from StandardListPageJSON(entity, listlabel, listfieldstr, _listoptions) into _js;

call LOGJSONADD( concat('StandardListPageJSON entity=', entity, ' listfieldstr=', listfieldstr, ' editfieldstr=', editfieldstr), _js);

select * from EPageAddJSON(_js, session) into _js;


editlabel := concat('Edit ',entitylabel);
if editfieldstr is null or length(editfieldstr)=0 then
  editfieldstr:=listfieldstr;
end if;

select * from StandardEditPageJSON(entity, editlabel, editfieldstr, false, _editoptions) into _js;

call LOGJSONADD( concat('StandardEditPageJSON entity=', entity, ' listfieldstr=', listfieldstr, ' editfieldstr=', editfieldstr), _js);

select * from EPageAddJSON(_js, session) into _js;


addlabel := concat('Add ', entitylabel);
select * from StandardEditPageJSON(entity, addlabel, editfieldstr, true, _editoptions) into _js;

call LOGJSONADD( concat('StandardEditPageJSON entity=', entity, ' listfieldstr=', listfieldstr, ' editfieldstr=', editfieldstr), _js);



select * from EPageAddJSON(_js, session) into _js;


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



select * from StandardEPageAddJSON('user', 'Users(EPage)', 'name/Name, username/Username',  'name/Name, username/Username, password/Password/password, password2/Confirm Password/password', testsession2() ) into _js;

call TRACE( concat( 'TestEPageAddJSON1 ', _js) );


select * from StandardEPageAddJSON('queue', 'Queues', 'name/Name', 'name/Name', testsession2() ) into _js;

call TRACE( concat( 'TestEPageAddJSON1 ', _js) );


select * from StandardEPageAddJSON('localization', 'Localization', 'grp/Resource, key/Key, language/Language, value/Value', 'grp/Resource, key/Key, language/Language, value/Value', testsession2() ) into _js;

call TRACE( concat( 'TestEPageAddJSON1 ', _js) );



end
$$
language plpgsql;

call TestStandardEPageAddJSON();

