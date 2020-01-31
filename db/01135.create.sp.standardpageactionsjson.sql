call TRACE('create SP StandardPageActionsJSON');

create or replace function StandardPageActionsJSON(entity varchar(40), options JSONB default null)
returns JSONB
as $$
declare
_add JSONB;
_edit JSONB;
_delete JSONB;
_js JSONB;
begin

select * from StandardAddActionJSON(entity) into _add;
select * from StandardEditActionJSON(entity) into _edit;
select * from StandardDeleteActionJSON(entity) into _delete;

_add := SafeMergeOptionsJSON(options, 'add', _add);
_edit := SafeMergeOptionsJSON(options, 'edit', _edit);
_delete := SafeMergeOptionsJSON(options, 'delete', _delete);



_js:='[]';
_js:= jarraddjson(_js, _add);
_js:= jarraddjson(_js, _edit);
_js:= jarraddjson(_js, _delete);



return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardPageActionsJSON');

create or replace procedure TestStandardPageActionsJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardPageActionsJSON1');


select * from StandardPageActionsJSON('user') into _js;

call TRACE( concat( '1TestStandardPageActionsJSON ', _js) );

end
$$
language plpgsql;

call TestStandardPageActionsJSON();

