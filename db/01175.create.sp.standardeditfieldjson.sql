call TRACE('create SP StandardEditFieldJSON');

create or replace function StandardEditFieldJSON(name epagefield.name%TYPE, label epagefield.label%TYPE, type epagefield.type%TYPE, tab epagefield.tab%TYPE)
returns JSONB
as $$
declare
_js JSONB;
begin

_js:='{}';

_js := jsetstr(_js, 'name', name);
_js := jsetstr(_js, 'label', label);
_js := jsetstr(_js, 'tab', coalesce(tab, ''));


if type is null or length(type)=0 then
   type='text';
end if;

_js:=jsetstr(_js, 'type', type);



return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardEditFieldJSON');

create or replace procedure TestStandardEditFieldJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardEditFieldJSON1');


select * from StandardEditFieldJSON('username', 'Username', null, null) into _js;

call TRACE( concat( '1TestStandardEditFieldJSON ', _js) );

select * from StandardEditFieldJSON('password', 'Password', 'password', null) into _js;

call TRACE( concat( '1TestStandardEditFieldJSON ', _js) );

end
$$
language plpgsql;

call TestStandardEditFieldJSON();

