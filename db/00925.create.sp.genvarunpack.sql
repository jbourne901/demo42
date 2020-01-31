call TRACE(' create procedure GenVarUnpack');

create or replace function GenVarUnpack( tablename varchar(100), doc varchar(100), excluded_column varchar(100) )
returns varchar
as $spvu$
declare
_template_unpacked varchar(1000);
_unpacked varchar(1000);
begin

if doc is null then
  doc:='doc';
end if;

_template_unpacked:='
_$colname$:= $doc$$xx$''$colname$'';
';

_template_unpacked := replace(_template_unpacked, '$doc$', doc);

_template_unpacked:=replace(_template_unpacked, '$tablename$', tablename);

if excluded_column is null then
  excluded_column:='';
end if;


select string_agg( replace( replace(_template_unpacked, '$xx$', case when udt_name like 'json%' then '->' else '->>' end), '$colname$', column_name), '' ) into _unpacked from information_schema.columns where table_name=tablename and table_schema='public' and column_name <> excluded_column;


_unpacked:=coalesce(_unpacked, '');

return _unpacked;

end
$spvu$
language plpgsql;







call TRACE('create SP TestTestGenVarUnpack');

create or replace procedure  TestTestGenVarUnpack()
as $$
declare
_res varchar(1000);
begin

call TRACE( concat('TestTestGenVarUnpack ') );

select * from GenVarUnpack('users', 'doc', 'id' ) into _res;
call TRACE( concat('TestTestGenVarUnpack ', _res) );

select * from GenVarUnpack('agentscenario', 'doc', 'id' ) into _res;
call TRACE( concat('TestTestGenVarUnpack ', _res) );


end
$$
language plpgsql;


call TestTestGenVarUnpack();

