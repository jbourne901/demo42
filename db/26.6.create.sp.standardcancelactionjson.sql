call TRACE('create SP StandardCancelActionJSON');

create or replace function StandardCancelActionJSON(entity varchar(40))
returns JSONB
as $$
declare
_js JSONB;
_confirm varchar(100);
begin


--//_cancelaction :=  '{"name": "cancel", "label": "Cancel", "type": "redirect", "isitemaction": false, "nextpage": "user"}';
--//_cancelaction = jsetstr(_cancelaction, 'confirm', _confirm);


_js := '{"name": "cancel", "label": "Cancel", "type": "redirect", "isitemaction": false}';

select * from jsetstr(_js, 'nextpage', concat(entity) ) into _js;

_confirm := 'Are you sure? All changes will be lost';
select * from jsetstr(_js, 'confirm', _confirm ) into _js;


return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardCancelActionJSON');

create or replace procedure TestStandardCancelActionJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardCancelActionJSON1');


select * from StandardCancelActionJSON('user') into _js;

call TRACE( concat( '1TestStandardCancelActionJSON ', _js) );

end
$$
language plpgsql;

call TestStandardCancelActionJSON();

