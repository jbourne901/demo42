call TRACE(' create procedure GenVarDecls');

create or replace function GenVarDecls( tablename varchar(100), excluded_column varchar(100) )
returns varchar
as $$
declare
_template_decls varchar(1000);
_decls varchar(1000);
begin

_template_decls:='
_$colname$ "$tablename$"."$colname$"%TYPE;
';

_template_decls:=replace(_template_decls, '$tablename$', tablename);

if excluded_column is null then
  excluded_column:='';
end if;


select string_agg( replace(_template_decls, '$colname$', column_name), '' ) into _decls from information_schema.columns where table_name=tablename and table_schema='public' and column_name <> excluded_column;


_decls:=coalesce(_decls, '');

return _decls;

end
$$
language plpgsql;







call TRACE('create SP TestTestGenVarDecls');

create or replace procedure  TestTestGenVarDecls()
as $$
declare
_res varchar(1000);
begin

call TRACE( concat('TestTestGenVarDecls ') );
select * from GenVarDecls('users', 'id' ) into _res;

call TRACE( concat('TestTestGenVarDecls ', _res) );

end
$$
language plpgsql;


call TestTestGenVarDecls();

