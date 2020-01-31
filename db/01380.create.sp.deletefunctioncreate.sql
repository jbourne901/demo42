call TRACE('create SP DeleteFunctionCreate');

create or replace procedure DeleteFunctionCreate(tablename entitytable.table%TYPE)
as $spd1$
declare
_sql varchar(1000);
begin

_sql:='
create or replace function $tablename$DeleteJSON(id "$tablename$".id%TYPE, session TYPE_SESSIONPARAM) 
returns JSONB
as $spd$
declare
_js JSONB;
_id alias for id;
begin

delete from "$tablename$" where "$tablename$".id=_id;

select SuccessWithoutPayloadJSON() into _js;

return _js;

end
$spd$
language plpgsql;
';

_sql:=replace(_sql, '$tablename$', tablename);


call TRACE(_sql);

execute _sql;

end
$spd1$
language plpgsql;






call TRACE('create SP TestDeleteFunctionCreate');

create or replace procedure  TestDeleteFunctionCreate()
as $$
declare
begin

call TRACE( concat('TestDeleteFunctionCreate ') );
call DeleteFunctionCreate('workgroups');

end
$$
language plpgsql;


call TestDeleteFunctionCreate();
