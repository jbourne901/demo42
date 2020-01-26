call TRACE('create SP LanguageFillJSON');

create or replace procedure LanguageFillJSON()
as $$
declare
begin

delete from language;

insert into language(language, name)
select 'en', 'English';

insert into language(language, name)
select 'es', 'Spanish';


end
$$
language plpgsql;


call LanguageFillJSON();

