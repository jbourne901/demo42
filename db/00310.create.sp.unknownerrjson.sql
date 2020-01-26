call TRACE('create function UnknownErrJSON');


create or replace function UnknownErrJSON()
returns JSONB
as $$
declare
_js JSONB;
_errors JSONB;
begin

_js:='{}';

_js:=jsonb_set(_js, '{result}', '"Error"', true);

_errors:='{"error": "Unknown error"}';

_js:=jsonb_set(_js, '{errors}', _errors, true);

return _js;


end
$$
language plpgsql;




call TRACE('create function TestUnknownErrJSON');

create or replace procedure TestUnknownErrJSON()
as $$
declare
_js JSONB;
begin

select UnknownErrJSON() into _js;

call TRACE( concat('UnknownErrJSON', _js) );


end
$$
language plpgsql;

call TestUnknownErrJSON();








