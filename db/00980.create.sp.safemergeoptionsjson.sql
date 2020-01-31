call TRACE(' create procedure SafeMergeOptonsJSON');

create or replace function SafeMergeOptionsJSON( options_nullable JSONB, field varchar(100), destination_object JSONB)
returns JSONB
as $$
declare
alloption JSONB;
options JSONB;
begin

if options_nullable is not null then

  options := options_nullable -> field;
  alloption := options_nullable -> 'all';

  if alloption is not null then 
    destination_object := destination_object || alloption;
  end if;

  if options is not null then
     destination_object := destination_object || options;
  end if;
end if;

return destination_object;

end
$$
language plpgsql;



call TRACE('create SP TestSafeMergeOptionsJSON');

create or replace procedure  TestSafeMergeOptionsJSON()
as $$
declare
_js JSONB;
begin

select * from SafeMergeOptionsJSON( '{"all": {"location": "top"}, "action": {"style" : "button"} }', 'action', '{"name" : "username"}') into _js;

call TRACE( concat('TestSafeMergeOptionsJSON ', _js) );

end
$$
language plpgsql;


call TestSafeMergeOptionsJSON();

