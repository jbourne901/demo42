call TRACE('create SP EntityRegister');

create or replace procedure EntityRegister(entity entitytable.entity%TYPE, tblname entitytable.table%TYPE)
as $$
declare
_entity alias for entity;
_trigger varchar(100);
_sql varchar(500);
begin

call TRACE( concat('registering table ', tblname, ' for entity ', _entity ) );

delete from entitytable where entitytable.entity=_entity or entitytable."table"=tblname;

insert into entitytable(entity, "table")
select _entity, tblname;

_trigger:=concat(_entity, 'Notify');

_sql:=concat('drop trigger if exists ', _trigger, ' on ',tblname,' cascade;');
call TRACE(_sql);
execute  _sql;

_sql:=concat('create trigger ',_trigger,' AFTER INSERT OR UPDATE OR DELETE ON ', tblname, ' for each statement  execute procedure EventNotify(); ');
call TRACE(_sql);
execute  _sql;


end
$$
language plpgsql;


call TRACE('create SP TestEntityRegister');

create or replace procedure TestEntityRegister()
as $$
declare
begin

drop table if exists workgroups;

create table workgroups (id int, name varchar(10) not null);
create unique index ix_worgroups_name on workgroups(name);

call EntityRegister('workgroups', 'Workgroups');

end
$$
language plpgsql;

call TestEntityRegister();

