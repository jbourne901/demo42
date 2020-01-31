call TRACE('create SP ListFunctionCreate');

create or replace procedure ListFunctionCreate(tablename entitytable.table%TYPE)
as $spl1$
declare
_sql varchar(1000);
begin

_sql:='
create or replace function $tablename$ListJSON( session TYPE_SESSIONPARAM )
returns JSONB
as $spc2$
declare
_js JSONB;
begin
   select json_agg(q) into _js from (select * from "$tablename$") q;
   _js:=coalesce(_js,''[]'');
   select SuccessWithPayloadJSON(_js) into _js; 
   return _js;
end
$spc2$
language plpgsql;
';

_sql:=replace(_sql, '$tablename$', tablename);

call TRACE(_sql);

execute _sql;

end
$spl1$
language plpgsql;






call TRACE('create SP TestListFunctionCreate');

create or replace procedure  TestListFunctionCreate()
as $$
declare
begin

call TRACE( concat('TestListFunctionCreate ') );
call ListFunctionCreate('workgroups');

end
$$
language plpgsql;


call TestListFunctionCreate();
