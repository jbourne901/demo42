call TRACE('create SP EPageAddJSON');

create or replace function EPageAddJSON(doc JSONB, session TYPE_SESSIONPARAM)
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
_entity epage.entity%TYPE;
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
select doc->>'entity' into _entity;
select doc->'fields' into _fields;
select doc->'pageactions' into _pageactions;

call LOGJSONADD( concat('EPageAddJSON1 name=',_name,',label=',_label,',query=',_query,',_pkname=',_pkname,' _type=',_type,' _entity=',_entity), doc);

insert into epage(name,label,query,pkname,type,entity)
select _name, _label, _query, _pkname, _type, _entity;

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
_namefield JSONB;
_usernamefield JSONB;
_passwordfield JSONB;
_password2field JSONB;
begin

call TRACE('1TestEPageAddJSON1');


--_fields := '[{"name": "name", "label": "Name"}, {"name": "username", "label": "Username"}]';

--select * from StandardListFieldJSON('name', 'Name') into _namefield;
--select * from StandardListFieldJSON('username', 'Username') into _usernamefield;
--_fields := '[]';
--_fields := jarraddjson(_fields, _namefield);
--_fields := jarraddjson(_fields, _usernamefield);

--_js:='{ "name": "useredit", "type":"edit", "label": "Edit User (EPage)", "query": "UserGetJSON($1)",  "pkname": "id" }';
--_js:=jsetjson(_js, 'fields', _fields);
--_js:=jsetjson(_js, 'pageactions', _pageactions);


end
$$
language plpgsql;

call TestEPageAddJSON();

