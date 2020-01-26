
call TRACE('create table localization');

drop domain if exists TYPE_LOCALIZATIONKEY;
CREATE DOMAIN TYPE_LOCALIZATIONKEY varchar(50);


create table localization(
id SERIAL PRIMARY KEY,
grp varchar(50),
key TYPE_LOCALIZATIONKEY not null,
language TYPE_LANGUAGE,
value varchar(1000)
);

create unique index ix_localization_grp_key_lang on localization(grp,key,language);
------------------------------------------------------------------


call EntityRegister('localization', 'localization');


--grp - useredit
--key = save
--value Save
