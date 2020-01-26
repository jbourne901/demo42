
call TRACE('create table entitytable');

create table entitytable(
id SERIAL PRIMARY KEY,
entity varchar(100),
"table" varchar(100)
);

create unique index ix_entitytable_entity on entitytable(entity);
create unique index ix_entitytable_table on entitytable("table");

