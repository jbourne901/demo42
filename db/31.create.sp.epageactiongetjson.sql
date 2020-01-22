call TRACE('create SP EPageActionGetJSON');

create or replace function EPageActionGetJSON(id epageaction.id%TYPE, entid bigint)
returns JSONB
as $$
declare
_id alias for id;
_js JSONB;
_nextpage epageaction.nextpage%TYPE;
_nextid epage.id%TYPE;
_nexttype epage.type%TYPE;
begin

_js:='{}';

select row_to_json(q) into _js from (select * from epageaction where epageaction.id=_id) q;

if _js is not null then
   select EPageActionSetNextPage(_js, entid) into _js;
   select SuccessWithPayloadJSON(_js) into _js;
else
   select UnknownErrJSON() into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create SP TestEPageActionGetJSON');

create or replace procedure TestEPageActionGetJSON()
as $$
declare
_js JSONB;
begin

select * from EPageActionGetJSON(1, 2) into _js;

call TRACE( concat('TestEPageActionGetJSON ', _js) );

end
$$
language plpgsql;

call TestEPageActionGetJSON();
