call TRACE('create SP StandardTextFieldJSON');

create or replace function StandardTextFieldJSON(name epagefield.name%TYPE, label epagefield.label%TYPE, type epagefield.type%TYPE)
returns JSONB
as $$
declare
_js JSONB;
begin

_js:='{}';

_js:=jsetstr(_js, 'name', name);
_js:=jsetstr(_js, 'label', label);

if type is null or length(type)=0 then
   type='text';
end if;

_js:=jsetstr(_js, 'type', type);



return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardTextFieldJSON');

create or replace procedure TestStandardTextFieldJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardTextFieldJSON1');


select * from StandardTextFieldJSON('username', 'Username', null) into _js;

call TRACE( concat( '1TestStandardTextFieldJSON ', _js) );

select * from StandardTextFieldJSON('password', 'Password', 'password') into _js;

call TRACE( concat( '1TestStandardTextFieldJSON ', _js) );

end
$$
language plpgsql;

call TestStandardTextFieldJSON();

