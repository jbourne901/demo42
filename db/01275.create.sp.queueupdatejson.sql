call TRACE('create SP QueueUpdateJSON');

create or replace function QueueUpdateJSON(doc JSONB, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
_name queue.name%TYPE;
_id queue.id%TYPE;
isValid bool;
errors JSONB;
nameInvalid bool;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select doc->>'name' into _name;
select doc->>'id' into _id;

call LOGJSONADD( concat('QueueUpdateJSON1 name=',_name,',_id=',_id), doc);

isValid := true;
nameInvalid := false;

errors := '{}';
_js:='{}';

if exists (select 1 from queue where queue.id=_id) then
  call LOGADD('QueueUpdateJSON1.1 record exists');
else
  call LOGADD('QueueUpdateJSON1.1 record does not exist');
  isValid:=false;
  select jsetstr(errors, 'error', 'Unknown error (record not found)') into errors;
end if;


if _name is null or length(_name)=0 then
  isValid:=false;
  select jsetstr(errors, 'name', 'Name is required') into errors;
end if;

if not nameInvalid and exists (select 1 from queue where name=_name) then
  isValid:=false;
   select jsetstr(errors, 'name', 'Name must be unique') into errors;
end if;


call LOGJSONADD( concat('QueueUpdateJSON2 isValid=',isValid), errors );

if isValid then
  update queue set name=_name where queue.id=_id;
  select SuccessWithoutPayloadJSON() into _js;
else
  select ErrsJSON( errors ) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestQueueUpdateJSON');

create or replace procedure TestQueueUpdateJSON()
as $$
declare
_js JSONB;
_res JSONB;
begin

call TRACE('1TestQueueUpdateJSON1');

_js:='{ "name": "testq", "id": 1 }';

select QueueUpdateJSON(_js, testsession()) into _js;

call TRACE( concat('TestQueueUpdateJSON ', _js) );

end
$$
language plpgsql;

call TestQueueUpdateJSON();

