call TRACE('create SP EventNotify');

create or replace function EventNotify()
returns trigger
as $$
declare
begin

PERFORM pg_notify('datachange', TG_RELNAME);
RETURN NULL;

end
$$
language plpgsql;

