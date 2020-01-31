call TRACE('create SP GetFunctionCreate');

create or replace procedure GetFunctionCreate(tablename entitytable.table%TYPE)
as $spg1$
declare
_sql varchar(1000);
begin

_sql:='
create or replace function $tablename$GetJSON(id "$tablename$".id%TYPE, session TYPE_SESSIONPARAM) 
returns JSONB
as $spg$
declare
_js JSONB;
_id alias for id;
begin

select row_to_json(q) into _js from (select * from "$tablename$" where "$tablename$".id=_id) q;

if _js is null then
   select UnknownErrJSON() into _js;
else
   select SuccessWithPayloadJSON(_js) into _js;
end if;

return _js;

end
$spg$
language plpgsql;
';

_sql:=replace(_sql, '$tablename$', tablename);


call TRACE(_sql);

execute _sql;

end
$spg1$
language plpgsql;






call TRACE('create SP TestGetFunctionCreate');

create or replace procedure  TestGetFunctionCreate()
as $$
declare
begin

call TRACE( concat('TestGetFunctionCreate ') );
call GetFunctionCreate('workgroups');

end
$$
language plpgsql;


call TestGetFunctionCreate();
