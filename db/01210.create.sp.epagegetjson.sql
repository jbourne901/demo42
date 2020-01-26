call TRACE('create SP EPageGetJSON');

create or replace function EPageGetJSON(id epage.id%TYPE, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_id alias for id;
_epage JSONB;
_fields JSONB;
_pageactions JSONB;
_js JSONB;
isValid bool;
begin

isValid:=false;
_js:='{}';

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


if exists(select 1 from epage where epage.id=_id) and exists(select 1 from epagefield where epagefield.epageid=_id) then

   select row_to_json(q) into _epage from (select * from epage where epage.id=_id) q;
   select json_agg(q) into _fields from (select * from epagefield where epagefield.epageid=_id order by ordno) q;
   select json_agg(q) into _pageactions from (select * from epageaction where epageaction.epageid=_id order by ordno) q;

   _epage:=jsetjson(_epage, 'fields', _fields);
   _epage:=jsetjson(_epage, 'pageactions', _pageactions);

   select SuccessWithPayloadJSON(_epage) into _js;
else
   select UnknownErrJSON() into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create SP TestEPageGetJSON');

create or replace procedure TestEPageGetJSON()
as $$
declare
_js JSONB;
begin

select * from EPageGetJSON(1, testsession()) into _js;

call TRACE( concat('TestEPageGetJSON ', _js) );

end
$$
language plpgsql;

call TestEPageGetJSON();
