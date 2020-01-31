call TRACE('create SP UpdateFunctionCreate');

create or replace procedure UpdateFunctionCreate(tablename entitytable.table%TYPE)
as $spu1$
declare
_sql varchar(5000);
_colsvals varchar(5000);
_blanks varchar(5000);
_dups varchar(5000);
_comma varchar(1);
_nl varchar(10);
_template_start varchar(5000);
_template_blanks varchar(5000);
_template2 varchar(5000);
_template_dups varchar(5000);
_decls varchar(5000);
_unpacked varchar(5000);
_template_colval varchar(200);
begin

_comma:=',';
_nl:=E'\n';

select * from GenVarDecls(tablename, 'id') into _decls;
select * from GenVarUnpack(tablename, 'doc', 'id') into _unpacked;

_template_start:='
create or replace function $tablename$UpdateJSON(doc JSONB, session TYPE_SESSIONPARAM) 
returns JSONB
as $spc2$
declare
_js JSONB;
isValid boolean;
errors JSONB;
_id "$tablename$".id%TYPE;
$decl$
begin
  $unpacked$
  isValid:=true;
  errors:=''{}'';
  _id:=doc->>''id'';
  if _id is null then
    isValid:=false;
    errors:=jsetstr(errors, ''error'', ''Update failed'');
  end if;
';

_template_start:=replace(_template_start, '$tablename$', tablename);
_template_start:=replace(_template_start, '$decl$', _decls);
_template_start:=replace(_template_start, '$unpacked$', _unpacked);


_template_blanks:='
  if _$colname$ is null or length(_$colname$)=0 then 
      isValid:=false;
      errors:=jsetstr(errors, ''$colname$'', ''$colname$ is required'');
  end if;
';


_template2:=' 
  if isValid then 
      update "$tablename$" set $colsvals$
      where id=_id;
      select SuccessWithoutPayloadJSON() into _js;
  else
      select ErrsJSON(errors) into _js;
  end if;
  return _js;

end
$spc2$
language plpgsql;
';

_template2:=replace(_template2, '$tablename$', tablename);


_template_dups:='
  if _id>0 and exists (select 1 from "$tablename$" where "$colname$"=_$colname$ and id<>_id) then
     isValid:=false;
     errors:=jsetstr(errors, ''$colname$'', ''$colname$ is must be unique'');
  end if;
';

_template_dups:=replace(_template_dups, '$tablename$', tablename);

-- _template_colval := '"$tablename$"."$colname$" = _$colname$';  can not use tablename , shoes error
_template_colval := '"$colname$" = _$colname$'; 

_template_colval := replace(_template_colval, '$tablename$', tablename);

select string_agg( replace(_template_colval, '$colname$', column_name), _comma ) into _colsvals from information_schema.columns where table_name=tablename and table_schema='public' and column_name<>'id';
select string_agg( replace(_template_blanks, '$colname$', column_name), ';' ) into _blanks from information_schema.columns where table_name=tablename and table_schema='public' and column_name<>'id' and is_nullable = 'NO';
select string_agg( replace(_template_dups, '$colname$', a.attname), ';') into _dups from pg_class t, pg_class i, pg_index ix, pg_attribute a where t.oid=ix.indrelid and i.oid = ix.indexrelid and a.attrelid = t.oid and a.attnum = ANY(ix.indkey) and t.relkind = 'r' and  t.relname=tablename and ix.indisunique='t' and a.attname<>'id';


_sql:=concat( _template_start, _nl,
             _blanks, _nl,
             _dups, _nl,
             replace(_template2,'$colsvals$', _colsvals)
            );
call TRACE(_sql);

execute _sql;

end
$spu1$
language plpgsql;






call TRACE('create SP TestUpdateFunctionCreate');

create or replace procedure  TestUpdateFunctionCreate()
as $$
declare
begin

call TRACE( concat('TestUpdateFunctionCreate ') );
call UpdateFunctionCreate('workgroups');

--call TRACE( concat('TestUpdateFunctionCreate ') );
--call UpdateFunctionCreate('agentscenario');


end
$$
language plpgsql;


call TestUpdateFunctionCreate();
