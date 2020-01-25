call TRACE('create SP EventNotify');

create or replace function EventNotify()
returns trigger
as $$
declare
_entity entitytable.entity%TYPE;
begin

select entity into _entity from entitytable where "table"=TG_RELNAME;

if _entity is null then
  _entity:=TG_RELNAME;
end if;

PERFORM pg_notify('datachange', _entity);
RETURN NULL;

end
$$
language plpgsql;

