call TRACE('create SP AddFunctionCreate');

create or replace procedure AddFunctionCreate(tablename entitytable.table%TYPE)
as $spa1$
declare
_sql varchar(1000);
_cols varchar(1000);
_vals varchar(1000);
_blanks varchar(1000);
_dups varchar(1000);
_comma varchar(1);
_nl varchar(10);
_template_start varchar(1000);
_template_blanks varchar(1000);
_template_end varchar(1000);
_template_dups varchar(1000);
_decls varchar(1000);
_unpacked varchar(1000);
begin

_comma:=',';
_nl:=E'\n';


_template_start:='
create or replace function $tablename$AddJSON(doc JSONB, session TYPE_SESSIONPARAM) 
returns JSONB
as $spc$
declare
_js JSONB;
isValid boolean;
errors JSONB;
_id "$tablename$".id%TYPE;
$decl$
begin
  isValid:=true;
  errors:=''{}'';
  $unpacked$
';


select * from GenVarDecls(tablename, 'id' ) into _decls;

_template_start:=replace(_template_start, '$tablename$', tablename);

_template_start = replace(_template_start, '$decl$', _decls);

select * from GenVarUnpack(tablename, 'doc', 'id') into _unpacked;
_template_start = replace(_template_start, '$unpacked$', _unpacked);



_template_blanks:='
  if _$colname$ is null or length(_$colname$)=0 then 
      isValid:=false;
      errors:=jsetstr(errors, ''$colname$'', ''$colname$ is required'');
  end if;
';


_template_end:=' 
  if isValid then 
      insert into "$tablename$"($cols$)
      select $vals$ returning id into _id;
      select jsetint(''{}'', ''id'', _id) into _js;
      select SuccessWithPayloadJSON(_js) into _js;
  else
      select ErrsJSON(errors) into _js;
  end if;
  return _js;

end
$spc$
language plpgsql;
';

_template_end:=replace(_template_end, '$tablename$', tablename);


_template_dups:='
  if exists (select 1 from "$tablename$" where "$colname$"=_$colname$) then
     isValid:=false;
     errors:=jsetstr(errors, ''$colname$'', ''$colname$ must be unique'');
  end if;
';

_template_dups:=replace(_template_dups, '$tablename$', tablename);

select string_agg( dquot(column_name), _comma ) into _cols from information_schema.columns where table_name=tablename and table_schema='public' and column_name<>'id';
select string_agg( concat('_',column_name), _comma ) into _vals from information_schema.columns where table_name=tablename and table_schema='public' and column_name<>'id';
select string_agg( replace(_template_blanks, '$colname$', column_name), ';' ) into _blanks from information_schema.columns where table_name=tablename and table_schema='public' and column_name<>'id' and is_nullable = 'NO';
select string_agg( replace(_template_dups, '$colname$', a.attname), ';') into _dups from pg_class t, pg_class i, pg_index ix, pg_attribute a, information_schema.columns c where t.oid=ix.indrelid and i.oid = ix.indexrelid and a.attrelid = t.oid and a.attnum = ANY(ix.indkey) and t.relkind = 'r' and  t.relname=tablename and ix.indisunique='t' and a.attname=c.column_name and c.table_schema='public' and c.table_name=tablename and a.attname<>'id';


_sql:=concat( _template_start, _nl,
             _blanks, _nl,
             _dups, _nl,
             replace(replace(_template_end,'$cols$', _cols), '$vals$', _vals)
            );
call TRACE(_sql);

execute _sql;

end
$spa1$
language plpgsql;






call TRACE('create SP TestAddFunctionCreate');

create or replace procedure  TestAddFunctionCreate()
as $$
declare
begin

call TRACE( concat('TestAddFunctionCreate ') );
call AddFunctionCreate('workgroups');

end
$$
language plpgsql;


call TestAddFunctionCreate();
