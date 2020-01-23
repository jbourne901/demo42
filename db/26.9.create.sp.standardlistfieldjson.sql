call TRACE('create SP StandardListFieldJSON');

create or replace function StandardListFieldJSON(name epagefield.name%TYPE, label epagefield.label%TYPE)
returns JSONB
as $$
declare
_js JSONB;
begin

_js:='{}';

_js:=jsetstr(_js, 'name', name);
_js:=jsetstr(_js, 'label', label);


return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestStandardListFieldJSON');

create or replace procedure TestStandardListFieldJSON()
as $$
declare
_js JSONB;
begin


call TRACE('1TestStandardListFieldJSON1');


select * from StandardListFieldJSON('username', 'Username') into _js;

call TRACE( concat( '1TestStandardListFieldJSON ', _js) );

end
$$
language plpgsql;

call TestStandardListFieldJSON();

