call TRACE('create function ErrsJSON');


create or replace function ErrsJSON(errs JSONB)
returns JSONB
as $$
declare
_js JSONB;
_errors JSONB;
begin

_js:=jsetstr('{}', 'result', 'Error');
_js:=jsetjson(_js, 'errors', errs);

return _js;


end
$$
language plpgsql;




call TRACE('create function TestErrsJSON');

create or replace procedure TestErrsJSON()
as $$
declare
_js JSONB;
_errs JSONB;
begin

_errs:='{"name": "Name is required"}';

select ErrsJSON(_errs) into _js;

call TRACE( concat('ErrsJSON', _js) );


end
$$
language plpgsql;

call TestErrsJSON();








