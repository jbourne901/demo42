call TRACE('create SP EntityRegister');

create or replace procedure EntityRegister(entity entitytable.entity%TYPE, tblname entitytable.table%TYPE)
as $$
declare
_entity alias for entity;
begin

call TRACE( concat('registering table ', tblname, ' for entity ', _entity ) );

delete from entitytable where entitytable.entity=_entity or entitytable."table"=tblname;

insert into entitytable(entity, "table")
select _entity, tblname;

end
$$
language plpgsql;


call TRACE('create SP TestEntityRegister');

create or replace procedure TestEntityRegister()
as $$
declare
begin

call EntityRegister('workgroups', 'Workgroups');

end
$$
language plpgsql;

call TestEntityRegister();

