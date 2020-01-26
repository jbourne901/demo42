call TRACE('create SP EPageActionSetNextPage');

create or replace function EPageActionSetNextPage( action JSONB, entid bigint )
returns JSONB
as $$
declare
_js alias for action;
_nextpage epageaction.nextpage%TYPE;
_nextid epage.id%TYPE;
_nexttype epage.type%TYPE;
begin

   
   _nextpage := _js->>'nextpage';
   select id, type into _nextid, _nexttype from epage where name=_nextpage;
   if _nextid is not null and _nexttype is not null then
     _nextpage = concat('/epage/',_nextid,'/',_nexttype);
     if entid is not null and entid>0 then
        _nextpage = concat( _nextpage, '/', entid );
     end if;
     select jsetstr(_js, 'nextpage', _nextpage) into _js;
   end if;

   return _js;


end
$$
language plpgsql;


call TRACE('create SP TestEPageActionSetNextPage');

create or replace procedure TestEPageActionSetNextPage()
as $$
declare
_js JSONB;
begin

_js:='{"nextpage": "useredit"}';
select * from EPageActionSetNextPage(_js, 4 ) into _js;

call TRACE( concat('TestEPageActionSetNextPage ', _js) );

end
$$
language plpgsql;

call TestEPageActionSetNextPage();

