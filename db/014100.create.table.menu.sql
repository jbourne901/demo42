

call TRACE('create table menu');

create table menu(
id SERIAL PRIMARY KEY,
grp varchar(40),
name varchar(40),
label varchar(40)
);

create unique index ix_menu_name on menu(name);
------------------------------------------------------------------

call EntityRegister('menu', 'menu');


