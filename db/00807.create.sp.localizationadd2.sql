call TRACE('create SP LocalizationAdd2');

create or replace procedure LocalizationAdd2(grp localization.grp%TYPE, key localization.key%TYPE, en localization.value%TYPE, es localization.value%TYPE)
as $$
declare
_grp alias for grp;
_key alias for key;
_id localization.id%TYPE;
begin

call LOGADD( concat('LocalizationAdd21 grp=',_grp,',key=',_key,',en=',en,',es=',es));

  insert into localization(grp, key, language, value)
  select _grp, _key, 'en', en;

  insert into localization(grp, key, language, value)
  select _grp, _key, 'es', es;

end
$$
language plpgsql;


call TRACE('create procedure TestLocalizationAdd2');

create or replace procedure TestLocalizationAdd2()
as $$
declare
begin

call TRACE('1TestLocalizationAdd21');


call  LocalizationAdd2('global','workgroup','Workgroup','Grupa de trabajo') ;

call TRACE( concat('TestLocalizationAdd2 ', '') );

end
$$
language plpgsql;

call TestLocalizationAdd2();

