call TRACE('create SP PasswordHash');

create or replace function PasswordHash(password varchar(40))
returns varchar(100)
as $$
declare
hash varchar(40);
begin

return crypt(password, 'solosalt');

end
$$
language plpgsql;


call TRACE('create SP TestPasswordHash');

create or replace procedure TestPasswordHash()
as $$
declare
_js varchar(40);
begin

select * into _js from PasswordHash('12345');

call TRACE( concat( 'TestPasswordHash ', _js) );

end
$$
language plpgsql;

call TestPasswordHash();


