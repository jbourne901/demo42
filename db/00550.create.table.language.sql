
call TRACE('create table language');

create table language(
id SERIAL PRIMARY KEY,
name varchar(50),
language TYPE_LANGUAGE
);

create unique index ix_language_name on language(name);
create unique index ix_language_language on language(language);

------------------------------------------------------------------



