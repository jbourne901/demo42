call TRACE('create SP UpdateFunctionCreate');

create or replace procedure UpdateFunctionCreate(tablename entitytable.table%TYPE)
as $sp1$
declare
_sql varchar(1000);
_colsvals varchar(1000);
_blanks varchar(1000);
_dups varchar(1000);
_comma varchar(1);
_nl varchar(10);
_template0 varchar(1000);
_template1 varchar(1000);
_template2 varchar(1000);
_template3 varchar(1000);
begin

_comma:=',';
_nl:=E'\n';

_template0:='
create or replace function $tablename$UpdateJSON(doc JSONB, session TYPE_SESSIONPARAM) 
returns JSONB
as $sp2$
declare
_js JSONB;
isValid boolean;
errors JSONB;
_id "$tablename$".id%TYPE;
begin
  isValid:=true;
  errors:=''{}'';
  _id:=doc->>''id'';
  if _id is null then
    isValid:=false;
    errors:=jsetstr(errors, ''error'', ''Update failed'');
  end if;
';

_template0:=replace(_template0, '$tablename$', tablename);


_template1:='
  if doc->>''$colname$'' is null or length(doc->>''$colname$'')=0 then 
      isValid:=false;
      errors:=jsetstr(errors, ''$colname$'', ''$colname$ is required'');
  end if;
';


_template2:=' 
  if isValid then 
      update "$tablename$" set $colsvals$
      where "$tablename$".id=_id;
      select SuccessWithoutPayloadJSON() into _js;
  else
      select ErrsJSON(errors) into _js;
  end if;
  return _js;

end
$sp2$
language plpgsql;
';

_template2:=replace(_template2, '$tablename$', tablename);


_template3:='
  if _id>0 and exists (select 1 from "$tablename$" where "$tablename$".$colname$=doc->>''$colname$'' and "$tablename$".id<>_id) then
     isValid:=false;
     errors:=jsetstr(errors, ''$colname$'', ''$colname$ is must be unique'');
  end if;
';

_template3:=replace(_template3, '$tablename$', tablename);

select string_agg( concat(dquot(column_name), '=', 'doc->>',squot(column_name) ), _comma ) into _colsvals from information_schema.columns where table_name=tablename and table_schema='public' and column_name<>'id';
select string_agg( replace(_template1, '$colname$', column_name), ';' ) into _blanks from information_schema.columns where table_name=tablename and table_schema='public' and column_name<>'id' and is_nullable = 'NO';
select string_agg( replace(_template3, '$colname$', a.attname), ';') into _dups from pg_class t, pg_class i, pg_index ix, pg_attribute a where t.oid=ix.indrelid and i.oid = ix.indexrelid and a.attrelid = t.oid and a.attnum = ANY(ix.indkey) and t.relkind = 'r' and  t.relname=tablename and ix.indisunique='t' and a.attname<>'id';


_sql:=concat( _template0, _nl,
             _blanks, _nl,
             _dups, _nl,
             replace(_template2,'$colsvals$', _colsvals)
            );
call TRACE(_sql);

execute _sql;

end
$sp1$
language plpgsql;






call TRACE('create SP TestUpdateFunctionCreate');

create or replace procedure  TestUpdateFunctionCreate()
as $$
declare
begin

call TRACE( concat('TestUpdateFunctionCreate ') );
call UpdateFunctionCreate('workgroups');

end
$$
language plpgsql;


call TestUpdateFunctionCreate();
