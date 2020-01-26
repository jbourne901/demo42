call TRACE('create SP QueueAddJSON');

create or replace function QueueAddJSON(doc JSONB, session TYPE_SESSIONPARAM)
returns JSONB
as $$
declare
_js JSONB;
_name queue.name%TYPE;
isValid bool;
nameInvalid bool;
errors JSONB;
_id queue.id%TYPE;
begin

select ValidateSessionJSON(session) into _js;

if _js->>'result' = 'Error' then
  return _js;
end if;


select doc->>'name' into _name;

call LOGJSONADD( concat('QueueAddJSON1 name=',_name), doc);

isValid := true;
nameInvalid := false;

errors := '{}';
_js:='{}';

if _name is null or length(_name)=0 then
  isValid:=false;
  select jsetstr(errors, 'name', 'Name is required') into errors;
end if;

if not nameInvalid and exists (select 1 from queue where name=_name) then
  isValid:=false;
   select jsetstr(errors, 'name', 'Name must be unique') into errors;
end if;


call LOGJSONADD( concat('QueueAddJSON2 isValid=',isValid), errors );

if isValid then
  insert into queue(name)
  select _name;
  select queue.id into _id from queue where queue.name=_name;
  select jsetint('{}', 'id', _id) into _js;
  select SuccessWithPayloadJSON(_js) into _js;
else
  select ErrsJSON(errors) into _js;
end if;

return _js;

end
$$
language plpgsql;


call TRACE('create procedure TestQueueAddJSON');

create or replace procedure TestQueueAddJSON()
as $$
declare
_js JSONB;
begin

call TRACE('1TestQueueAddJSON1');

_js:='{ "name": "testqueue" }';

select QueueAddJSON(_js, testsession2()) into _js;

call TRACE( concat('TestQueueAddJSON ', _js) );

end
$$
language plpgsql;

call TestQueueAddJSON();

