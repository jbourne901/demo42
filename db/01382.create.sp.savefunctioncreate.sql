call TRACE('create SP SaveFunctionCreate');

create or replace procedure SaveFunctionCreate(tablename entitytable.table%TYPE)
as $spa1$
declare
_sql varchar(1000);
_comma varchar(1);
_nl varchar(10);
_template_start varchar(1000);
_template_end varchar(1000);
_decls varchar(1000);
begin

_comma:=',';
_nl:=E'\n';


_template_start:='
create or replace function $tablename$SaveJSON(doc JSONB, session TYPE_SESSIONPARAM) 
returns JSONB
as $sps$
declare
_js JSONB;
_id "$tablename$".id%TYPE;
begin

_id:=doc->''id'';
if _id is not null and _id>0 then
  select * from $tablename$UpdateJSON(doc, session) into _js;
else
  select * from $tablename$AddJSON(doc, session) into _js;
end if;

return _js;
end
$sps$
language plpgsql;
';

_sql := replace(_template_start, '$tablename$', tablename);


call TRACE(_sql);

execute _sql;

end
$spa1$
language plpgsql;






call TRACE('create SP TestSaveFunctionCreate');

create or replace procedure  TestSaveFunctionCreate()
as $$
declare
begin

call TRACE( concat('TestSaveFunctionCreate ') );
call SaveFunctionCreate('workgroups');

end
$$
language plpgsql;


call TestSaveFunctionCreate();
