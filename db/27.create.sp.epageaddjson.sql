call TRACE('create SP EPageAddJSON');

create or replace function EPageAddJSON(doc JSONB)
returns JSONB
as $$
declare
_js JSONB;
_name epage.name%TYPE;
_label epage.label%TYPE;
_type epage.type%TYPE;
_query epage.query%TYPE;
_pkname epage.pkname%TYPE;
_ordno epage.ordno%TYPE;
_id epage.id%TYPE;
_fields JSONB;
_pageactions JSONB;
begin

call LOGJSONADD( 'EPageAddJSON1 doc=', doc );

select doc->>'name' into _name;
select doc->>'label' into _label;
select doc->>'type' into _type;
select doc->>'query' into _query;
select doc->>'pkname' into _pkname;
select doc->'fields' into _fields;
select doc->'pageactions' into _pageactions;

call LOGJSONADD( concat('EPageAddJSON1 name=',_name,',label=',_label,',query=',_query,',_pkname=',_pkname,' _type=',_type), doc);

insert into epage(name,label,query,pkname,type)
select _name, _label, _query, _pkname, _type;

select epage.id into _id from epage where name=_name;

insert into epagefield(name,label,epageid,ordno, type)
select name,label,_id,row_number() over() ordno, type from json_to_recordset(_fields::json) as x(name TYPE_EPAGEFIELDNAME, label TYPE_EPAGEFIELDLABEL, type TYPE_EPAGEFIELDTYPE);

insert into epageaction(name,label,epageid,ordno,type,query,isitemaction, nextpage, confirm)
select name,label,_id,row_number() over() ordno, type, query, coalesce(isitemaction, false), nextpage, confirm from json_to_recordset(_pageactions::json) 
       as x(name TYPE_EPAGEACTIONNAME, label TYPE_EPAGEACTIONLABEL, type TYPE_EPAGEACTIONTYPE, query TYPE_EPAGEACTIONQUERY, isitemaction TYPE_EPAGEACTIONISITEMACTION, nextpage TYPE_EPAGENAME, confirm TYPE_EPAGEACTIONCONFIRM);


select jsetint('{}', 'id',  _id) into _js;
select SuccessWithPayloadJSON(_js) into _js;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestEPageAddJSON');

create or replace procedure TestEPageAddJSON()
as $$
declare
_js JSONB;
_res JSON;
_fields JSONB;
_pageactions JSONB;
_addaction JSONB;
_editaction JSONB;
_deleteaction JSONB;
_saveaction JSONB;
_cancelaction JSONB;
_confirm epageaction.confirm%TYPE;
begin

call TRACE('1TestEPageAddJSON1');

delete from epage;

_fields := '[{"name": "name", "label": "Name"}, {"name": "username", "label": "Username"}]';

_pageactions := '[]';
_addaction := '{"name": "add", "label": "Add", "type": "redirect", "isitemaction": false, "nextpage": "useredit"}';

_pageactions := jarraddjson(_pageactions, _addaction);

_editaction := '{"name": "edit", "label": "Edit", "type": "redirect", "isitemaction": true, "nextpage": "useredit"}';

_deleteaction := '{"name": "delete", "label": "Delete", "type": "trigger", "isitemaction": true,  "query": "UserDeleteJSON($1)"}';
_confirm = 'Are you sure you want to delete user ${name}?';
_deleteaction = jsetstr(_deleteaction, 'confirm', _confirm);

_pageactions=jarraddjson(_pageactions,  _editaction);
_pageactions=jarraddjson(_pageactions,  _deleteaction);

_js:='{ "name": "user", "type":"list", "label": "Users (EPage)", "query": "UserListJSON()",  "pkname": "id" }';
_js:=jsetjson(_js, 'fields', _fields);
_js:=jsetjson(_js, 'pageactions', _pageactions);


select * from EPageAddJSON(_js) into _js;

call TRACE( concat( 'TestEPageAddJSON1 ', _js) );


_fields := '[{"name": "name", "label": "Name"}, {"name": "username", "label": "Username"}, {"name":"password", "label": "Password", "type":"password"}, {"name":"password2", "label": "Confirm password", "type":"password"}]';

_pageactions := '[]';
_saveaction := '{"name": "save", "label": "Save", "type": "trigger", "isitemaction": false, "query": "UserSaveJSON($1)", "nextpage": "user"}';

_confirm := 'Are you sure? All changes will be lost';
_cancelaction :=  '{"name": "cancel", "label": "Cancel", "type": "redirect", "isitemaction": false, "nextpage": "user"}';
_cancelaction = jsetstr(_cancelaction, 'confirm', _confirm);

_pageactions := jarraddjson(_pageactions, _saveaction);
_pageactions := jarraddjson(_pageactions, _cancelaction);


_js:='{ "name": "useredit", "type":"edit", "label": "Edit User (EPage)", "query": "UserGetJSON($1)",  "pkname": "id" }';
_js:=jsetjson(_js, 'fields', _fields);
_js:=jsetjson(_js, 'pageactions', _pageactions);

select * from EPageAddJSON(_js) into _js;

call TRACE( concat( 'TestEPageAddJSON2 ', _js) );



call TRACE( concat( '1TestEPageAddJSON ', _js) );

end
$$
language plpgsql;

call TestEPageAddJSON();

