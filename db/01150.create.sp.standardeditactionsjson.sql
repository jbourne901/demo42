call TRACE('create SP StandardEditActionsJSON');

create or replace function StandardEditActionsJSON(entity varchar(40), isadd bool, options JSONB default null)
returns JSONB
as $$
declare
_save JSONB;
_cancel JSONB;
_js JSONB;
begin

_js := '[]';

select * from StandardSaveActionJSON(entity, isadd) into _save;
select * from StandardCancelActionJSON(entity) into _cancel;


_save := SafeMergeOptionsJSON(options, 'save', _save);
_cancel := SafeMergeOptionsJSON(options, 'cancel', _cancel);


_js := jarraddjson(_js, _save);
_js := jarraddjson(_js, _cancel);



return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardEditActionsJSON');

create or replace procedure TestStandardEditActionsJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardEditActionsJSON1');


select * from StandardEditActionsJSON('user', false) into _js;

call TRACE( concat( '1TestStandardEditActionsJSON ', _js) );

end
$$
language plpgsql;

call TestStandardEditActionsJSON();

